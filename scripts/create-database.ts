/**
 * Create database script
 * This script helps create the database manually before running migrations.
 * Run with: npx tsx scripts/create-database.ts
 */

import "dotenv/config";
import { Pool } from "pg";

async function createDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("✗ DATABASE_URL is not set in .env file");
    console.log("\nPlease set DATABASE_URL in your .env file:");
    console.log('DATABASE_URL="postgresql://user:password@localhost:5432/sras_db?schema=public"');
    process.exit(1);
  }

  try {
    // Parse the connection string
    const url = new URL(databaseUrl.replace(/^postgres:\/\//, "postgresql://"));
    const databaseName = url.pathname.slice(1).split("?")[0]; // Remove leading / and query params
    const username = url.username;
    const password = url.password;
    const host = url.hostname;
    const port = parseInt(url.port || "5432");

    console.log("=== Database Creation Script ===\n");
    console.log("Target database:", databaseName);
    console.log("Host:", host);
    console.log("Port:", port);
    console.log("Username:", username);
    console.log("");

    // Connect to PostgreSQL server (not the specific database)
    // We need to connect to 'postgres' database to create a new database
    const adminPool = new Pool({
      host,
      port,
      user: username,
      password,
      database: "postgres", // Connect to default postgres database
      connectionTimeoutMillis: 5000,
    });

    console.log("Connecting to PostgreSQL server...");

    // Check if database already exists
    const checkResult = await adminPool.query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1) as exists`,
      [databaseName]
    );

    if (checkResult.rows[0].exists) {
      console.log(`✓ Database "${databaseName}" already exists.`);
      console.log("\nYou can now run: npm run db:migrate");
      await adminPool.end();
      return;
    }

    // Create the database
    console.log(`Creating database "${databaseName}"...`);
    
    // Note: We need CREATEDB permission or superuser access
    // If this fails, you'll need to create the database manually with a superuser
    await adminPool.query(`CREATE DATABASE "${databaseName}"`);

    console.log(`✓ Database "${databaseName}" created successfully!`);
    console.log("\nNext steps:");
    console.log("1. Run: npm run db:migrate");
    console.log("2. Run: npm run db:generate");

    await adminPool.end();
  } catch (error) {
    console.error("\n✗ Failed to create database:");
    
    if (error instanceof Error) {
      console.error("Error:", error.message);
      
      // Provide helpful error messages
      if (error.message.includes("permission denied")) {
        console.error("\n⚠ Permission denied to create database.");
        console.log("\nThis usually means your PostgreSQL user doesn't have CREATEDB permission.");
        console.log("\nSolutions:");
        console.log("1. Create the database manually using a superuser account:");
        console.log("   psql -U postgres");
        console.log(`   CREATE DATABASE ${databaseName};`);
        console.log("   \\q");
        console.log("\n2. Or grant CREATEDB permission to your user:");
        console.log("   psql -U postgres");
        console.log(`   ALTER USER ${username} WITH CREATEDB;`);
        console.log("   \\q");
        console.log("\n3. Or use the postgres superuser for migrations:");
        console.log("   Update DATABASE_URL in .env to use 'postgres' user");
      } else if (error.message.includes("does not exist")) {
        console.error("\n⚠ Database server connection failed.");
        console.log("Please ensure PostgreSQL is running and accessible.");
      }
    } else {
      console.error("Unknown error:", error);
    }

    process.exit(1);
  }
}

createDatabase();
