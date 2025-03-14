import { KindsOfNeeds } from '@/types';
import { Button, CustomCard, IconLabel } from '@/components';
import { mapKindToLabel } from '@/utils';
import './need.scss';

type OrganizationsNeedProps = {
  id: number; // TODO: check if its needed, can be needed for editing/removing needs
  kind: KindsOfNeeds;
  priority: boolean;
  description: string;
};

export const Need = ({
  id,
  kind,
  priority,
  description,
}: OrganizationsNeedProps) => {
  return (
    <CustomCard className="need">
      <div className="need__header">
        <IconLabel iconSrc={`/needs/${kind}.svg`}>
          {mapKindToLabel(kind)}
        </IconLabel>
        {priority && (
          <img
            src="/megaphone.svg"
            alt="high priority"
            className="need__priority"
          />
        )}
      </div>
      <p className="need__description">{description}</p>
      <div className="need__actions">
        <Button className="need__actions--button" variant="ghost">
          <img src="/edit.svg" />
        </Button>
        <Button className="need__actions--button" variant="ghost">
          <img src="/bin.svg" />
        </Button>
      </div>
    </CustomCard>
  );
};
