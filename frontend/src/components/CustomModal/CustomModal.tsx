import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components';
import './customModal.scss';

type CustomModalProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  buttonLabel: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
  buttonDisabled?: boolean;
};

export const CustomModal = ({
  title,
  description,
  children,
  buttonLabel,
  isOpen,
  onClose,
  onConfirm,
  className,
  buttonDisabled,
}: CustomModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className={`dialog ${className}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={onConfirm}
              disabled={buttonDisabled}
            >
              {buttonLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
