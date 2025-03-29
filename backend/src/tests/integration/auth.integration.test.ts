import request from 'supertest';
import bcrypt from 'bcrypt';
import app from '../../app';
import { prisma } from '../../lib/prisma-client';

describe('Authentication API - Login', () => {
  let testUser: any;
  let testOrganization: any;
  const testPassword = 'TestPassword123!';
  let refreshToken: string;
  let accessToken: string;

  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash(testPassword, 10);
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
        animals: 'dogs,cats',
      },
    });
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
    refreshToken = loginResponse.body.data.refreshToken;
    accessToken = loginResponse.body.data.accessToken;
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testPassword,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('id', testUser.id);
      expect(response.body.data.user).toHaveProperty('email', testUser.email);
      // Check that password is not returned
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return 400 with invalid password', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'WrongPassword123!',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid credentials/i);
    });

    it('should return 400 with non-existent user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: testPassword,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid credentials/i);
    });

    it('should return 400 with missing email', async () => {
      const response = await request(app).post('/api/auth/login').send({
        password: testPassword,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid input/i);
    });

    it('should return 400 with missing password', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: testUser.email,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid input/i);
    });

    it('should return 400 with invalid email format', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'not-an-email',
        password: testPassword,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid input/i);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh tokens with valid refresh token', async () => {
      const response = await request(app).post('/api/auth/refresh').send({
        refreshToken,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.refreshToken).not.toBe(refreshToken);
    });

    it('should return 401 with invalid refresh token', async () => {
      const response = await request(app).post('/api/auth/refresh').send({
        refreshToken: 'invalid-token',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid refresh token/i);
    });

    it('should return 400 with missing refresh token', async () => {
      const response = await request(app).post('/api/auth/refresh').send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid input/i);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user information', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', testUser.id);
      expect(response.body.user).toHaveProperty('email', testUser.email);
      expect(response.body.user).toHaveProperty(
        'organizationId',
        testOrganization.id
      );
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 401 when token is missing', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/authorization header missing/i);
    });

    it('should return 401 when token is invalid', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/invalid or expired token/i);
    });
  });
});
