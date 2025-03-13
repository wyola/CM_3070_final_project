import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FormField,
  FormItem,
  FormLabel,
} from '@/components';
import { useFormContext } from 'react-hook-form';

type CustomSelectProps = {
  name: string;
  placeholder: string;
  options: { value: string; label: string }[];
  id: string;
  required?: boolean;
  label?: string;
};

export const CustomSelect = ({
  name,
  placeholder,
  options,
  id,
  required,
  label,
}: CustomSelectProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="multiselect form-item">
          {label && (
            <FormLabel htmlFor={id}>
              {label}
              {required && <span className="form-item__required"> *</span>}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            required={required}
          >
            <SelectTrigger id={id}>
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
        </FormItem>
      )}
    />
  );
};
