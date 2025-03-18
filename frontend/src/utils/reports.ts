import { ReportStatus } from '@/types';

export const mapStatusToLabel = (status: ReportStatus) => {
  switch (status) {
    case ReportStatus.OPEN:
      return 'Open';
    case ReportStatus.IN_PROGRESS:
      return 'In progress';
    case ReportStatus.HANDLED:
      return 'Closed';
  }
};

export const mapStatusToVariant = (
  status: ReportStatus
): 'default' | 'secondary' | 'outline' => {
  switch (status) {
    case ReportStatus.OPEN:
      return 'default';
    case ReportStatus.IN_PROGRESS:
      return 'secondary';
    case ReportStatus.HANDLED:
      return 'outline';
  }
};
