import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { CustomMultiSelect } from './CustomMultiSelect';

function FormWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('CustomMultiSelect', () => {
  const mockProps = {
    name: 'animals',
    placeholder: 'Select animals',
    options: [
      { value: 'dogs', label: 'Dogs' },
      { value: 'cats', label: 'Cats' },
      { value: 'birds', label: 'Birds' },
    ],
  };

  it('renders with correct placeholder', () => {
    render(
      <FormWrapper>
        <CustomMultiSelect {...mockProps} />
      </FormWrapper>
    );

    expect(screen.getByText(mockProps.placeholder)).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper>
        <CustomMultiSelect {...mockProps} />
      </FormWrapper>
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // Check if all options are rendered
    mockProps.options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('selects multiple options correctly', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper>
        <CustomMultiSelect {...mockProps} />
      </FormWrapper>
    );

    // Open the dropdown
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // Select first option
    const option1 = screen.getByText('Dogs');
    await user.click(option1);

    // Select second option
    const option2 = screen.getByText('Cats');
    await user.click(option2);

    // Verify the count is displayed
    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  it('deselects an option correctly', async () => {
    const user = userEvent.setup();

    // Use a form with initial values
    function FormWrapperWithValues({
      children,
    }: {
      children: React.ReactNode;
    }) {
      const methods = useForm({
        defaultValues: {
          animals: ['dogs', 'cats'],
        },
      });
      return <FormProvider {...methods}>{children}</FormProvider>;
    }

    render(
      <FormWrapperWithValues>
        <CustomMultiSelect {...mockProps} />
      </FormWrapperWithValues>
    );

    // Verify initial state shows correct count
    expect(screen.getByText('2 selected')).toBeInTheDocument();

    // Open the dropdown
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // Deselect first option
    const option = screen.getByText('Dogs');
    await user.click(option);

    // Verify the count is updated
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  it('renders with error message when provided', () => {
    const errorMessage = 'This field is required';
    render(
      <FormWrapper>
        <CustomMultiSelect {...mockProps} errorMessage={errorMessage} />
      </FormWrapper>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders with required indicator when specified', () => {
    render(
      <FormWrapper>
        <CustomMultiSelect {...mockProps} label="Animals" required />
      </FormWrapper>
    );

    const label = screen.getByText('Animals');
    expect(label).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
