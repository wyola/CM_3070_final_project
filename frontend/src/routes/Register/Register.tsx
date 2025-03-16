import { RegisterEditOrganizationForm } from '@/components';
import './register.scss';

export const Register = () => {
  return (
    <section className="content register">
      <h1 className="heading-primary">Register Organization</h1>
      <RegisterEditOrganizationForm />
    </section>
  );
};
