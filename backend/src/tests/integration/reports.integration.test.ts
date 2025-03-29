import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../app';
import { prisma } from '../../lib/prisma-client';
import { ReportStatus } from '../../types/report.types';

describe('Reports API', () => {
  let testUser: any;
  let testOrganization: any;
  let secondOrganization: any;
  let secondUser: any;
  let testReport: any;
  const testPassword = 'TestPassword123!';
  let accessToken: string;
  let secondUserAccessToken: string;

  beforeAll(async () => {
    await prisma.reportAssignment.deleteMany({
      where: { organization: { name: { startsWith: 'Test' } } },
    });
    await prisma.report.deleteMany({
      where: { title: { startsWith: 'Test Report' } },
    });
    await prisma.user.deleteMany({
      where: { email: { in: ['test@example.com', 'second-user@example.com'] } },
    });
    await prisma.organization.deleteMany({
      where: { name: { in: ['Test Organization', 'Second Organization'] } },
    });

    testOrganization = await prisma.organization.create({
      data: {
        name: 'Test Organization',
        krs: '1234567890',
        email: 'org@example.pl',
        phone: '123456789',
        city: 'Wroclaw',
        postalCode: '50-123',
        address: 'Test Street 123',
        voivodeship: 'dolnośląskie',
        logo: 'test-logo.jpg',
        animals: JSON.stringify(['dogs', 'cats']),
        acceptsReports: true,
        geolocation: JSON.stringify({ lat: 51.1079, lon: 17.0385 }),
      },
    });

    secondOrganization = await prisma.organization.create({
      data: {
        name: 'Second Organization',
        krs: '0987654321',
        email: 'second@example.pl',
        phone: '987654321',
        city: 'Warsaw',
        postalCode: '00-001',
        address: 'Another Street 456',
        voivodeship: 'mazowieckie',
        logo: 'second-logo.jpg',
        animals: JSON.stringify(['birds']),
        acceptsReports: true,
        geolocation: JSON.stringify({ lat: 52.2297, lon: 21.0122 }),
      },
    });

    const hashedPassword = await bcrypt.hash(testPassword, 10);
    testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        organizationId: testOrganization.id,
      },
    });

    secondUser = await prisma.user.create({
      data: {
        email: 'second-user@example.com',
        password: hashedPassword,
        organizationId: secondOrganization.id,
      },
    });

    testReport = await prisma.report.create({
      data: {
        title: 'Test Report',
        description: 'This is a test report',
        address: 'Test Address',
        city: 'Test City',
        postalCode: '12-345',
        geolocation: JSON.stringify({ lat: 52.2297, lon: 21.0122 }),
        status: ReportStatus.OPEN,
        animals: JSON.stringify(['dogs', 'cats']),
      },
    });

    await prisma.reportAssignment.create({
      data: {
        reportId: testReport.id,
        organizationId: testOrganization.id,
      },
    });

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testPassword,
    });
    accessToken = loginResponse.body.data.accessToken;

    const secondLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: secondUser.email,
        password: testPassword,
      });
    secondUserAccessToken = secondLoginResponse.body.data.accessToken;
  });

  describe('PATCH /api/reports/:reportId/mark-viewed', () => {
    it('should mark a report as viewed successfully', async () => {
      const response = await request(app)
        .patch(`/api/reports/${testReport.id}/mark-viewed`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Report marked as viewed successfully'
      );

      const updatedAssignment = await prisma.reportAssignment.findFirst({
        where: {
          reportId: testReport.id,
          organizationId: testOrganization.id,
        },
      });
      expect(updatedAssignment).toHaveProperty('viewedAt');
      expect(updatedAssignment?.viewedAt).not.toBeNull();
    });

    it('should return 401 when token is missing', async () => {
      const response = await request(app).patch(
        `/api/reports/${testReport.id}/mark-viewed`
      );

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/authorization header missing/i);
    });

    it('should return 403 when organization is not assigned to the report', async () => {
      const response = await request(app)
        .patch(`/api/reports/${testReport.id}/mark-viewed`)
        .set('Authorization', `Bearer ${secondUserAccessToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/not assigned/i);
    });

    it('should return 404 for non-existent report ID', async () => {
      const nonExistentId = 999999;
      const response = await request(app)
        .patch(`/api/reports/${nonExistentId}/mark-viewed`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/report not found/i);
    });
  });

  describe('PATCH /api/reports/:reportId/status', () => {
    it('should update a report status successfully', async () => {
      const response = await request(app)
        .patch(`/api/reports/${testReport.id}/status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          status: ReportStatus.IN_PROGRESS,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Report status updated successfully'
      );

      // Verify the report status was updated
      const updatedReport = await prisma.report.findUnique({
        where: { id: testReport.id },
      });
      expect(updatedReport).toHaveProperty('status', ReportStatus.IN_PROGRESS);
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .patch(`/api/reports/${testReport.id}/status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          status: 'INVALID_STATUS',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/validation|invalid status/i);
    });

    it('should return 401 when token is missing', async () => {
      const response = await request(app)
        .patch(`/api/reports/${testReport.id}/status`)
        .send({
          status: ReportStatus.HANDLED,
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/authorization header missing/i);
    });

    it('should return 403 when organization is not assigned to the report', async () => {
      const response = await request(app)
        .patch(`/api/reports/${testReport.id}/status`)
        .set('Authorization', `Bearer ${secondUserAccessToken}`)
        .send({
          status: ReportStatus.HANDLED,
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/not assigned/i);
    });

    it('should return 403 for non-existent report ID', async () => {
      const nonExistentId = 999999;
      const response = await request(app)
        .patch(`/api/reports/${nonExistentId}/status`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          status: ReportStatus.HANDLED,
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/not assigned/i);
    });
  });

  describe('DELETE /api/reports/:reportId', () => {
    it('should delete a report successfully', async () => {
      const reportToDelete = await prisma.report.create({
        data: {
          title: 'Test Report To Delete',
          description: 'This report will be deleted',
          address: 'Delete Address',
          city: 'Delete City',
          postalCode: '12-345',
          geolocation: JSON.stringify({ lat: 52.2297, lon: 21.0122 }),
          status: ReportStatus.OPEN,
          animals: JSON.stringify(['dogs']),
        },
      });

      await prisma.reportAssignment.create({
        data: {
          reportId: reportToDelete.id,
          organizationId: testOrganization.id,
        },
      });

      let deletedReport = await prisma.report.findUnique({
        where: { id: reportToDelete.id },
      });
      expect(deletedReport).not.toBeNull();

      const response = await request(app)
        .delete(`/api/reports/${reportToDelete.id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Report deleted successfully'
      );

      deletedReport = await prisma.report.findUnique({
        where: { id: reportToDelete.id },
      });
      expect(deletedReport).toBeNull();
    });

    it('should return 401 when token is missing', async () => {
      const response = await request(app).delete(
        `/api/reports/${testReport.id}`
      );

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/authorization header missing/i);
    });

    it('should return 403 when organization is not assigned to the report', async () => {
      const response = await request(app)
        .delete(`/api/reports/${testReport.id}`)
        .set('Authorization', `Bearer ${secondUserAccessToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/not assigned/i);
    });

    it('should return 404 for non-existent report ID', async () => {
      const nonExistentId = 999999;
      const response = await request(app)
        .delete(`/api/reports/${nonExistentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/report not found/i);
    });
  });

  describe('POST /api/reports', () => {
    it('should create a new report successfully', async () => {
      await prisma.organization.update({
        where: { id: testOrganization.id },
        data: {
          animals: JSON.stringify(['dogs']),
          acceptsReports: true,
        },
      });

      const response = await request(app)
        .post('/api/reports')
        .field('title', 'New Test Report')
        .field('description', 'This is a new test report created through API')
        .field('address', 'New Test Address')
        .field('city', 'Wroclaw')
        .field('postalCode', '50-123')
        // Use geolocation close to the testOrganization's location
        .field('geolocation', JSON.stringify({ lat: 51.1079, lon: 17.0385 }))
        // animals must match organization's animals
        .field('animals', JSON.stringify(['dogs']))
        .field('contactName', 'Test Reporter')
        .field('contactEmail', 'reporter@example.com')
        .field('contactPhone', '+48123456789');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        'message',
        'Report created successfully'
      );
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('title', 'New Test Report');
      expect(response.body.data).toHaveProperty('status', ReportStatus.OPEN);

      const reportId = response.body.data.id;
      const assignments = await prisma.reportAssignment.findMany({
        where: { reportId },
        include: { organization: true },
      });

      expect(assignments.length).toBeGreaterThan(0);
      const assignedToTestOrg = assignments.some(
        (assignment) => assignment.organizationId === testOrganization.id
      );
      expect(assignedToTestOrg).toBe(true);

      await prisma.reportAssignment.deleteMany({ where: { reportId } });
      await prisma.report.delete({ where: { id: reportId } });
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/reports')
        .field('title', 'Incomplete Report');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/validation|required/i);
    });

    it('should return 400 for invalid postal code format', async () => {
      const response = await request(app)
        .post('/api/reports')
        .field('title', 'Invalid Postal Code Report')
        .field('description', 'This report has an invalid postal code')
        .field('address', 'Test Address')
        .field('city', 'Test City')
        .field('postalCode', 'invalid-format')
        .field('animals', JSON.stringify(['dogs']));

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/validation|postal code/i);
    });
  });
});
