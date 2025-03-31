import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { CustomFormField } from './CustomFormField';

function FormWrapper({
  defaultValues = {},
  children,
}: {
  defaultValues?: Record<string, any>;
  children: React.ReactNode;
}) {
  const methods = useForm({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('CustomFormField', () => {
  it('renders a text input with the correct attributes', () => {
    render(
      <FormWrapper>
        <CustomFormField
          name="fullName"
          placeholder="Enter your name"
          type="text"
        />
      </FormWrapper>
    );

    const input = screen.getByPlaceholderText('Enter your name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with a label when provided', () => {
    render(
      <FormWrapper>
        <CustomFormField name="email" label="Email Address" type="email" />
      </FormWrapper>
    );

    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('shows required indicator when field is required', () => {
    render(
      <FormWrapper>
        <CustomFormField
          name="username"
          label="Username"
          required
          type="text"
        />
      </FormWrapper>
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    const errorMessage = 'This field is required';

    render(
      <FormWrapper>
        <CustomFormField
          name="password"
          label="Password"
          type="password"
          errorMessage={errorMessage}
        />
      </FormWrapper>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders a checkbox input', async () => {
    const user = userEvent.setup();

    render(
      <FormWrapper defaultValues={{ acceptTerms: false }}>
        <CustomFormField
          name="acceptTerms"
          label="Accept Terms"
          type="checkbox"
        />
      </FormWrapper>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('pre-checks checkbox when defaultValue is true', () => {
    render(
      <FormWrapper defaultValues={{ acceptTerms: true }}>
        <CustomFormField
          name="acceptTerms"
          label="Accept Terms"
          type="checkbox"
        />
      </FormWrapper>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('applies custom className', () => {
    render(
      <FormWrapper>
        <CustomFormField name="custom" className="custom-class" type="text" />
      </FormWrapper>
    );

    const formItem = screen.getByRole('textbox').closest('.form-item');
    expect(formItem).toHaveClass('custom-class');
  });

  it('handles text input change correctly', async () => {
    const user = userEvent.setup();

    render(
      <FormWrapper defaultValues={{ search: '' }}>
        <CustomFormField name="search" type="text" />
      </FormWrapper>
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'test value');

    expect(input).toHaveValue('test value');
  });

  it('passes additional props to input element', () => {
    render(
      <FormWrapper>
        <CustomFormField
          name="phone"
          type="tel"
          maxLength={10}
          pattern="[0-9]+"
        />
      </FormWrapper>
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'tel');
    expect(input).toHaveAttribute('maxLength', '10');
    expect(input).toHaveAttribute('pattern', '[0-9]+');
  });
});
