import request from 'supertest';
import app from '../../app';
import path from 'path';
import fs from 'fs';

const validKRS = '0000000963'; 
const invalidKRS = '123';

describe('Organization Registration Integration Tests', () => {
  const testLogoPath = path.join(__dirname, 'test-logo.png');
  
  beforeAll(() => {
    // Create a test logo file if it doesn't exist
    if (!fs.existsSync(testLogoPath)) {
      const buffer = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
      fs.writeFileSync(testLogoPath, buffer);
    }
  });
  
  it('should register a new organization successfully', async () => {
    const response = await request(app)
      .post('/api/organizations')
      .field('name', 'Test Organization')
      .field('krs', validKRS)
      .field('email', 'test@example.com')
      .field('password', 'Password123!')
      .field('phone', '+48123456789')
      .field('city', 'Warszawa')
      .field('postalCode', '00-001')
      .field('address', 'Test Street 123')
      .field('voivodeship', 'MAZOWIECKIE')
      .field('animals', JSON.stringify(['dogs', 'cats']))
      .field('description', 'Test description of the organization pretty nice')
      .field('website', 'https://test.org')
      .field('acceptsReports', 'true')
      .attach('logo', testLogoPath);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Organization registered successfully');
    expect(response.body.data).toHaveProperty('organization');
    expect(response.body.data).toHaveProperty('user');
    // organization name is transformed to lowercase
    expect(response.body.data.organization.name).toBe('test organization'); 
  });
  
  it('should return validation error for missing logo', async () => {
    const response = await request(app)
      .post('/api/organizations')
      .field('name', 'Test Organization')
      .field('krs', validKRS)
      .field('email', 'test2@example.com')
      .field('password', 'Password123!')
      .field('phone', '+48123456789')
      .field('city', 'Warszawa')
      .field('postalCode', '00-001')
      .field('address', 'Test Street 123')
      .field('description', 'Test description of the organization pretty nice')
      .field('website', 'https://test.org')
      .field('voivodeship', 'MAZOWIECKIE')
      .field('animals', JSON.stringify(['dogs', 'cats']));
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Validation failed');
    expect(response.body.errors[0]).toHaveProperty('field', 'logo');
  });
  
  it('should reject registration with invalid KRS format', async () => {
    const response = await request(app)
      .post('/api/organizations')
      .field('name', 'Test Organization')
      .field('krs', invalidKRS)
      .field('email', 'test3@example.com')
      .field('password', 'Password123!')
      .field('phone', '+48123456789')
      .field('city', 'Warszawa')
      .field('postalCode', '00-001')
      .field('address', 'Test Street 123')
      .field('voivodeship', 'MAZOWIECKIE')
      .field('animals', JSON.stringify(['dogs', 'cats']))
      .attach('logo', testLogoPath);
    
    expect(response.status).toBe(400);
    expect(response.body.message).toContain('Validation failed');
  });
});