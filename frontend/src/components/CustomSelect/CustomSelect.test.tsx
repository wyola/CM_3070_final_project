import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { CustomSelect } from './CustomSelect';

function FormWrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe('CustomSelect', () => {
  const mockProps = {
    name: 'animalAlliesSelect',
    placeholder: 'Select an animal',
    options: [
      { value: 'animal1', label: 'Animal 1' },
      { value: 'animal2', label: 'Animal 2' },
      { value: 'animal3', label: 'Animal 3' },
    ],
    id: 'animal-select',
  };

  it('renders with correct placeholder', () => {
    render(
      <FormWrapper>
        <CustomSelect {...mockProps} />
      </FormWrapper>
    );

    expect(screen.getByText(mockProps.placeholder)).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper>
        <CustomSelect {...mockProps} />
      </FormWrapper>
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // Check if all options are rendered
    mockProps.options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('selects an option correctly', async () => {
    const user = userEvent.setup();
    render(
      <FormWrapper>
        <CustomSelect {...mockProps} />
      </FormWrapper>
    );

    // Open the dropdown
    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    // Select an option
    const option = screen.getByText('Animal 2');
    await user.click(option);

    // Check if selected option is displayed in the trigger
    expect(screen.getByText('Animal 2')).toBeInTheDocument();
  });
});
