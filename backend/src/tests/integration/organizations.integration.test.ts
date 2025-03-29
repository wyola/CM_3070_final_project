import request from 'supertest';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import app from '../../app';
import { prisma } from '../../lib/prisma-client';

describe('Organizations API', () => {
  let testUser: any;
  let testOrganization: any;
  let secondOrganization: any;
  const testPassword = 'TestPassword123!';
  let accessToken: string;
  let secondUserAccessToken: string;
  const testLogoPath = path.join(__dirname, 'test-logo.png');

  beforeAll(async () => {
    // Create a test logo file if it doesn't exist
    if (!fs.existsSync(testLogoPath)) {
      const buffer = Buffer.from(
        'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        'base64'
      );
      fs.writeFileSync(testLogoPath, buffer);
    }

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
        animals: JSON.stringify(['birds']),
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
        animals: JSON.stringify(['dogs', 'cats']),
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

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testPassword,
    });
    accessToken = loginResponse.body.data.accessToken;

    await prisma.user.create({
      data: {
        email: 'second-user@example.com',
        password: await bcrypt.hash(testPassword, 10),
        organizationId: secondOrganization.id,
      },
    });

    // Get access token for second user
    const secondLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'second-user@example.com',
        password: testPassword,
      });
    secondUserAccessToken = secondLoginResponse.body.data.accessToken;
  });

  describe('GET /api/organizations', () => {
    it('should return a list of all organizations', async () => {
      const response = await request(app).get('/api/organizations');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.organizations)).toBe(true);
      expect(response.body.data.organizations.length).toBeGreaterThanOrEqual(2);

      const orgIds = response.body.data.organizations.map((org: any) => org.id);
      expect(orgIds).toContain(testOrganization.id);
      expect(orgIds).toContain(secondOrganization.id);

      const foundTestOrg = response.body.data.organizations.find(
        (org: any) => org.id === testOrganization.id
      );
      expect(foundTestOrg).toHaveProperty('name', 'Test Organization');
      expect(foundTestOrg).toHaveProperty('email', 'org@example.pl');
      expect(foundTestOrg).toHaveProperty('city', 'Wroclaw');
      expect(foundTestOrg).toHaveProperty('animals', ['birds']);
    });

    it('should filter organizations by city', async () => {
      const response = await request(app).get('/api/organizations?city=Warsaw');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.organizations)).toBe(true);

      const orgIds = response.body.data.organizations.map((org: any) => org.id);
      expect(orgIds).toContain(secondOrganization.id);
    });

    it('should filter organizations by animals', async () => {
      const response = await request(app).get(
        '/api/organizations?animals=dogs'
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data.organizations)).toBe(true);

      const orgIds = response.body.data.organizations.map((org: any) => org.id);
      expect(orgIds).toContain(secondOrganization.id);
    });
  });

  describe('GET /api/organizations/:id', () => {
    it('should return a specific organization by ID', async () => {
      const response = await request(app).get(
        `/api/organizations/${testOrganization.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('organization');
      expect(response.body.organization).toHaveProperty(
        'id',
        testOrganization.id
      );
      expect(response.body.organization).toHaveProperty(
        'name',
        'Test Organization'
      );
      expect(response.body.organization).toHaveProperty('krs', '1234567890');
      expect(response.body.organization).toHaveProperty(
        'email',
        'org@example.pl'
      );
      expect(response.body.organization).toHaveProperty('phone', '123456789');
      expect(response.body.organization).toHaveProperty('city', 'Wroclaw');
      expect(response.body.organization).toHaveProperty('animals', ['birds']);
    });

    it('should return 404 for non-existent organization ID', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app).get(
        `/api/organizations/${nonExistentId}`
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/organization not found/i);
    });
  });

  describe('PUT /api/organizations/:id', () => {
    it('should successfully update organization', async () => {
      const response = await request(app)
        .put(`/api/organizations/${testOrganization.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .field('name', 'Updated Organization Name')
        .field('phone', '+48987654321')
        .field(
          'description',
          'This is an updated description for the test organization'
        )
        .field('animals', JSON.stringify(['dogs', 'cats', 'birds']))
        .field('acceptsReports', 'false')
        .attach('logo', testLogoPath);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Organization updated successfully'
      );
      expect(response.body).toHaveProperty('organization');
      expect(response.body.organization).toHaveProperty(
        'name',
        'Updated Organization Name'
      );
      expect(response.body.organization).toHaveProperty(
        'phone',
        '+48987654321'
      );
      expect(response.body.organization).toHaveProperty(
        'description',
        'This is an updated description for the test organization'
      );
      expect(response.body.organization).toHaveProperty('animals', [
        'dogs',
        'cats',
        'birds',
      ]);
      expect(response.body.organization).toHaveProperty(
        'acceptsReports',
        false
      );
      expect(response.body.organization).toHaveProperty('krs', '1234567890');
    });

    it('should return 401 when token is missing', async () => {
      const response = await request(app)
        .put(`/api/organizations/${testOrganization.id}`)
        .field('name', 'Updated Organization Name');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/authorization header missing/i);
    });

    it('should return 401 when token is invalid', async () => {
      const response = await request(app)
        .put(`/api/organizations/${testOrganization.id}`)
        .set('Authorization', 'Bearer invalid-token')
        .field('name', 'Updated Organization Name');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid or expired token/i);
    });

    it('should return 403 when user is not assigned to the organization', async () => {
      const response = await request(app)
        .put(`/api/organizations/${testOrganization.id}`)
        .set('Authorization', `Bearer ${secondUserAccessToken}`)
        .field('name', 'Updated Organization Name');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/forbidden/i);
    });

    it('should return 400 for invalid postal code format', async () => {
      const response = await request(app)
        .put(`/api/organizations/${testOrganization.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .field('postalCode', '12345'); // Invalid format, should be XX-XXX

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/validation/i);
    });

    it('should return 400 for invalid phone number format', async () => {
      const response = await request(app)
        .put(`/api/organizations/${testOrganization.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .field('phone', 'abc'); // Invalid phone format

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/validation/i);
    });

    it('should return 400 for invalid website URL', async () => {
      const response = await request(app)
        .put(`/api/organizations/${testOrganization.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .field('website', 'not-a-url');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/validation/i);
    });
  });
});
