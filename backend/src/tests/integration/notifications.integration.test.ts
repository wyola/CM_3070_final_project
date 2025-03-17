import request from 'supertest';
import app from '../../app';
import { prisma } from '../../lib/prisma-client';
import { generateAccessToken } from '../../lib/jwt';
import { ReportStatus } from '../../types/report.types';

describe('Notification API', () => {
  let testUser: any;
  let testOrganization: any;
  let testReport: any;
  let testAssignment: any;
  let authToken: string;

  beforeAll(async () => {
    await prisma.reportAssignment.deleteMany({
      where: { organization: { name: { startsWith: 'Test Org' } } },
    });
    await prisma.report.deleteMany({
      where: { title: { startsWith: 'Test Report' } },
    });
    await prisma.refreshToken.deleteMany({
      where: { user: { email: 'test@example.com' } },
    });
    await prisma.user.deleteMany({
      where: { email: 'test@example.com' },
    });
    await prisma.organization.deleteMany({
      where: { name: 'Test Organization' },
    });

    testOrganization = await prisma.organization.create({
      data: {
        name: 'Test Organization',
        krs: '1234567890',
        email: 'org@example.com',
        phone: '123456789',
        city: 'Test City',
        postalCode: '12-345',
        address: 'Test Street 123',
        voivodeship: 'TEST',
        logo: 'test-logo.jpg',
        animals: 'dogs,cats',
        acceptsReports: true,
      },
    });

    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: 'hashed_password_here',
        organizationId: testOrganization.id,
      },
    });

    testReport = await prisma.report.create({
      data: {
        title: 'Test Report for Notifications',
        description: 'This is a test report for testing notifications',
        address: 'Test Address',
        city: 'Test City',
        postalCode: '12-345',
        geolocation: JSON.stringify({ lat: 52.2297, lon: 21.0122 }),
        status: ReportStatus.OPEN,
      },
    });

    authToken = generateAccessToken(testUser.id);
  });

  afterAll(async () => {
    await prisma.reportAssignment.deleteMany({
      where: { reportId: testReport.id },
    });
    await prisma.report.deleteMany({
      where: { id: testReport.id },
    });
    await prisma.user.deleteMany({
      where: { id: testUser.id },
    });
    await prisma.organization.deleteMany({
      where: { id: testOrganization.id },
    });
    await prisma.$disconnect();
  });

  describe('GET /api/notifications/count', () => {
    it('should return 401 if no auth token is provided', async () => {
      const response = await request(app).get('/api/notifications/count');
      expect(response.status).toBe(401);
    });

    it('should return 0 when there are no unread notifications', async () => {
      const response = await request(app)
        .get('/api/notifications/count')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count', 0);
    });

    it('should return the correct count when there are unread notifications', async () => {
      // Create an unread assignment
      testAssignment = await prisma.reportAssignment.create({
        data: {
          reportId: testReport.id,
          organizationId: testOrganization.id,
          viewedAt: null,
        },
      });

      const response = await request(app)
        .get('/api/notifications/count')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count', 1);
    });

    it('should not count read notifications', async () => {
      // Update the assignment to be viewed
      await prisma.reportAssignment.update({
        where: { id: testAssignment.id },
        data: { viewedAt: new Date() },
      });

      const response = await request(app)
        .get('/api/notifications/count')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count', 0);
    });

    it('should count multiple unread notifications', async () => {
      const anotherReport = await prisma.report.create({
        data: {
          title: 'Test Report 2 for Notifications',
          description: 'This is another test report for testing notifications',
          address: 'Test Address 2',
          city: 'Test City',
          postalCode: '12-345',
          geolocation: JSON.stringify({ lat: 52.2297, lon: 21.0122 }),
          status: ReportStatus.OPEN,
        },
      });

      await prisma.reportAssignment.deleteMany({
        where: {
          reportId: testReport.id,
          organizationId: testOrganization.id,
        },
      });

      await prisma.reportAssignment.create({
        data: {
          reportId: testReport.id,
          organizationId: testOrganization.id,
          viewedAt: null,
        },
      });

      await prisma.reportAssignment.create({
        data: {
          reportId: anotherReport.id,
          organizationId: testOrganization.id,
          viewedAt: null,
        },
      });

      const response = await request(app)
        .get('/api/notifications/count')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count', 2);

      // Clean up the additional report
      await prisma.reportAssignment.deleteMany({
        where: { reportId: anotherReport.id },
      });
      await prisma.report.delete({
        where: { id: anotherReport.id },
      });
    });
  });
});
