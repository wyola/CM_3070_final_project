import { Link, NavLink } from 'react-router';
import './header.scss';

export const Header = () => {
  return (
    <header className="content header">
      <Link to="/" className="header__logo">
        <img src="/logo.svg" alt="logo" className="header__logo--image" />
        <span className="header__logo--name">AnimalAllies</span>
      </Link>
      <nav className="header__nav">
        <ul>
          <li>
            <NavLink to="/report">Report</NavLink>
          </li>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};
