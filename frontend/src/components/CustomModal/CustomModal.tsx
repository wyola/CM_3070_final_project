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

type CustomModalProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  buttonLabel: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  className?: string;
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
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {buttonLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
