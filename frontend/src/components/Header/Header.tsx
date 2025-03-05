import { Link, NavLink } from 'react-router';
import './header.scss';
import { LOGIN, ORGANIZATION, REPORT } from '@/constants';
import { useUser } from '@/contexts';

export const Header = () => {
  const { user, isAuthenticated } = useUser();
  console.log(user);

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
          <li>
            {isAuthenticated ? (
              <NavLink
                className="header__username"
                to={`${ORGANIZATION}/${user?.id}`}
              >
                Your profile &rarr;
              </NavLink>
            ) : (
              <NavLink to={LOGIN}>Login</NavLink>
            )}{' '}
          </li>
        </ul>
      </nav>
    </header>
  );
};
