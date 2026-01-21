/**
 * Test database connection script
 * Run with: npx tsx scripts/test-db-connection.ts
 */

import "dotenv/config";
import { prisma } from "../src/db/prisma";

async function testConnection() {
  try {
    console.log("Testing database connection...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✓ Set" : "✗ Not set");

    // Test connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✓ Database connection successful!");
    console.log("Test query result:", result);

    // Get database version
    const version = await prisma.$queryRaw<Array<{ version: string }>>`
      SELECT version()
    `;
    console.log("✓ PostgreSQL version:", version[0]?.version);

    // Test if we can query the database
    const databases = await prisma.$queryRaw<Array<{ datname: string }>>`
      SELECT datname FROM pg_database WHERE datistemplate = false
    `;
    console.log("✓ Available databases:", databases.map((d) => d.datname));

    console.log("\n✅ All database connection tests passed!");
  } catch (error) {
    console.error("✗ Database connection failed:");
    if (error instanceof Error) {
      console.error("Error:", error.message);
      console.error("Stack:", error.stack);
    } else {
      console.error("Unknown error:", error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("\n✓ Disconnected from database");
  }
}

testConnection();
