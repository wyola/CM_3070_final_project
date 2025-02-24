import './iconLabel.scss';

type IconLabelProps = {
  iconSrc: string;
  label: string;
  className?: string;
};

export const IconLabel = ({ iconSrc, label, className }: IconLabelProps) => {
  return (
    <div className={`icon-label ${className}`}>
      <img src={iconSrc} alt="" />
      <span>{label}</span>
    </div>
  );
};
