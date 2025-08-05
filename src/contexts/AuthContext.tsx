import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  users: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@nstsdc.com',
    role: 'admin',
    github: 'admin-github',
    linkedin: 'admin-linkedin',
    workStatus: 'busy'
  },
  {
    id: '2',
    name: 'Secretary User',
    email: 'secretary@nstsdc.com',
    role: 'secretary',
    github: 'secretary-github',
    linkedin: 'secretary-linkedin',
    workStatus: 'free'
  },
  {
    id: '3',
    name: 'Member User',
    email: 'member@nstsdc.com',
    role: 'member',
    github: 'member-github',
    linkedin: 'member-linkedin',
    workStatus: 'free'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('nst-sdc-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call your backend
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('nst-sdc-user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nst-sdc-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, users: mockUsers }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};