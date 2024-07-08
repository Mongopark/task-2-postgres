const request = require("supertest");
const app = require("../app");

describe("User API", () => {
  it("Should Get user with Valid Token", async () => {
    // Register user first
    const registerRes = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    });

    const { accessToken, user } = registerRes.body.data;

    const res = await request(app)
      .get(`/api/users/${user.userId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("status", "success");
    expect(res.body.data).toHaveProperty("email", "john.doe@example.com");
  });

  it("Should fail to get without Token", async () => {
    const res = await request(app).get("/api/users/1");

    expect(res.statusCode).toEqual(401);
  });
});
