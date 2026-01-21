/**
 * Terminate stuck Prisma migration locks
 * Run with: npx tsx scripts/terminate-stuck-locks.ts
 * 
 * This script terminates database connections that are stuck trying to acquire
 * Prisma migration advisory locks.
 */

import "dotenv/config";
import { Pool } from "pg";

async function terminateStuckLocks() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("✗ DATABASE_URL is not set in .env file");
    process.exit(1);
  }

  try {
    const pool = new Pool({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 5000,
    });

    console.log("=== Terminate Stuck Migration Locks ===\n");

    // Find all connections trying to acquire the Prisma migration lock
    const stuckConnections = await pool.query<{
      pid: number;
      usename: string;
      application_name: string;
      state: string;
      query: string;
    }>(`
      SELECT 
        pid,
        usename,
        COALESCE(application_name, '') as application_name,
        state,
        query
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND query LIKE '%pg_advisory_lock(72707369)%'
        AND state = 'active'
        AND pid != pg_backend_pid()
      ORDER BY pid;
    `);

    if (stuckConnections.rows.length === 0) {
      console.log("✓ No stuck connections found trying to acquire migration locks.");
      await pool.end();
      return;
    }

    console.log(`Found ${stuckConnections.rows.length} stuck connection(s):\n`);
    stuckConnections.rows.forEach((conn, index) => {
      console.log(`${index + 1}. PID: ${conn.pid}`);
      console.log(`   User: ${conn.usename}`);
      console.log(`   Application: ${conn.application_name || '(none)'}`);
      console.log(`   State: ${conn.state}`);
      console.log("");
    });

    // Terminate the stuck connections
    console.log("Terminating stuck connections...\n");
    for (const conn of stuckConnections.rows) {
      try {
        await pool.query(`SELECT pg_terminate_backend($1)`, [conn.pid]);
        console.log(`✓ Terminated PID ${conn.pid}`);
      } catch (error) {
        console.error(`✗ Failed to terminate PID ${conn.pid}:`, error instanceof Error ? error.message : error);
      }
    }

    console.log("\n✓ Done! You can now try running your migration:");
    console.log("   npm run db:migrate");

    await pool.end();
  } catch (error) {
    console.error("\n✗ Error terminating locks:");
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    process.exit(1);
  }
}

terminateStuckLocks();
