import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components';
import { useId } from 'react';
import { useFormContext } from 'react-hook-form';

type CustomSelectProps = {
  name: string;
  placeholder: string;
  options: { value: string; label: string }[];
  required?: boolean;
  label?: string;
  errorMessage?: string;
};

export const CustomSelect = ({
  name,
  placeholder,
  options,
  required,
  label,
  errorMessage,
}: CustomSelectProps) => {
  const { control } = useFormContext();
  const fieldId = useId();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="multiselect form-item">
          {label && (
            <FormLabel htmlFor={fieldId}>
              {label}
              {required && <span className="form-item__required"> *</span>}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            required={required}
          >
            <SelectTrigger id={fieldId} aria-label={placeholder}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
        </FormItem>
      )}
    />
  );
};
