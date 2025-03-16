import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { UserI, UserContextI } from '@/types';
import { useNavigate } from 'react-router';
import { HOME } from '@/constants';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';

const UserContext = createContext<UserContextI | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
          setUser(data.user);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };

    initializeUser();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate(HOME);
  };

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    logout,
    isLoading,
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
