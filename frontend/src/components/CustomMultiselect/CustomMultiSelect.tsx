import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import './customMultiSelect.scss';

type CustomMultiSelectProps = {
  name: string;
  placeholder: string;
  options: { value: string; label: string }[];
  id: string;
  label?: string;
  required?: boolean;
  errorMessage?: string;
};

export const CustomMultiSelect = ({
  name,
  placeholder,
  options,
  id,
  label,
  required,
  errorMessage,
}: CustomMultiSelectProps) => {
  const { control, setValue, watch } = useFormContext();
  const selectedValues = watch(name) || [];
  const [isOpen, setIsOpen] = useState(false);

  const handleValueChange = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v: string) => v !== value)
      : [...selectedValues, value];

    setValue(name, newValues, { shouldValidate: true });
  };

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
            open={isOpen}
            onOpenChange={setIsOpen}
            value={field.value}
            onValueChange={() => {}}
          >
            <SelectTrigger>
              <SelectValue placeholder={placeholder}>
                {selectedValues.length > 0
                  ? `${selectedValues.length} selected`
                  : placeholder}
              </SelectValue>
            </SelectTrigger>
            <SelectContent
              onMouseDown={(e) => {
                // Prevent select from closing
                // e.preventDefault();
              }}
              className="multiselect__content"
            >
              {options.map(({ value, label }) => (
                <div
                  key={value}
                  onClick={(e) => {
                    // e.stopPropagation();
                    handleValueChange(value);
                  }}
                  className="multiselect__option"
                >
                  <Checkbox
                    id={`${id}-${value}`}
                    checked={selectedValues.includes(value)}
                    onCheckedChange={() => handleValueChange(value)}
                  />
                  <label
                    htmlFor={`${id}-${value}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {label}
                  </label>
                </div>
              ))}
            </SelectContent>
          </Select>
          {errorMessage && <FormMessage>{errorMessage}</FormMessage>}
        </FormItem>
      )}
    />
  );
};
