import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, CustomFormField, PageTitle } from '@/components';
import { LoginFormDataI, LoginResponseI } from '@/types';
import { API_ENDPOINTS, ORGANIZATION, REGISTER } from '@/constants';
import { axiosInstance } from '@/lib/axios';
import axios from 'axios';
import { useUser } from '@/contexts';
import './login.scss';

export const Login = () => {
  const navigate = useNavigate();
  const [_isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const { setUser } = useUser();

  const methods = useForm<LoginFormDataI>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: LoginFormDataI) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const { data: result } = await axiosInstance.post<LoginResponseI>(
        API_ENDPOINTS.AUTH.LOGIN,
        data
      );

      setUser(result.data.user);
      localStorage.setItem('token', result.data.accessToken);
      localStorage.setItem('refreshToken', result.data.refreshToken);
      navigate(`${ORGANIZATION}/${result.data.user.id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Login failed. Please try again later.');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="content login">
      <PageTitle title="Hello Animal Ally!" />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="login__form">
          <CustomFormField
            label="Email"
            type="email"
            name="email"
            required
            errorMessage={error}
            placeholder="Enter your email"
          />

          <CustomFormField
            label="Password"
            type="password"
            name="password"
            required
            errorMessage={error}
            placeholder="Enter your password"
          />

          <Button type="submit" className="submit-button">
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
