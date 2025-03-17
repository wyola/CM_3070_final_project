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
