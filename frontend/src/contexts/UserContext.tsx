import { createContext, useContext, useState, ReactNode } from 'react';
import { UserI, UserContextI } from '@/types';

const UserContext = createContext<UserContextI | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserI | null>(null);

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
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
