import { useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/constants';
import { ReportI, ReportStatus } from '@/types';

export const useReports = () => {
  const [reports, setReports] = useState<ReportI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const updateReportStatus = async (
    reportId: number,
    newStatus: ReportStatus
  ) => {
    try {
      await axiosInstance.patch(API_ENDPOINTS.REPORT.UPDATE_STATUS(reportId), {
        status: newStatus,
      });

      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId ? { ...report, status: newStatus } : report
        )
      );

      return true;
    } catch (error) {
      console.error('Failed to update report status:', error);
      return false;
    }
  };

  const deleteReport = async (reportId: number) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.REPORT.DELETE(reportId));
      setReports((prevReports) =>
        prevReports.filter((report) => report.id !== reportId)
      );
      return true;
    } catch (error) {
      console.error('Failed to delete report:', error);
      return false;
    }
  };

  const markAsViewed = async (reportId: number) => {
    try {
      await axiosInstance.patch(API_ENDPOINTS.REPORT.MARK_VIEWED(reportId));
      setReports((prevReports) =>
        prevReports.map((r) => (r.id === reportId ? { ...r, viewed: true } : r))
      );
      return true;
    } catch (error) {
      console.error('Failed to mark report as viewed:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    isLoading,
    error,
    updateReportStatus,
    deleteReport,
    markAsViewed,
    refreshReports: fetchReports,
  };
};
