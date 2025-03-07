import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FormField,
} from '@/components';
import { useFormContext } from 'react-hook-form';

type CustomSelectProps = {
  name: string;
  placeholder: string;
  options: { value: string; label: string }[];
  id: string;
};

export const CustomSelect = ({
  name,
  placeholder,
  options,
  id,
}: CustomSelectProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
      )}
    />
  );
};
