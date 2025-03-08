import { KindsOfNeeds } from '@/types';
import { CustomCard, IconLabel } from '@/components';
import { mapKindToLabel } from '@/utils';
import './organizationsNeed.scss';

type OrganizationsNeedProps = {
  id: number; // TODO: check if its needed, can be needed for editing/removing needs
  kind: KindsOfNeeds;
  priority: boolean;
  description: string;
};

export const OrganizationsNeed = ({
  id,
  kind,
  priority,
  description,
}: OrganizationsNeedProps) => {
  return (
    <CustomCard className="organizations-need">
      <div className="organizations-need__header">
        <IconLabel iconSrc={`/needs/${kind}.svg`}>
          {mapKindToLabel(kind)}
        </IconLabel>
        {priority && (
          <img
            src="/megaphone.svg"
            alt="high priority"
            className="organizations-need__priority"
          />
        )}
      </div>
      <p className="organizations-need__description">{description}</p>
    </CustomCard>
  );
};
