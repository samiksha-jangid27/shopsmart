const request = require('supertest');
const app = require('../src/app');

describe('API Integration Tests', () => {
  test('GET /api/health should return status ok', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('message');
  });

  test('GET /api/stats should return dynamic dashboard data', async () => {
    const response = await request(app).get('/api/stats');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('orders');
    expect(typeof response.body.orders).toBe('number');
    expect(response.body).toHaveProperty('period', 'Last 7 days');
  });

  test('GET / unknown route should return 404', async () => {
    const response = await request(app).get('/api/unknown');
    expect(response.status).toBe(404);
  });
});