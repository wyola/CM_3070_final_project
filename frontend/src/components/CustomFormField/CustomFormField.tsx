import { InputHTMLAttributes } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
} from '@/components';
import { useFormContext } from 'react-hook-form';

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
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
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
