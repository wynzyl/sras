/**
 * Check database configuration
 * Run with: npx tsx scripts/check-db-config.ts
 */

import "dotenv/config";

function checkDatabaseConfig() {
  console.log("=== Database Configuration Check ===\n");

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("✗ DATABASE_URL is not set in .env file");
    console.log("\nPlease set DATABASE_URL in your .env file:");
    console.log('DATABASE_URL="postgresql://user:password@localhost:5432/sras?schema=public"');
    return;
  }

  console.log("✓ DATABASE_URL is set");
  console.log("  Length:", databaseUrl.length, "characters");
  console.log("  First 60 chars:", JSON.stringify(databaseUrl.substring(0, 60)));

  // Check for common issues
  if (databaseUrl.includes('DATABASE_URL=')) {
    console.error("\n⚠ Warning: DATABASE_URL appears to include the variable name");
    console.log("  The .env file should only contain: postgresql://...");
    console.log("  Not: DATABASE_URL=postgresql://...");
  }

  // Remove quotes if present
  let cleanUrl = databaseUrl.trim();
  if ((cleanUrl.startsWith('"') && cleanUrl.endsWith('"')) || 
      (cleanUrl.startsWith("'") && cleanUrl.endsWith("'"))) {
    cleanUrl = cleanUrl.slice(1, -1);
    console.log("\n⚠ Removed quotes from DATABASE_URL");
  }

  // Parse the connection string (without exposing password)
  try {
    // Handle both postgresql:// and postgres://
    const normalizedUrl = cleanUrl.replace(/^postgres:\/\//, "postgresql://");
    const url = new URL(normalizedUrl);
    
    console.log("\nConnection details:");
    console.log("  Protocol:", url.protocol.replace(":", ""));
    console.log("  Host:", url.hostname || "not specified");
    console.log("  Port:", url.port || "5432 (default)");
    console.log("  Database:", url.pathname.slice(1) || "not specified");
    console.log("  Username:", url.username || "not specified");
    console.log("  Password:", url.password ? "***" : "not specified");
    console.log("  Schema:", url.searchParams.get("schema") || "public (default)");

    // Check if it's a valid PostgreSQL URL
    if (!normalizedUrl.startsWith("postgresql://")) {
      console.warn("\n⚠ Warning: DATABASE_URL should start with 'postgresql://' or 'postgres://'");
    }
  } catch (error) {
    console.error("\n✗ Invalid DATABASE_URL format:", error instanceof Error ? error.message : error);
    console.log("\nCurrent DATABASE_URL (first 50 chars):", databaseUrl.substring(0, 50) + "...");
    console.log("\nExpected format:");
    console.log('DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"');
    console.log("\nExample:");
    console.log('DATABASE_URL="postgresql://sras_user:sras_password@localhost:5432/sras?schema=public"');
    return;
  }

  console.log("\n=== Next Steps ===");
  console.log("1. Ensure PostgreSQL is running");
  console.log("2. Verify the database exists");
  console.log("3. Check that the user has access to the database");
  console.log("4. Run: npm run db:migrate");
}

checkDatabaseConfig();
