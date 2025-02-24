import './iconLabel.scss';

type IconLabelProps = {
  iconSrc: string;
  label: string;
};

export const IconLabel = ({ iconSrc, label }: IconLabelProps) => {
  return (
    <div className="icon-label">
      <img src={iconSrc} alt="" />
      <span>{label}</span>
    </div>
  );
};
