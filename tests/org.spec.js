const request = require("supertest");
const app = require("../app");

describe("Organisation API", () => {
  it("Should not allow non-organisation users to have access", async () => {
    // Register user first
    const registerRes = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });
    // Register second user
    const registerRes2 = await request(app).post("/auth/register").send({
      firstName: "Doe",
      lastName: "John",
      email: "john.doe2@example.com",
      password: "password123",
    });

    // GEt first user details
    const { accessToken, user } = registerRes.body.data;

    // try to access 2nd users org, with 1st users token

    const res = await request(app)
      .get("/api/organisations/2")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("status", "Bad Request");
    expect(res.body).toHaveProperty("message", "Organisation does not exist");
  });

  it("Should fail to get without Token", async () => {
    const res = await request(app).get("/api/organisations");

    expect(res.statusCode).toEqual(401);
  });
});
