import { Button, CustomFormField } from '@/components';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router';
import './login.scss';

export const Login = () => {
  const methods = useForm();
  const { handleSubmit } = methods;

  const onSubmit = () => {};

  return (
    <section className="content login">
      <p className="login__header">Hello Animal Ally! Please login below</p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="login__form">
          <CustomFormField
            label="Email"
            type="email"
            name="email"
            id="email"
            required
          />

          <CustomFormField
            label="Password"
            type="password"
            name="password"
            id="password"
            required
          />

          <Button
            type="submit"
            className="submit-button"
            // disabled={isSubmitting}
          >
            Login
          </Button>
        </form>
      </FormProvider>
      <p className="login__register">
        Don't have account? <Link to="/register">Register here &rarr;</Link>
      </p>
    </section>
  );
};
