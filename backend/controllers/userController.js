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
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
};

export const addUser = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const users = await getUsers();
    
    // check if user already exists
    if (!users.includes(username)) {
      users.push(username);
      await saveUsers(users);
    }

    res.status(201).json({ message: 'User saved successfully', username });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Failed to save user' });
  }
};
