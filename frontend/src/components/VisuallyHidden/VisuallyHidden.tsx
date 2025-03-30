import './visuallyHidden.scss';

type VisuallyHiddenProps = {
  children: React.ReactNode;
};

export const VisuallyHidden = ({ children }: VisuallyHiddenProps) => {
  return <div className="visually-hidden">{children}</div>;
};
