const request = require('supertest');
const app = require('../src/app');

describe('Unit Tests — Health & Stats', () => {
  test('GET /api/health returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('timestamp');
  });

  test('GET /api/stats returns orders and period', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('orders');
    expect(typeof res.body.orders).toBe('number');
    expect(res.body).toHaveProperty('period', 'Last 7 days');
  });

  test('GET /unknown route returns 404', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});