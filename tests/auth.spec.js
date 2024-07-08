const request = require("supertest");
const app = require("../app"); // Assuming your server file is named app.js

describe("User Authentication", () => {
  describe("Register User", () => {
    it("Should Register User Successfully", async () => {
      const res = await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.user).toHaveProperty("firstName", "John");
      expect(res.body.data.user).toHaveProperty("lastName", "Doe");
      // expect(res.body.data.).toHaveProperty(
      //   "organisation",
      //   "John's Organisation"
      // );
      expect(res.body.data).toHaveProperty("accessToken");
    });

    it("Should Register User Successfully with Default Organisation", async () => {
      const registerRes = await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      const { accessToken, user } = registerRes.body.data;

      const res = await request(app)
        .get("/api/organisations/1")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("status", "success");
      expect(res.body.data).toHaveProperty(
        "name",
        `${user.firstName}'s Organisation`
      );
    });

    it("Should Fail If Required Fields Are Missing", async () => {
      const requiredFields = ["firstName", "lastName", "email", "password"];

      for (const field of requiredFields) {
        const userData = {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "password123",
        };
        delete userData[field];

        const res = await request(app).post("/auth/register").send(userData);

        expect(res.statusCode).toEqual(422);
      }
    });

    it("Should Fail If Duplicate Email", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      };
      // Register user first
      const registerRes = await request(app)
        .post("/auth/register")
        .send(userData);

      // Register user first
      const res = await request(app).post("/auth/register").send(userData);

      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty("message", "Email is already registered");
      expect(res.body).toHaveProperty("status", "Duplicate Email");
    });
  });

  describe("Login User", () => {
    it("Should Log the user in successfully", async () => {
      // Register user first
      const registerRes = await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      // Now log in
      const res = await request(app).post("/auth/login").send({
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body.data.user).toHaveProperty(
        "email",
        "john.doe@example.com"
      );
      expect(res.body.data).toHaveProperty("accessToken");
    });
    it("Should fail to Log the user with wrong credentials", async () => {
      // Register user first
      const registerRes = await request(app).post("/auth/register").send({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        password: "password123",
      });

      // Now log in
      const res = await request(app).post("/auth/login").send({
        email: "john.doe@example.com",
        password: "password1234", //wrong password
      });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty("status", "Bad Request");
      expect(res.body).toHaveProperty("message", "Authentication failed");
    });
  });
});
