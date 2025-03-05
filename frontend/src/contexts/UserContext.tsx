import { createContext, useContext, useState, ReactNode } from 'react';
import { UserI, UserContextI } from '@/types';
import { useNavigate } from 'react-router';
import { HOME } from '@/constants';

const UserContext = createContext<UserContextI | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserI | null>(null);
  const navigate = useNavigate();

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate(HOME);
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser hook must be used in UserProvider');
  }
  return context;
};
