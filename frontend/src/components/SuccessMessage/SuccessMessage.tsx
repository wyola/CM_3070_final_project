import './successMessage.scss';

type SuccessMessageProps = {
  message: string;
  imageSrc: string;
  className?: string;
};

export const SuccessMessage = ({
  message,
  imageSrc,
  className,
}: SuccessMessageProps) => {
  return (
    <div className={`${className} success-message`}>
      <img src={imageSrc} alt="" className='success-message__image' />
      <p className='success-message__message'>{message}</p>
    </div>
  );
};
