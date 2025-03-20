import { PageTitle, RegisterEditOrganizationForm } from '@/components';
import './register.scss';

export const Register = () => {
  return (
    <section className="content register">
      <PageTitle title="Register organization" />
      <RegisterEditOrganizationForm />
    </section>
  );
};
