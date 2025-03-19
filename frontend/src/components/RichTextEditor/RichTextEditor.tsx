import { useFormContext } from 'react-hook-form';
import Editor, {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnNumberedList,
  BtnRedo,
  BtnUnderline,
  BtnUndo,
  Separator,
  Toolbar,
} from 'react-simple-wysiwyg';
import './richTextEditor.scss';

interface RichTextEditorProps {
  name: string;
  required?: boolean;
  placeholder?: string;
}

export const RichTextEditor = ({
  name,
  required = false,
  placeholder,
}: RichTextEditorProps) => {
  const { register, setValue, watch } = useFormContext();
  const value = watch(name) || '';

  register(name, {
    required: required ? 'This field is required' : false,
    value: '',
  });
  return (
    <div className="rich-text-editor">
      <Editor
        value={value}
        onChange={(e) =>
          setValue(name, e.target.value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        containerProps={{ className: 'rich-text-container' }}
        placeholder={placeholder}
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
        </Toolbar>
      </Editor>
    </div>
  );
};
