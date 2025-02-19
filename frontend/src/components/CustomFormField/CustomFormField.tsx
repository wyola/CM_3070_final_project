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
      render={({ field: { onChange, value, ...fieldProps } }) => (
        <FormItem>
          <FormLabel htmlFor={id}>{label}</FormLabel>
          <FormControl>
            <Input
              id={id}
              {...fieldProps}
              onChange={
                inputProps.type === 'file'
                  ? (event) => {
                      const files = event.target.files;
                      if (files?.length) {
                        onChange(files);
                      }
                    }
                  : onChange
              }
              {...(inputProps.type === 'file' ? {} : { value })}
              {...inputProps}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};
