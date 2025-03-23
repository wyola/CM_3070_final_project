import { Link } from 'react-router';
import './logo.scss';

export const Logo = () => {
  return (
    <Link to="/" className="logo">
      <img
        src="/logo.png"
        alt="logo"
        className="logo__image"
        width="80"
        height="80"
      />
      <div className="logo__name">
        <p className="logo__name--animal">Animal</p>
        <p className="logo__name--allies">Allies</p>
      </div>
    </Link>
  );
};
