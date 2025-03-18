import { Report } from '@prisma/client';
import { ReportDto, ReportResponse, ReportStatus } from '../types/report.types';
import { GeolocationService } from './geolocation.service';
import { prisma } from '../lib/prisma-client';

export class ReportService {
  private geolocationService: GeolocationService;

  constructor() {
    this.geolocationService = new GeolocationService();
  }

  async createReport(
    data: ReportDto,
    imagePath?: string
  ): Promise<ReportResponse> {
    // If geolocation is provided directly, use it
    let geolocationData = data.geolocation
      ? JSON.parse(data.geolocation)
      : null;

    // If address is provided but no geolocation, get coordinates
    if (!geolocationData && data.address && data.city) {
      const coordinates =
        await this.geolocationService.getCoordinatesFromAddress({
          address: data.address,
          city: data.city,
          postalCode: data.postalCode || '',
          country: 'Poland',
        });

      if (coordinates) {
        geolocationData = coordinates;
      } else {
        throw new Error(
          'Could not determine geolocation from the provided address'
        );
      }
    }

    // If we still don't have geolocation, throw an error
    if (!geolocationData) {
      throw new Error('Either geolocation or a valid address must be provided');
    }

    const report = await prisma.report.create({
      data: {
        title: data.title,
        description: data.description,
        address: data.address || null,
        city: data.city || null,
        postalCode: data.postalCode || null,
        geolocation: JSON.stringify(geolocationData),
        image: imagePath || null,
        contactName: data.contactName || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        status: ReportStatus.OPEN,
        animals: JSON.stringify(data.animals),
      },
    });

    await this.assignToClosestOrganizations(report);

    return this.getReportById(report.id);
  }

  private async assignToClosestOrganizations(report: Report): Promise<void> {
    if (!report.geolocation) {
      return;
    }

    const reportLocation = JSON.parse(report.geolocation);
    const reportAnimals: string[] = JSON.parse(report.animals);

    const organizations = await prisma.organization.findMany({
      where: {
        acceptsReports: true,
        OR: reportAnimals.map((animal) => ({
          animals: {
            contains: animal,
          },
        })),
      },
      select: {
        id: true,
        name: true,
        geolocation: true,
      },
    });

    const organizationsWithDistance = organizations
      .map((org) => {
        if (!org.geolocation) return null;

        const orgLocation = JSON.parse(org.geolocation);
        const distance = this.geolocationService.calculateDistance(
          reportLocation.lat,
          reportLocation.lon,
          orgLocation.lat,
          orgLocation.lon
        );

        return {
          id: org.id,
          name: org.name,
          distance,
        };
      })
      .filter((org) => org !== null)
      .sort((a, b) => a!.distance - b!.distance)
      .slice(0, 3);

    await Promise.all(
      organizationsWithDistance.map((org) =>
        prisma.reportAssignment.create({
          data: {
            reportId: report.id,
            organizationId: org.id,
          },
        })
      )
    );
  }

  async getReportById(id: number): Promise<ReportResponse> {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        assignments: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!report) {
      throw new Error('Report not found');
    }

    return this.mapReportToResponse(report);
  }

  async getReportsByOrganizationId(
    organizationId: number
  ): Promise<ReportResponse[]> {
    const reportAssignments = await prisma.reportAssignment.findMany({
      where: {
        organizationId,
      },
      include: {
        report: {
          include: {
            assignments: {
              include: {
                organization: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        report: {
          createdAt: 'desc',
        },
      },
    });

    return reportAssignments.map((assignment) =>
      this.mapReportToResponse(assignment.report, undefined, organizationId)
    );
  }

  public async markReportAsViewed(reportId: number, userId: number) {
    const { report, organizationId } = await this.validateReportAccess(
      reportId,
      userId
    );

    // Update the assignment's viewedAt timestamp
    const assignment = report.assignments[0];

    const updatedAssignment = await prisma.reportAssignment.update({
      where: { id: assignment.id },
      data: {
        viewedAt: new Date(),
      },
    });

    return updatedAssignment;
  }

  public async deleteReport(reportId: number, userId: number) {
    await this.validateReportAccess(reportId, userId);

    // Delete all assignments first (due to foreign key constraints)
    await prisma.reportAssignment.deleteMany({
      where: { reportId },
    });

    // Delete the report
    await prisma.report.delete({
      where: { id: reportId },
    });

    return true;
  }

  private async validateReportAccess(reportId: number, userId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.organizationId) {
      throw new Error('User not associated with any organization');
    }

    // Check if the report exists
    const report = await prisma.report.findUnique({
      where: { id: reportId },
      include: {
        assignments: {
          where: { organizationId: user.organizationId },
        },
      },
    });

    if (!report) {
      throw new Error('Report not found');
    }

    if (report.assignments.length === 0) {
      throw new Error('Organization not assigned to this report');
    }

    return { report, organizationId: user.organizationId };
  }

  private mapReportToResponse(
    report: any,
    assignments?: any[],
    organizationId?: number
  ): ReportResponse {
    const reportResponse = {
      id: report.id,
      title: report.title,
      description: report.description,
      address: report.address,
      city: report.city,
      postalCode: report.postalCode,
      geolocation: report.geolocation ? JSON.parse(report.geolocation) : null,
      image: report.image,
      contactName: report.contactName,
      contactEmail: report.contactEmail,
      contactPhone: report.contactPhone,
      status: report.status as ReportStatus,
      createdAt: report.createdAt.toISOString(),
      animals: report.animals ? JSON.parse(report.animals) : [],
      viewed: false,
      assignments: (assignments || report.assignments).map((a: any) => ({
        id: a.id,
        organizationId: a.organizationId,
        organizationName: a.organization.name,
        viewedAt: a.viewedAt?.toISOString() || null,
        createdAt: a.createdAt.toISOString(),
      })),
    };

    if (organizationId) {
      reportResponse.viewed = report.assignments.some(
        (a: any) => a.organizationId === organizationId && a.viewedAt
      );
    }

    return reportResponse;
  }
}
