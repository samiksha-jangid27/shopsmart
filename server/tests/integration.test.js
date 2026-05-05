const request = require('supertest');
const app = require('../src/app');

describe('Integration Tests — API Endpoints', () => {
  test('GET / (root) returns 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });

  test('GET /api/health is idempotent across multiple calls', async () => {
    const r1 = await request(app).get('/api/health');
    const r2 = await request(app).get('/api/health');
    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
    expect(r1.body.status).toBe('ok');
    expect(r2.body.status).toBe('ok');
  });

  test('GET /api/stats returns valid numeric orders', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.status).toBe(200);
    expect(Number.isFinite(res.body.orders)).toBe(true);
  });
});