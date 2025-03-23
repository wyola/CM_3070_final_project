import './feedbackMessage.scss';

type FeedbackMessageProps = {
  message: string;
  imageSrc: string;
  className?: string;
};

export const FeedbackMessage = ({
  message,
  imageSrc,
  className,
}: FeedbackMessageProps) => {
  return (
    <div className={`${className || ''} feedback-message`}>
      <img src={imageSrc} alt="" className="feedback-message__image" />
      <p className="feedback-message__message">{message}</p>
    </div>
  );
};
