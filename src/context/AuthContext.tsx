import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { storage, checkPremiumStatus } from '../utils/helpers';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage.initAdmin();
    const current = storage.getCurrentUser();
    if (current) {
      const checkedUser = checkPremiumStatus(current);
      setUser(checkedUser);
      storage.setCurrentUser(checkedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    const now = Date.now();
    const updatedUser = { ...userData, lastLogin: now };
    
    // Update in all users list
    const allUsers = storage.getUsers();
    const userIndex = allUsers.findIndex(u => u.id === userData.id);
    if (userIndex !== -1) {
      allUsers[userIndex] = updatedUser;
      storage.setUsers(allUsers);
    }

    setUser(updatedUser);
    storage.setCurrentUser(updatedUser);
  };

  const logout = () => {
    setUser(null);
    storage.setCurrentUser(null);
  };

  const refreshUser = () => {
    const current = storage.getCurrentUser();
    if (current) {
      // Find the latest data for this user from the main users list
      const allUsers = storage.getUsers();
      const latestData = allUsers.find(u => u.id === current.id);
      
      if (latestData) {
        const checkedUser = checkPremiumStatus(latestData);
        setUser(checkedUser);
        storage.setCurrentUser(checkedUser);
      } else {
        // User was deleted or not found
        logout();
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
