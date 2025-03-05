import { Link, NavLink, useLocation } from 'react-router';
import './header.scss';
import { LOGIN, ORGANIZATION, REPORT } from '@/constants';
import { useUser } from '@/contexts';

export const Header = () => {
  const { user, isAuthenticated, logout } = useUser();
  const location = useLocation();
  const isOwnProfile = location.pathname === `${ORGANIZATION}/${user?.id}`;

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
            <>
              {!isOwnProfile && (
                <li>
                  <NavLink
                    className="header__username"
                    to={`${ORGANIZATION}/${user?.id}`}
                  >
                    Your profile →
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink to={LOGIN} onClick={logout} className="header__logout">
                  Logout
                </NavLink>
              </li>
            </>
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
