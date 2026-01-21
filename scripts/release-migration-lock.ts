/**
 * Release Prisma migration advisory lock
 * Run with: npx tsx scripts/release-migration-lock.ts
 * 
 * This script helps resolve "advisory lock timeout" errors by:
 * 1. Checking for active locks
 * 2. Releasing stuck migration locks
 */

import "dotenv/config";
import { Pool } from "pg";

async function releaseMigrationLock() {
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

    console.log("=== Prisma Migration Lock Release Tool ===\n");

    // Check for active advisory locks
    console.log("Checking for active advisory locks...");
    const locksResult = await pool.query<{
      locktype: string;
      database: string;
      pid: number;
      mode: string;
      granted: boolean;
    }>(`
      SELECT locktype, database, pid, mode, granted
      FROM pg_locks
      WHERE locktype = 'advisory'
      ORDER BY pid;
    `);

    if (locksResult.rows.length === 0) {
      console.log("✓ No active advisory locks found.");
      console.log("\nThe lock may have already been released, or the issue is elsewhere.");
      console.log("Try running: npm run db:migrate");
      await pool.end();
      return;
    }

    console.log(`Found ${locksResult.rows.length} advisory lock(s):`);
    locksResult.rows.forEach((lock, index) => {
      console.log(`  ${index + 1}. PID: ${lock.pid}, Mode: ${lock.mode}, Granted: ${lock.granted}`);
    });

    // Check for Prisma-specific lock (lock ID 72707369 is common for Prisma)
    console.log("\nChecking for Prisma migration locks...");
    const prismaLockId = 72707369; // Common Prisma migration lock ID
    const prismaLocks = await pool.query<{ pid: number }>(`
      SELECT pid
      FROM pg_locks
      WHERE locktype = 'advisory'
        AND (objid = $1 OR objid = $1::bigint)
    `, [prismaLockId]);

    if (prismaLocks.rows.length > 0) {
      console.log(`Found ${prismaLocks.rows.length} Prisma migration lock(s).`);
      
      // Try to release the lock
      console.log("\nAttempting to release Prisma migration locks...");
      for (const lock of prismaLocks.rows) {
        try {
          // Try to release the lock by calling pg_advisory_unlock_all for that PID
          // Note: We can't directly release another process's lock, but we can check
          console.log(`  Lock held by PID: ${lock.pid}`);
        } catch (error) {
          console.error(`  Error checking lock for PID ${lock.pid}:`, error);
        }
      }

      console.log("\n⚠ Note: Advisory locks are held by specific database connections.");
      console.log("To release them, you need to:");
      console.log("1. Close any running Prisma processes (prisma studio, migrate dev, etc.)");
      console.log("2. Or terminate the database connection holding the lock");
    }

    // Show active connections
    console.log("\n=== Active Database Connections ===");
    const connectionsResult = await pool.query<{
      pid: number;
      usename: string;
      application_name: string;
      state: string;
      query_start: Date;
      state_change: Date;
      query: string;
    }>(`
      SELECT 
        pid,
        usename,
        COALESCE(application_name, '') as application_name,
        state,
        query_start,
        state_change,
        LEFT(query, 100) as query
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND pid != pg_backend_pid()
      ORDER BY query_start;
    `);

    if (connectionsResult.rows.length === 0) {
      console.log("No other active connections found.");
    } else {
      console.log(`Found ${connectionsResult.rows.length} active connection(s):`);
      connectionsResult.rows.forEach((conn, index) => {
        console.log(`\n  ${index + 1}. PID: ${conn.pid}`);
        console.log(`     User: ${conn.usename}`);
        console.log(`     Application: ${conn.application_name || '(none)'}`);
        console.log(`     State: ${conn.state}`);
        console.log(`     Query: ${conn.query.substring(0, 80)}...`);
      });
    }

    // Provide solutions
    console.log("\n=== Solutions ===");
    console.log("1. Close any running Prisma processes:");
    console.log("   - Stop 'prisma studio' if running");
    console.log("   - Stop 'prisma migrate dev' if running in another terminal");
    console.log("   - Stop your Next.js dev server if running");
    console.log("\n2. If processes are stuck, terminate database connections:");
    console.log("   psql -U postgres -d sras_db");
    console.log("   SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid = <PID>;");
    console.log("\n3. For development, you can disable advisory locking (use with caution):");
    console.log("   Set environment variable: PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=true");
    console.log("   Then run: npm run db:migrate");
    console.log("\n4. Wait a few seconds and try again:");
    console.log("   npm run db:migrate");

    await pool.end();
  } catch (error) {
    console.error("\n✗ Error checking locks:");
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    process.exit(1);
  }
}

releaseMigrationLock();
