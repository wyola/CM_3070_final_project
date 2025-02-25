import { Button, CustomFormField } from '@/components';
import { FormProvider, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import './login.scss';
import { useState } from 'react';
import { LoginFormData, LoginResponse } from '@/types/login.types';
import { API_ENDPOINTS, ORGANIZATION, REGISTER } from '@/constants';

export const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const result = (await response.json()) as LoginResponse;

      localStorage.setItem('token', result.data.accessToken);

      navigate(`${ORGANIZATION}/${result.data.user.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

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
        Don't have account? <Link to={REGISTER}>Register here &rarr;</Link>
      </p>
    </section>
  );
};
