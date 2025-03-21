import { NavLink } from 'react-router';
import { Logo, UserMenu, AlertIcon } from '@/components';
import { LOGIN, REPORT } from '@/constants';
import { useUser } from '@/contexts';
import './header.scss';

export const Header = () => {
  const { user, isAuthenticated } = useUser();

  return (
    <header className="header">
      <div className="content header__content">
        <Logo />
        <nav className="header__nav">
          <ul>
            <li>
              <NavLink to={REPORT} className="header__nav--report">
                <AlertIcon width={20} height={20} />
                <span>Report</span>
              </NavLink>
            </li>
            {isAuthenticated ? (
              <li>
                <UserMenu organizationId={user!.organizationId} />
              </li>
            ) : (
              <li>
                <NavLink to={LOGIN}>Login</NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
