import { Card } from '@/components';
import './customCard.scss';

type CustomCardProps = {
  children: React.ReactNode;
  className?: string;
};

export const CustomCard = ({ children, className }: CustomCardProps) => {
  return <Card className={`custom-card ${className}`}>{children}</Card>;
};
