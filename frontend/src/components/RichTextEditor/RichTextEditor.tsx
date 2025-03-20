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
  HtmlButton,
  Separator,
  Toolbar,
} from 'react-simple-wysiwyg';
import './richTextEditor.scss';

interface RichTextEditorProps {
  name: string;
  placeholder?: string;
  disabled?: boolean;
}

export const RichTextEditor = ({
  name,
  placeholder,
  disabled,
}: RichTextEditorProps) => {
  const { register, setValue, watch } = useFormContext();
  const value = watch(name) || '';

  register(name);

  return (
      <Editor
        value={value}
        onChange={(e) =>
          setValue(name, e.target.value, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }
        containerProps={{ className: 'rich-text-editor' }}
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
  );
};
