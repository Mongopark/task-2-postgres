const { PrismaClient } = require("@prisma/client");
const { execSync } = require("node:child_process");

const prisma = new PrismaClient();

beforeEach(async () => {
  // Reset the database by running migration and seed commands
  execSync("npx prisma migrate reset --force --skip-seed");

  // If you have any seed data, you can also run the seed command here
  // execSync('npx prisma db seed');
});

afterAll(async () => {
  await prisma.$disconnect();
});
