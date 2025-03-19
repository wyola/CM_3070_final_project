import { useController, useFormContext } from 'react-hook-form';
import Editor from 'react-simple-wysiwyg';
import './richTextEditor.scss';

interface RichTextEditorProps {
  name: string;
  required?: boolean;
  placeholder?: string;
}

export const RichTextEditor = ({
  name,
  required = false,
  placeholder = 'Please describe the situation in detail',
}: RichTextEditorProps) => {
  const { control } = useFormContext();
  const { field } = useController({
    name,
    control,
    rules: { required: required ? 'This field is required' : false },
  });

  return (
    <div className="rich-text-editor">
      <Editor
        value={field.value}
        onChange={(e) => field.onChange(e.target.value)}
        containerProps={{ className: 'rich-text-container' }}
        placeholder={placeholder}
      />
    </div>
  );
};
