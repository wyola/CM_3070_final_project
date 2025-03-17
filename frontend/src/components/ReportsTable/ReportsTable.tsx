import { useEffect, useState } from 'react';
import {
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
import { formatDate, mapStatusToLabel } from '@/utils';
import './reportsTable.scss';

export const ReportsTable = () => {
  const [reports, setReports] = useState<ReportI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    { header: 'status', accessor: 'status' },
  ];

  const getCellContent = (report: ReportI, accessor: string) => {
    switch (accessor) {
      case 'createdAt':
        return formatDate(report.createdAt);

      case 'status':
        return (
          <span
            className={`status-badge status-${report.status.toLowerCase()}`}
          >
            {mapStatusToLabel(report.status)}
          </span>
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

  const handleRowClick = (reportId: number) => {};

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
            <TableRow key={report.id} onClick={() => handleRowClick(report.id)}>
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
    </div>
  );
};
