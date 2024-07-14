"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  username: string;
}

interface ApiKeyContextType {
  apiKey: string | null;
  setApiKey: (key: string) => void;
  user: User | null;
  setUser: (user: User) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('userApiKey');
    const storedUser = localStorage.getItem('user');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const setApiKeyWithStorage = (key: string) => {
    setApiKey(key);
    localStorage.setItem('userApiKey', key);
  };

  const setUserWithStorage = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  return (
    <ApiKeyContext.Provider value={{ 
      apiKey, 
      setApiKey: setApiKeyWithStorage, 
      user, 
      setUser: setUserWithStorage 
    }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error('useApiKey must be used within an ApiKeyProvider');
  }
  return context;
}