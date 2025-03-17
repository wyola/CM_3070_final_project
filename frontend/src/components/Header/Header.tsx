import { Link, NavLink } from 'react-router';
import { UserMenu } from '@/components';
import { LOGIN, REPORT } from '@/constants';
import { useUser } from '@/contexts';
import './header.scss';

export const Header = () => {
  const { user, isAuthenticated } = useUser();

  return (
    <header className="content header">
      <Link to="/" className="header__logo">
        <img src="/logo.svg" alt="logo" className="header__logo--image" />
        <span className="header__logo--name">AnimalAllies</span>
      </Link>
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
    </header>
  );
};
