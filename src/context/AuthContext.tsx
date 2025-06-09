
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  dentalOfficeName: string;
  phone: string;
  wilaya: string;
  address: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'isAdmin'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'admin@dentgo.dz';
const ADMIN_PASSWORD = 'admin123';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('dentgo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        id: 'admin',
        email: ADMIN_EMAIL,
        fullName: 'Administrator',
        dentalOfficeName: 'DentGo Admin',
        phone: '+213XXXXXXXXX',
        wilaya: 'Alger',
        address: 'Admin Address',
        isAdmin: true
      };
      setUser(adminUser);
      localStorage.setItem('dentgo_user', JSON.stringify(adminUser));
      return true;
    }

    // Regular user login (in real app, this would be API call)
    const savedUsers = JSON.parse(localStorage.getItem('dentgo_users') || '[]');
    const foundUser = savedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser({ ...userWithoutPassword, isAdmin: false });
      localStorage.setItem('dentgo_user', JSON.stringify({ ...userWithoutPassword, isAdmin: false }));
      return true;
    }
    
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'isAdmin'> & { password: string }): Promise<boolean> => {
    const savedUsers = JSON.parse(localStorage.getItem('dentgo_users') || '[]');
    
    // Check if user already exists
    if (savedUsers.find((u: any) => u.email === userData.email)) {
      return false;
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
      isAdmin: false
    };

    savedUsers.push(newUser);
    localStorage.setItem('dentgo_users', JSON.stringify(savedUsers));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('dentgo_user', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dentgo_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
