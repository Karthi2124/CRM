import request from 'supertest';
import app from '../../src/server';

describe('Integration Tests: Auth Endpoints', () => {
  describe('POST /api/auth/login validation', () => {
    it('should return 422 Unprocessable Entity when email or password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' }); // missing password

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 422 Unprocessable Entity when email is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalid-email', password: 'password123' });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/auth/profile authentication guard', () => {
    it('should return 401 Unauthorized when Authorization header is missing', async () => {
      const response = await request(app)
        .get('/api/auth/profile');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('header is missing');
    });

    it('should return 401 Unauthorized when Bearer token is invalid', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', 'Bearer invalidtokenhere');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});
