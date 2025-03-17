import { useId } from 'react';
import { Switch, Label } from '@/components';
import './customSwitch.scss'

type CustomSwitchProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export const CustomSwitch = ({ label, checked, onCheckedChange }: CustomSwitchProps) => {
  const id = useId();
  return (
    <div className="switch">
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange}/>
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
};
