import { useFormContext } from 'react-hook-form';
import Editor, {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnNumberedList,
  BtnRedo,
  BtnUnderline,
  BtnUndo,
  Separator,
  Toolbar,
} from 'react-simple-wysiwyg';
import { FormLabel, FormMessage } from '@/components';
import { getFormFieldError } from '@/utils';
import './richTextEditorFormField.scss';

interface RichTextEditorFormFieldProps {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  formErrors?: Array<{ field: string; message: string }>;
  generalError?: string | null;
}

export const RichTextEditorFormField = ({
  name,
  label,
  placeholder,
  required,
  disabled,
  formErrors = [],
  generalError,
}: RichTextEditorFormFieldProps) => {
  const { register, setValue, watch } = useFormContext();
  const value = watch(name) || '';

  const errorMessage = getFormFieldError(name, formErrors, generalError);

  register(name);

  return (
    <div className="rich-text-editor-form-field">
      <FormLabel htmlFor={name} className="rich-text-editor-form-field__label">
        {label}
        {required && (
          <span className="rich-text-editor-form-field__required"> *</span>
        )}
      </FormLabel>
      <Editor
        value={value}
        onChange={(e) =>
          setValue(name, e.target.value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        containerProps={{ className: 'rich-text-editor-form-field__editor' }}
        placeholder={placeholder}
        disabled={disabled}
      >
        <Toolbar>
          <BtnUndo />
          <BtnRedo />
          <Separator />
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <Separator />
          <BtnNumberedList />
          <BtnBulletList />
          <BtnClearFormatting />
        </Toolbar>
      </Editor>
      {errorMessage && (
        <FormMessage className="rich-text-editor-form-field__error">
          {errorMessage}
        </FormMessage>
      )}
    </div>
  );
};
