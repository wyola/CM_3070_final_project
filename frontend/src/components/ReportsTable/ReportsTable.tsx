import { useState } from 'react';
import {
  Badge,
  ReportDetailsModal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components';
import { ReportI, ReportStatus } from '@/types';
import { formatDate, mapStatusToLabel, mapStatusToVariant } from '@/utils';
import { useReports } from '@/hooks';
import './reportsTable.scss';

type ReportsTableProps = {
  organizationId: number;
};

export const ReportsTable = ({ organizationId }: ReportsTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportI | null>(null);

  const {
    reports,
    isLoading,
    error,
    markAsViewed,
    updateReportStatus,
    deleteReport,
  } = useReports();

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
    if (!report.viewed) await markAsViewed(report.id);
  };

  const handleClose = () => {
    if (selectedReport) {
      const updatedReport = reports.find((r) => r.id === selectedReport.id);
      setSelectedReport(updatedReport || null);
    }
    setIsModalOpen(false);
  };

  const handleStatusUpdate = async (
    reportId: number,
    newStatus: ReportStatus
  ) => {
    const success = await updateReportStatus(reportId, newStatus);

    if (success && selectedReport && selectedReport.id === reportId) {
      setSelectedReport({
        ...selectedReport,
        status: newStatus,
      });
    }

    return success;
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
                  ? 'reports__table-row--viewed'
                  : 'reports__table-row'
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

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          organizationId={organizationId}
          onClose={handleClose}
          isOpen={isModalOpen}
          updateReportStatus={handleStatusUpdate}
          deleteReport={deleteReport}
        />
      )}
    </div>
  );
};
