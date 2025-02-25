import React from 'react';
import './iconLabel.scss';

type IconLabelProps = {
  iconSrc: string;
  children: React.ReactNode;
  className?: string;
};

export const IconLabel = ({ iconSrc, children, className }: IconLabelProps) => {
  return (
    <div className={`icon-label ${className}`}>
      <img src={iconSrc} alt="" />
      {children}
    </div>
  );
};
