import { KindsOfNeeds } from '@/types/needs.type';
import { CustomCard } from '../CustomCard/CustomCard';
import { IconLabel } from '../IconLabel/IconLabel';
import { mapKindToLabel } from '@/utils';
import './organizationsNeed.scss';

type OrganizationsNeedProps = {
  id: number;
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
        {priority && <img src="/megaphone.svg" alt="high priority" className='organizations-need__priority' />}
      </div>
      <p className="organizations-need__description">{description}</p>
    </CustomCard>
  );
};
