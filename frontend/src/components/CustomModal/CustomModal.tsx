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
    <Dialog open={isOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <Button type="button" variant="link" onClick={onClose}>
            x
          </Button>
        </DialogHeader>
        {children}
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={onConfirm}>
              {buttonLabel}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
