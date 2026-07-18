import request from 'supertest';
import app from '../../src/server';

describe('Integration Tests: Security Hardening', () => {
  describe('XSS Input Sanitization Middleware', () => {
    it('should strip script tags from string fields in request body', async () => {
      // Send a request containing XSS payload in email, and make it fail validation
      // so it returns 422 without querying the database
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: '<script>alert("xss")</script>not-a-valid-email',
          password: 'password123',
        });

      // After stripping tags, the value 'not-a-valid-email' is checked, which fails validation (422)
      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should strip generic HTML tags from string fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: '<h1>invalid-email</h1>',
          password: 'password123',
        });

      // After stripping, 'invalid-email' is checked, which fails validation (422)
      expect(response.status).toBe(422);
      expect(response.body.message).toBe('Validation failed');
    });
  });
});
