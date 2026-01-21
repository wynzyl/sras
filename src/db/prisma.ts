import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, type PoolConfig } from "pg";

/**
 * Type definition for the global Prisma instance.
 * This interface ensures type safety when accessing the cached Prisma client
 * from the global scope, avoiding the use of 'any' or 'unknown' types.
 */
interface GlobalPrisma {
  prisma: PrismaClient | undefined;
}

/**
 * Extends the globalThis object with our Prisma instance type.
 * In Next.js development, modules are reloaded on hot reload, which would
 * create multiple Prisma Client instances. By storing the instance in
 * globalThis, we prevent connection exhaustion.
 */
const globalForPrisma = globalThis as typeof globalThis & GlobalPrisma;

/**
 * Retrieves the DATABASE_URL from environment variables.
 * Throws a descriptive error if the variable is not set, ensuring
 * the application fails fast with a clear error message.
 */
const connectionString: string | undefined = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please ensure it is configured in your .env file."
  );
}

/**
 * PostgreSQL connection pool configuration.
 * The Pool manages multiple database connections efficiently, reusing
 * connections when possible to reduce overhead.
 */
const poolConfig: PoolConfig = {
  connectionString,
  // Maximum number of clients in the pool
  max: 10,
  // Number of milliseconds a client must sit idle before being closed
  idleTimeoutMillis: 30000,
  // Maximum number of milliseconds to wait for a connection
  connectionTimeoutMillis: 2000,
};

/**
 * Creates a PostgreSQL connection pool.
 * The pool manages multiple database connections and handles
 * connection lifecycle automatically.
 */
const pool = new Pool(poolConfig);

/**
 * Prisma PostgreSQL adapter.
 * This adapter allows Prisma to use the pg Pool for database connections,
 * providing better connection management and performance.
 */
const adapter = new PrismaPg(pool);

/**
 * Prisma Client instance with connection caching.
 *
 * In development: Uses a singleton pattern stored in globalThis to prevent
 * multiple Prisma Client instances during Next.js hot reloads. This avoids
 * "Too many Prisma Clients" errors.
 *
 * In production: Creates a new instance per serverless function invocation
 * or reuses the cached instance if available.
 *
 * Logging configuration:
 * - Development: Logs queries, errors, and warnings for debugging
 * - Production: Only logs errors to reduce noise in production logs
 */
export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? (["query", "error", "warn"] as const)
        : (["error"] as const),
  });

/**
 * Cache the Prisma Client instance in globalThis for development.
 * This prevents creating multiple instances during Next.js hot module reloading,
 * which would exhaust database connections. In production, this caching
 * is not necessary as each serverless function invocation gets a fresh
 * global scope.
 */
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
