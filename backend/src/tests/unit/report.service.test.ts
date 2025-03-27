import { ReportService } from '../../services/report.service';
import { prisma } from '../../lib/prisma-client';
import { GeolocationService } from '../../services/geolocation.service';

jest.mock('../../lib/prisma-client', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    report: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../../services/geolocation.service');

describe('ReportService', () => {
  let reportService: ReportService;

  beforeEach(() => {
    jest.clearAllMocks();
    reportService = new ReportService();
  });

  describe('validateReportAccess', () => {
    const validateReportAccess = async (reportId: number, userId: number) => {
      return (reportService as any).validateReportAccess(reportId, userId);
    };

    it('should return report and organizationId when access is valid', async () => {
      const mockUser = { id: 1, organizationId: 2 };
      const mockReport = {
        id: 5,
        assignments: [{ id: 10, organizationId: 2 }],
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (prisma.report.findUnique as jest.Mock).mockResolvedValue(mockReport);

      // Call the method
      const result = await validateReportAccess(5, 1);

      expect(result).toEqual({
        report: mockReport,
        organizationId: 2,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.report.findUnique).toHaveBeenCalledWith({
        where: { id: 5 },
        include: {
          assignments: {
            where: { organizationId: 2 },
          },
        },
      });
    });

    it('should throw error when user is not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(validateReportAccess(5, 1)).rejects.toThrow(
        'User not associated with any organization'
      );

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw error when user has no organization', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        organizationId: null,
      });

      await expect(validateReportAccess(5, 1)).rejects.toThrow(
        'User not associated with any organization'
      );
    });

    it('should throw error when report is not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        organizationId: 2,
      });
      (prisma.report.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(validateReportAccess(5, 1)).rejects.toThrow(
        'Report not found'
      );
    });

    it('should throw error when organization is not assigned to report', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 1,
        organizationId: 2,
      });
      (prisma.report.findUnique as jest.Mock).mockResolvedValue({
        id: 5,
        assignments: [],
      });

      await expect(validateReportAccess(5, 1)).rejects.toThrow(
        'Organization not assigned to this report'
      );
    });
  });
});
