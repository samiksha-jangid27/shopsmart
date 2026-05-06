describe('GET /api/health', () => {
  let server;
  let baseUrl;

  beforeAll(async () => {
    // import compiled app
    const { app } = await import('../dist/src/app.js');
    server = app.listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    const addr = server.address();
    baseUrl = `http://127.0.0.1:${addr.port}`;
  });

  afterAll(async () => {
    if (server && server.close) await server.close();
  });

  it('responds 200 with healthy status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ ok: true, service: 'shopsmart-api' });
  });
});
