const request = require("supertest");
const app = require("../src/app"); // IMPORTANT

describe("Basic Integration Test", () => {
  test("GET / should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});