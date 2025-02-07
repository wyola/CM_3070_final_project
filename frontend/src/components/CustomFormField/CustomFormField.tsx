import { InputHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
} from '@/components';

type CustomFormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  id: string;
};

export const CustomFormField = ({
  label,
  name,
  id,
  ...inputProps
}: CustomFormFieldProps) => {
  const form = useForm();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={id}>{label}</FormLabel>
          <FormControl>
            <Input id={id} {...field} {...inputProps} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
