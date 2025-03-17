import { Link } from 'react-router';
import { ORGANIZATION } from '@/constants';
import './reportSummary.scss';

type ReportSummaryProps = {
  assignedOrganizations: { organizationName: string; organizationId: number }[];
};

export const ReportSummary = ({
  assignedOrganizations,
}: ReportSummaryProps) => {
  return (
    <div className="report-summary">
      <h2 className="report-summary__title">
        Your report was sent to the following organizations:
      </h2>

      {assignedOrganizations.length > 0 ? (
        <ul className="report-summary__list">
          {assignedOrganizations.map((org) => (
            <li key={org.organizationId} className="report-summary__item">
              <Link
                to={`${ORGANIZATION}/${org.organizationId}`}
                className="report-summary__link"
                target="_blank"
              >
                {org.organizationName}
                <img src="/open.svg" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="report-summary__empty">
          No organizations were assigned to this report yet.
        </p>
      )}
    </div>
  );
};
