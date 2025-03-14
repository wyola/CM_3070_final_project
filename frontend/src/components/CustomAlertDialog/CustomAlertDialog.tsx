import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components';

type CustomAlertDialog = {
  title: string;
  description: string;
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const CustomAlertDialog = ({
  title,
  description,
  cancelButtonLabel,
  confirmButtonLabel,
  isOpen,
  onCancel,
  onConfirm,
}: CustomAlertDialog) => {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={() => {
        if (isOpen) {
          onCancel();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelButtonLabel}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmButtonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
