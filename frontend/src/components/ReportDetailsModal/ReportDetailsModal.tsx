import { useState } from 'react';
import { Link } from 'react-router';
import DOMPurify from 'dompurify';
import {
  Badge,
  Button,
  CustomAlertDialog,
  CustomModal,
  LocationMap,
} from '@/components';
import { ReportI, ReportStatus } from '@/types';
import { formatDate, mapStatusToLabel, mapStatusToVariant } from '@/utils';
import { ORGANIZATION } from '@/constants';
import './reportDetailsModal.scss';

type ReportDetailsModalProps = {
  report: ReportI;
  organizationId: number;
  onClose: () => void;
  isOpen: boolean;
  updateReportStatus: (
    reportId: number,
    status: ReportStatus
  ) => Promise<boolean>;
  deleteReport: (reportId: number) => Promise<boolean>;
};

export const ReportDetailsModal = ({
  report,
  organizationId,
  onClose,
  isOpen,
  updateReportStatus,
  deleteReport,
}: ReportDetailsModalProps) => {
  const [copiedGeolocation, setCopiedGeolocation] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!report) return null;

  const copyGeoLocation = (lat: number, lon: number) => {
    const text = `${lat} ${lon}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedGeolocation(true);
        setTimeout(() => setCopiedGeolocation(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleDeleteConfirm = async () => {
    if (report) {
      await deleteReport(report.id);
      onClose();
      setShowDeleteConfirm(false);
    }
  };

  return (
    <CustomModal
      title={report.title || 'Report details'}
      buttonLabel="Close modal"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onClose}
      className="report-modal"
    >
      <div className="report-details">
        <div className="report-details__date-status">
          <Badge
            variant={mapStatusToVariant(report.status)}
            className="report-details__date-status--badge"
          >
            {mapStatusToLabel(report.status)}
          </Badge>
          <span>{formatDate(report.createdAt)}</span>
        </div>

        <div>
          <h3 className="report-details__subheader">Animals</h3>
          <p>{report.animals.join(', ')}</p>
        </div>

        <div>
          <h3 className="report-details__subheader">Description</h3>
          <div
            className="report-details__description"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(report.description, {
                USE_PROFILES: { html: true },
              }),
            }}
          />
        </div>

        {report.address && (
          <div>
            <h3 className="report-details__subheader">Address</h3>
            <p>
              {report.address}, {report.postalCode} {report.city}
            </p>
          </div>
        )}

        {(report.contactName || report.contactEmail || report.contactPhone) && (
          <div>
            <h3 className="report-details__subheader">Contact Information</h3>
            {report.contactName && <p>Name: {report.contactName}</p>}
            {report.contactEmail && <p>Email: {report.contactEmail}</p>}
            {report.contactPhone && <p>Phone: {report.contactPhone}</p>}
          </div>
        )}

        <div className="report-details__geolocation">
          <h3 className="report-details__subheader">Geolocation</h3>
          <button
            onClick={() =>
              copyGeoLocation(report.geolocation.lat, report.geolocation.lon)
            }
            title="Click to copy coordinates"
          >
            {report.geolocation.lat}, {report.geolocation.lon}
            <img src="/copy.svg" width="16" height="16" />
            {copiedGeolocation && <span> ✓ Copied!</span>}
          </button>
        </div>

        <LocationMap
          geolocation={report.geolocation}
          popupHeader={report.title}
          fullAddress={
            report.address
              ? {
                  address: report.address || '',
                  postalCode: report.postalCode || '',
                  city: report.city || '',
                }
              : undefined
          }
        />

        {report.image && (
          <div className="report-details__image">
            <h3 className="report-details__subheader">Image</h3>
            <img
              src={`http://localhost:3000/${report.image}`}
              alt="Report image"
            />
          </div>
        )}

        <div className="report-details__assignments">
          <h3 className="report-details__subheader">Assignments</h3>
          <p>This report was also sent to following organizations: </p>
          <ul>
            {report.assignments
              .filter(
                (assignment) => assignment.organizationId !== organizationId
              )
              .map((assignment) => (
                <li key={assignment.id}>
                  <Link
                    to={`${ORGANIZATION}/${assignment.organizationId}`}
                    className="report-details__assignments--link"
                    target="_blank"
                  >
                    {assignment.organizationName}
                    <img
                      src="/open.svg"
                      width="16"
                      height="16"
                      alt="Open in new tab"
                    />
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div className="report-details__actions">
          <h3 className="report-details__subheader">Actions</h3>
          <div className="report-details__actions--buttons">
            {report.status !== ReportStatus.OPEN && (
              <Button
                onClick={() => updateReportStatus(report.id, ReportStatus.OPEN)}
              >
                Mark as {mapStatusToLabel(ReportStatus.OPEN)}
              </Button>
            )}

            {report.status !== ReportStatus.IN_PROGRESS && (
              <Button
                variant="secondary"
                onClick={() =>
                  updateReportStatus(report.id, ReportStatus.IN_PROGRESS)
                }
              >
                Mark as {mapStatusToLabel(ReportStatus.IN_PROGRESS)}
              </Button>
            )}

            {report.status !== ReportStatus.HANDLED && (
              <Button
                variant="outline"
                onClick={() =>
                  updateReportStatus(report.id, ReportStatus.HANDLED)
                }
              >
                Mark as {mapStatusToLabel(ReportStatus.HANDLED)}
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete report
            </Button>
          </div>
        </div>

        {showDeleteConfirm && (
          <CustomAlertDialog
            title="Delete Report"
            description="Are you sure you want to delete this report? This action cannot be undone."
            cancelButtonLabel="Cancel"
            confirmButtonLabel="Delete"
            isOpen={showDeleteConfirm}
            onCancel={() => setShowDeleteConfirm(false)}
            onConfirm={() => {
              handleDeleteConfirm();
              setShowDeleteConfirm(false);
            }}
          />
        )}
      </div>
    </CustomModal>
  );
};
