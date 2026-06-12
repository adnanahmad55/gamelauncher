import React, { useState, useEffect } from 'react';
import { UserPlus, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchUsers, saveUser } from '../services/api';

const UserSection = ({ onSelectUser, selectedUser }) => {
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    
    setLoading(true);
    try {
      await saveUser(newUsername.trim());
      toast.success('User saved successfully');
      setNewUsername('');
      loadUsers();
    } catch (error) {
      toast.error('Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
        <UserPlus className="text-blue-500 dark:text-blue-400" size={20} />
        Account Setup
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">1. Add New Username</label>
          <form onSubmit={handleSaveUser} className="flex gap-2">
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter username..."
              className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 dark:text-gray-100"
            />
            <button 
              type="submit" 
              disabled={loading || !newUsername.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? '...' : 'Save'}
            </button>
          </form>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">2. Select Active Username to Play</label>
          <div className="relative">
            <select
              value={selectedUser}
              onChange={(e) => onSelectUser(e.target.value)}
              className="w-full appearance-none bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer font-medium"
            >
              <option value="">-- Choose Account --</option>
              {users.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSection;
