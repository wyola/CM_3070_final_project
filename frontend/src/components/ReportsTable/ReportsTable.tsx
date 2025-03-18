import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import {
  Badge,
  CustomModal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components';
import { API_ENDPOINTS, ORGANIZATION } from '@/constants';
import { axiosInstance } from '@/lib/axios';
import { ReportI } from '@/types';
import { formatDate, mapStatusToLabel, mapStatusToVariant } from '@/utils';
import './reportsTable.scss';

type ReportsTableProps = {
  organizationId: number;
};

export const ReportsTable = ({ organizationId }: ReportsTableProps) => {
  const [reports, setReports] = useState<ReportI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportI | null>(null);
  const [copiedGeolocation, setCopiedGeolocation] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(API_ENDPOINTS.REPORT.ALL);
        setReports(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setError('Failed to load reports. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  const columns = [
    { header: 'Date', accessor: 'createdAt' },
    { header: 'Title', accessor: 'title' },
    { header: 'Status', accessor: 'status' },
  ];

  const getCellContent = (report: ReportI, accessor: string) => {
    switch (accessor) {
      case 'createdAt':
        return formatDate(report.createdAt);

      case 'status':
        return (
          <Badge variant={mapStatusToVariant(report.status)}>
            {mapStatusToLabel(report.status)}
          </Badge>
        );

      case 'title':
        return report.title;
    }
  };

  if (isLoading) {
    return <div className="loading">Loading reports...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (reports.length === 0) {
    return <div className="no-reports">No reports found.</div>;
  }

  const handleRowClick = async (report: ReportI) => {
    setSelectedReport(report);
    setIsModalOpen(true);

    try {
      if (!report.viewed) {
        await axiosInstance.patch(API_ENDPOINTS.REPORT.MARK_VIEWED(report.id));

        setReports((prevReports) =>
          prevReports.map((r) =>
            r.id === report.id ? { ...r, viewed: true } : r
          )
        );
      }
    } catch (error) {
      console.error('Failed to mark report as viewed:', error);
    }
  };

  const copyGeoLocation = (lat: number, lon: number) => {
    const text = `${lat} ${lon}`;
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedGeolocation(true);
        setTimeout(() => setCopiedGeolocation(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="reports">
      <h2 className="heading-secondary">Reports</h2>
      <Table className="reports__table">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessor}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow
              key={report.id}
              onClick={() => handleRowClick(report)}
              className={
                report.viewed
                  ? 'reports-table__row--viewed'
                  : 'reports-table__row'
              }
            >
              {columns.map((column) => (
                <TableCell
                  key={`${report.id}-${column.accessor}`}
                  data-column={column.accessor}
                >
                  {getCellContent(report, column.accessor)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CustomModal
        title={selectedReport?.title || 'Report details'}
        buttonLabel="Close"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => setIsModalOpen(false)}
        className="report-modal"
      >
        {selectedReport && (
          <div className="report-details">
            <div className="report-details__date-status">
              <Badge
                variant={mapStatusToVariant(selectedReport.status)}
                className="report-details__date-status--badge"
              >
                {mapStatusToLabel(selectedReport.status)}
              </Badge>
              <span>{formatDate(selectedReport.createdAt)}</span>
            </div>

            <div>
              <h3 className="report-details__subheader">Animals</h3>
              <p>{selectedReport.animals.join(', ')}</p>
            </div>

            <div>
              <h3 className="report-details__subheader">Description</h3>
              <p>{selectedReport.description}</p>
            </div>

            {selectedReport.address && (
              <div>
                <h3 className="report-details__subheader">Address</h3>
                <p>
                  {selectedReport.address}, {selectedReport.postalCode}{' '}
                  {selectedReport.city}
                </p>
              </div>
            )}

            {(selectedReport.contactName ||
              selectedReport.contactEmail ||
              selectedReport.contactPhone) && (
              <div>
                <h3 className="report-details__subheader">
                  Contact Information
                </h3>
                {selectedReport.contactName && (
                  <p>Name: {selectedReport.contactName}</p>
                )}
                {selectedReport.contactEmail && (
                  <p>Email: {selectedReport.contactEmail}</p>
                )}
                {selectedReport.contactPhone && (
                  <p>Phone: {selectedReport.contactPhone}</p>
                )}
              </div>
            )}

            <div className="report-details__geolocation">
              <h3 className="report-details__subheader">Geolocation</h3>
              <button
                onClick={() =>
                  copyGeoLocation(
                    selectedReport.geolocation!.lat,
                    selectedReport.geolocation!.lon
                  )
                }
                tabIndex={0}
                title="Click to copy coordinates"
              >
                {selectedReport.geolocation.lat},{' '}
                {selectedReport.geolocation.lon}
                <img src="/copy.svg" width="16" height="16" />
                {copiedGeolocation && <span> ✓ Copied!</span>}
              </button>
            </div>
            {/* TODO: move to styles file */}
            <div style={{ height: '300px', width: '100%' }}>
              <MapContainer
                center={[
                  selectedReport.geolocation.lat,
                  selectedReport.geolocation.lon,
                ]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={[
                    selectedReport.geolocation.lat,
                    selectedReport.geolocation.lon,
                  ]}
                >
                  {selectedReport.address && (
                    <Popup>
                      {selectedReport.address}, {selectedReport.postalCode}{' '}
                      {selectedReport.city}
                    </Popup>
                  )}
                </Marker>
              </MapContainer>
            </div>

            {selectedReport.image && (
              <div className="report-details__image">
                <h3 className="report-details__subheader">Image</h3>
                <img src={`http://localhost:3000/${selectedReport.image}`} />
              </div>
            )}

            <div className="report-details__assignments">
              <h3 className="report-details__subheader">Assignments</h3>
              <p>This report was also sent to following organizations: </p>
              <ul>
                {selectedReport.assignments
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
                        <img src="/open.svg" width="16" height="16" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  );
};
