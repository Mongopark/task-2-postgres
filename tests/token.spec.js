const jwt = require("jsonwebtoken");
const generateToken = require("../src/utils/generateToken");

describe("Token Generation", () => {
  jest.useFakeTimers();

  it("Should generate token", async () => {
    const SECRET = "secret";
    const token = await generateToken({ userId: 1 }, SECRET, "5s");

    expect(token).toBeTruthy();
  });

  it("Should have correct user details", async () => {
    const SECRET = "secret";
    const token = await generateToken({ userId: 1 }, SECRET, "5s");

    const decoded = jwt.verify(token, SECRET);

    expect(decoded.userId).toBe(1);
  });

  it("Should have expire", async () => {
    const SECRET = "secret";
    const token = await generateToken({ userId: 1 }, SECRET, "1s");

    const decoded = jwt.verify(token, SECRET);

    // check for expired token

    setTimeout(() => {
      const expiredToken = decoded.exp < Date.now() / 1000;

      expect(expiredToken).toBe(true);
      expect(() => {
        jwt.verify(token, "secret");
      }).toThrow("jwt expired");
    }, 2000); // Wait for 2 seconds to ensure the token has expired

    jest.advanceTimersByTime(2000); // Advance the timers by 2 seconds
  });
});
