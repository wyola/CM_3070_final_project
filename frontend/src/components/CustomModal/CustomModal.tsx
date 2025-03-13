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
};

export const CustomModal = ({
  title,
  description,
  children,
  buttonLabel,
  isOpen,
  onClose,
  onConfirm,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
        <DialogFooter className="sm:justify-start">
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
