import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../app';
import { prisma } from '../../lib/prisma-client';
import { KindsOfNeeds } from '../../types/need.types';

describe('Needs API', () => {
  let testUser: any;
  let testOrganization: any;
  let secondOrganization: any;
  let secondUser: any;
  let testNeed: any;
  const testPassword = 'TestPassword123!';
  let accessToken: string;
  let secondUserAccessToken: string;

  beforeAll(async () => {
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

    testNeed = await prisma.need.create({
      data: {
        kind: KindsOfNeeds.food,
        priority: true,
        description: 'Test need description',
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

  describe('POST /api/organizations/:organizationId/needs', () => {
    it('should create a new need successfully', async () => {
      const response = await request(app)
        .post(`/api/organizations/${testOrganization.id}/needs`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          kind: KindsOfNeeds.toys,
          priority: true,
          description: 'We need toys for puppies. Please help us.',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        'message',
        'Need created successfully'
      );
      expect(response.body).toHaveProperty('need');
      expect(response.body.need).toHaveProperty('kind', KindsOfNeeds.toys);
      expect(response.body.need).toHaveProperty('priority', true);
      expect(response.body.need).toHaveProperty(
        'description',
        'We need toys for puppies. Please help us.'
      );
      expect(response.body.need).toHaveProperty(
        'organizationId',
        testOrganization.id
      );
    });

    it('should return 400 for invalid need data', async () => {
      const response = await request(app)
        .post(`/api/organizations/${testOrganization.id}/needs`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          kind: 'invalid-kind',
          priority: true,
          description: 'Test description',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/validation/i);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post(`/api/organizations/${testOrganization.id}/needs`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          priority: true,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/validation/i);
    });

    it('should return 401 when token is missing', async () => {
      const response = await request(app)
        .post(`/api/organizations/${testOrganization.id}/needs`)
        .send({
          kind: KindsOfNeeds.food,
          priority: true,
          description: 'Test description',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/authorization header missing/i);
    });

    it('should return 401 when token is invalid', async () => {
      const response = await request(app)
        .post(`/api/organizations/${testOrganization.id}/needs`)
        .set('Authorization', 'Bearer invalid-token')
        .send({
          kind: KindsOfNeeds.food,
          priority: true,
          description: 'Test description',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid or expired token/i);
    });

    it('should return 403 when user is not assigned to the organization', async () => {
      const response = await request(app)
        .post(`/api/organizations/${testOrganization.id}/needs`)
        .set('Authorization', `Bearer ${secondUserAccessToken}`)
        .send({
          kind: KindsOfNeeds.food,
          priority: true,
          description: 'Test description',
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/forbidden/i);
    });
  });

  describe('GET /api/organizations/:organizationId/needs', () => {
    it('should return all needs for an organization', async () => {
      const response = await request(app).get(
        `/api/organizations/${testOrganization.id}/needs`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Needs retrieved successfully'
      );
      expect(response.body).toHaveProperty('needs');
      expect(Array.isArray(response.body.needs)).toBe(true);
      expect(response.body.needs.length).toBeGreaterThanOrEqual(1);

      const need = response.body.needs.find((n: any) => n.id === testNeed.id);
      expect(need).toBeDefined();
      expect(need).toHaveProperty('kind', KindsOfNeeds.food);
      expect(need).toHaveProperty('priority', true);
      expect(need).toHaveProperty('description', 'Test need description');
    });

    it('should return empty array for organization with no needs', async () => {
      const emptyOrg = await prisma.organization.create({
        data: {
          name: 'Empty Organization',
          krs: '1111111111',
          email: 'empty@example.pl',
          phone: '111111111',
          city: 'Kraków',
          postalCode: '30-001',
          address: 'Empty Street 1',
          voivodeship: 'małopolskie',
          logo: 'empty-logo.jpg',
          animals: JSON.stringify(['dogs', 'cats']),
        },
      });

      const response = await request(app).get(
        `/api/organizations/${emptyOrg.id}/needs`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Needs retrieved successfully'
      );
      expect(response.body).toHaveProperty('needs');
      expect(Array.isArray(response.body.needs)).toBe(true);
      expect(response.body.needs.length).toBe(0);

      // Clean up
      await prisma.organization.delete({
        where: { id: emptyOrg.id },
      });
    });

    it('should return 400 for invalid organization ID', async () => {
      const response = await request(app).get(
        '/api/organizations/invalid-id/needs'
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/organizations/:organizationId/needs/:needId', () => {
    it('should return a specific need by ID', async () => {
      const response = await request(app).get(
        `/api/organizations/${testOrganization.id}/needs/${testNeed.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Need retrieved successfully'
      );
      expect(response.body).toHaveProperty('need');
      expect(response.body.need).toHaveProperty('id', testNeed.id);
      expect(response.body.need).toHaveProperty('kind', KindsOfNeeds.food);
      expect(response.body.need).toHaveProperty('priority', true);
      expect(response.body.need).toHaveProperty(
        'description',
        'Test need description'
      );
    });

    it('should return 404 for non-existent need ID', async () => {
      const nonExistentId = 999999;
      const response = await request(app).get(
        `/api/organizations/${testOrganization.id}/needs/${nonExistentId}`
      );

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/need not found/i);
    });
  });

  describe('PUT /api/organizations/:organizationId/needs/:needId', () => {
    it('should update a need successfully', async () => {
      const response = await request(app)
        .put(`/api/organizations/${testOrganization.id}/needs/${testNeed.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          kind: KindsOfNeeds.medication,
          priority: false,
          description: 'Updated need description',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Need updated successfully'
      );
      expect(response.body).toHaveProperty('need');
      expect(response.body.need).toHaveProperty('id', testNeed.id);
      expect(response.body.need).toHaveProperty(
        'kind',
        KindsOfNeeds.medication
      );
      expect(response.body.need).toHaveProperty('priority', false);
      expect(response.body.need).toHaveProperty(
        'description',
        'Updated need description'
      );
    });

    it('should return 400 for invalid need data', async () => {
      const response = await request(app)
        .put(`/api/organizations/${testOrganization.id}/needs/${testNeed.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          kind: 'invalid-kind',
          priority: true,
          description: 'Test description',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/validation/i);
    });

    it('should return 401 when token is missing', async () => {
      const response = await request(app)
        .put(`/api/organizations/${testOrganization.id}/needs/${testNeed.id}`)
        .send({
          kind: KindsOfNeeds.food,
          priority: true,
          description: 'Test description',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/authorization header missing/i);
    });

    it('should return 403 when user is not assigned to the organization', async () => {
      const response = await request(app)
        .put(`/api/organizations/${testOrganization.id}/needs/${testNeed.id}`)
        .set('Authorization', `Bearer ${secondUserAccessToken}`)
        .send({
          kind: KindsOfNeeds.food,
          priority: true,
          description: 'Test description',
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/forbidden/i);
    });

    it('should return 404 for non-existent need ID', async () => {
      const nonExistentId = 999999;
      const response = await request(app)
        .put(`/api/organizations/${testOrganization.id}/needs/${nonExistentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          kind: KindsOfNeeds.food,
          priority: true,
          description: 'Test description',
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/need not found/i);
    });
  });

  describe('DELETE /api/organizations/:organizationId/needs/:needId', () => {
    it('should delete a need successfully', async () => {
      const needToDelete = await prisma.need.create({
        data: {
          kind: KindsOfNeeds.bedding,
          priority: false,
          description: 'Need to be deleted',
          organizationId: testOrganization.id,
        },
      });

      const response = await request(app)
        .delete(
          `/api/organizations/${testOrganization.id}/needs/${needToDelete.id}`
        )
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Need deleted successfully'
      );

      const deletedNeed = await prisma.need.findUnique({
        where: { id: needToDelete.id },
      });
      expect(deletedNeed).toBeNull();
    });

    it('should return 401 when token is missing', async () => {
      const response = await request(app).delete(
        `/api/organizations/${testOrganization.id}/needs/${testNeed.id}`
      );

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/authorization header missing/i);
    });

    it('should return 403 when user is not assigned to the organization', async () => {
      const response = await request(app)
        .delete(
          `/api/organizations/${testOrganization.id}/needs/${testNeed.id}`
        )
        .set('Authorization', `Bearer ${secondUserAccessToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/forbidden/i);
    });

    it('should return 404 for non-existent need ID', async () => {
      const nonExistentId = 999999;
      const response = await request(app)
        .delete(
          `/api/organizations/${testOrganization.id}/needs/${nonExistentId}`
        )
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/need not found/i);
    });
  });
});
