import { InputHTMLAttributes } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/components';
import { useFormContext } from 'react-hook-form';
import './customFormField.scss';

type CustomFormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  id: string;
  label?: string;
  className?: string;
  required?: boolean;
  errorMessage?: string;
};

export const CustomFormField = ({
  name,
  id,
  label,
  className,
  required,
  errorMessage,
  ...inputProps
}: CustomFormFieldProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, ...fieldProps } }) => (
        <FormItem className={`${className} form-item`}>
          {label && (
            <FormLabel htmlFor={id}>
              {label}
              {required && <span className="form-item__required"> *</span>}
            </FormLabel>
          )}
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
          <FormMessage className="form-item__message">
            {errorMessage}
          </FormMessage>
        </FormItem>
      )}
    />
  );
};
