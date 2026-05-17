const request = require('supertest');
const app = require('../src/server'); // Assuming app is exported from server.js

describe('GET /api/v1/health', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/api/v1/health');
    // It might return 200 or 503 depending on database connection
    expect([200, 503]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('environment');
    expect(res.body).toHaveProperty('database');
  });
});
