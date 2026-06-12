import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const saveUser = async (username) => {
  const response = await axios.post(`${API_URL}/users`, { username });
  return response.data;
};

export const generateLinks = async (username) => {
  const response = await axios.post(`${API_URL}/generate-links`, { username });
  return response.data;
};

export const getGames = async () => {
  const response = await axios.get(`${API_URL}/games`);
  return response.data;
};
