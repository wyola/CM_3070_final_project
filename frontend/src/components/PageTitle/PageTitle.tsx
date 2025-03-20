import './pageTitle.scss';

type PageTitleProps = {
  title: string;
};

export const PageTitle = ({ title }: PageTitleProps) => {
  return <h1 className="heading-primary page-title">{title}</h1>;
};
