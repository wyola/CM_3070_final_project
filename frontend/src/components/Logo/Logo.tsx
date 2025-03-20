import { Link } from 'react-router';
import './logo.scss';

export const Logo = () => {
  return (
    <Link to="/" className="logo">
      <img
        src="/logo.svg"
        alt="logo"
        className="logo__image"
        width="40"
        height="40"
      />
      <span className="logo__name">AnimalAllies</span>
    </Link>
  );
};
