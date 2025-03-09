import request from 'supertest';
import app from '../../app';

const exampleOrganizations = {
    '0000000963': {
        Name: 'STOWARZYSZENIE NA RZECZ ROZWOJU WSI MECHNICA',
        Voivodeship: 'OPOLSKIE',
        City: 'MECHNICA'
    },
};

const testKRS = '0000000963';

describe('Organization KRS Lookup Tests', () => {
    it('should return organization info for valid KRS', async () => {
        const response = await request(app)
            .get(`/api/organizations/krs/${testKRS}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Organization information retrieved successfully');
        expect(response.body.data).toHaveProperty('name', exampleOrganizations[testKRS].Name);
        expect(response.body.data).toHaveProperty('voivodeship', exampleOrganizations[testKRS].Voivodeship);
        expect(response.body.data).toHaveProperty('city', exampleOrganizations[testKRS].City);
    });

    it('should return 400 for KRS not in whitelist', async () => {
        const response = await request(app)
            .get('/api/organizations/krs/9876543210');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Organization with this KRS not found in whitelist');
    });

    it('should return 400 for invalid KRS format', async () => {
        const response = await request(app)
            .get('/api/organizations/krs/12345');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid KRS format. Must be 10 digits.');
    });
});