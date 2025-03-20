import { NavLink } from 'react-router';
import { Logo, UserMenu } from '@/components';
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
              <NavLink to={REPORT}>Report</NavLink>
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
