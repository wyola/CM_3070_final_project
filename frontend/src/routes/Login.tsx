import { Link } from 'react-router';

export const Login = () => {
  return (
    <section className="content">
      <p>hello! Login here </p>
      <p>
        Don't have account? <Link to="/register">Register</Link>
      </p>
    </section>
  );
};
