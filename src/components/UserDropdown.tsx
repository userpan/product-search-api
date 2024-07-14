"use client";

import React, { useState, useEffect } from 'react';
import { useApiKey } from '../contexts/ApiKeyContext';

interface User {
  id: string;
  username: string;
}

const UserDropdown: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { setApiKey, setUser, user } = useApiKey();
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data: User[] = await response.json();
        setUsers(data);
        if (data.length > 0) {
          if (!user) {
            handleUserChange(data[0].id);
          } else {
            setSelectedUserId(user.id);
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (user) {
      setSelectedUserId(user.id);
    }
  }, [user]);

  const handleUserChange = async (userId: string) => {
    setSelectedUserId(userId);
    try {
      const response = await fetch(`/api/users/${userId}/api-key`);
      if (!response.ok) {
        throw new Error('Failed to fetch API key');
      }
      const data: { api_key: string } = await response.json();
      if (data.api_key) {
        setApiKey(data.api_key);
        const selectedUser = users.find(u => u.id === userId);
        if (selectedUser) {
          setUser(selectedUser);
        }
        console.log('API Key set:', data.api_key);
      }
    } catch (error) {
      console.error('Error fetching API key:', error);
    }
  };

  return (
    <select 
      value={selectedUserId}
      onChange={(e) => handleUserChange(e.target.value)}
      className="bg-[#942FFB] text-white border border-white rounded px-2 py-1"
    >
      <option value="" disabled>Select a user</option>
      {users.map((u) => (
        <option key={u.id} value={u.id}>{u.username}</option>
      ))}
    </select>
  );
};

export default UserDropdown;