import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components';
import { API_ENDPOINTS, LOGIN, ORGANIZATION } from '@/constants';
import { useUser } from '@/contexts';
import { axiosInstance } from '@/lib/axios';
import './userMenu.scss';

type UserMenuProps = {
  organizationId: number;
};

export const UserMenu = ({ organizationId }: UserMenuProps) => {
  const [reportCount, setReportCount] = useState(0);
  const { logout } = useUser();

  useEffect(() => {
    const fetchReportCount = async () => {
      try {
        const response = await axiosInstance.get(
          API_ENDPOINTS.NOTIFICATIONS.COUNT
        );
        setReportCount(response.data.count);
      } catch (error) {
        console.error('Failed to fetch notification count:', error);
      }
    };

    fetchReportCount();

    const interval = setInterval(fetchReportCount, 60000); // fetch notifications every 1 minute
    return () => clearInterval(interval);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="user-menu__trigger">
        <img src="/avatar.svg" alt="user avatar" width="32" height="32" />
        <Badge variant="destructive" className="user-menu__trigger--badge">
          {reportCount < 10 ? reportCount : '9+'}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="user-menu__content">
        <DropdownMenuItem className="user-menu__item">
          <Link to={`${ORGANIZATION}/${organizationId}`}>Your profile →</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to={LOGIN} onClick={logout}>
            Logout
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
