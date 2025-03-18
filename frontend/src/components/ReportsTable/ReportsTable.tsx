import { useEffect, useState } from 'react';
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
import { API_ENDPOINTS } from '@/constants';
import { axiosInstance } from '@/lib/axios';
import { ReportI } from '@/types';
import { formatDate, mapStatusToLabel, mapStatusToVariant } from '@/utils';
import './reportsTable.scss';
import { report } from 'process';

export const ReportsTable = () => {
  const [reports, setReports] = useState<ReportI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportI | null>(null);

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

  const handleRowClick = (report: ReportI) => {
    setSelectedReport(report);
    setIsModalOpen(true);
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
            <TableRow key={report.id} onClick={() => handleRowClick(report)}>
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
      >
        {selectedReport ? (
          <div className="report-details">
            <p>
              <strong>Status:</strong> {mapStatusToLabel(selectedReport.status)}
            </p>
            <p>
              <strong>Date:</strong> {formatDate(selectedReport.createdAt)}
            </p>
            <p>
              <strong>Description:</strong> {selectedReport.description}
            </p>

            {selectedReport.address && (
              <>
                <p>
                  <strong>Address:</strong> {selectedReport.address}
                </p>
                <p>
                  <strong>City:</strong> {selectedReport.city}
                </p>
                <p>
                  <strong>Postal Code:</strong> {selectedReport.postalCode}
                </p>
              </>
            )}

            {selectedReport.geolocation && (
              <p>
                <strong>Location:</strong> Lat: {selectedReport.geolocation.lat}
                , Lon: {selectedReport.geolocation.lon}
              </p>
            )}

            {selectedReport.animals && selectedReport.animals.length > 0 && (
              <p>
                <strong>Animals:</strong> {selectedReport.animals.join(', ')}
              </p>
            )}

            {selectedReport.contactName && (
              <div className="contact-info">
                <h4>Contact Information</h4>
                <p>
                  <strong>Name:</strong> {selectedReport.contactName}
                </p>
                {selectedReport.contactEmail && (
                  <p>
                    <strong>Email:</strong> {selectedReport.contactEmail}
                  </p>
                )}
                {selectedReport.contactPhone && (
                  <p>
                    <strong>Phone:</strong> {selectedReport.contactPhone}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p>No report selected</p>
        )}
      </CustomModal>
    </div>
  );
};
