import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, '../data/users.json');

const getUsers = async () => {
  try {
    const data = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const saveUsers = async (users) => {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
};

export const getAllUsers = async (req, res) => {
  try {
    const data = await fs.readFile(usersFilePath, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    // If file doesn't exist (e.g. on live server where it's ignored by git), return empty array
    if (error.code === 'ENOENT') {
      return res.json([]);
    }
    res.status(500).json({ error: 'Failed to read users' });
  }
};

export const addUser = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    let users = [];
    try {
      const data = await fs.readFile(usersFilePath, 'utf8');
      users = JSON.parse(data);
    } catch (err) {
      // Ignore if file doesn't exist, we will create it
      if (err.code !== 'ENOENT') throw err;
    }

    if (!users.includes(username)) {
      users.push(username);
      
      // Ensure the data directory exists before writing
      await fs.mkdir(path.dirname(usersFilePath), { recursive: true });
      await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
    }
    
    res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Failed to save user' });
  }
};
