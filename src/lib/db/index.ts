import postgres from "postgres";
import { sql } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  sql?: ReturnType<typeof postgres>;
  db?: Db;
};

function createDb(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL não configurada. Copie .env.example → .env.local e rode: npm run db:up"
    );
  }

  const sqlClient = postgres(url, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

  globalForDb.sql = sqlClient;
  return drizzle(sqlClient, { schema });
}

function getDb(): Db {
  if (!globalForDb.db) {
    globalForDb.db = createDb();
  }
  return globalForDb.db;
}

export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const value = Reflect.get(getDb(), prop, receiver);
    return typeof value === "function" ? value.bind(getDb()) : value;
  },
});

let schemaReady: Promise<void> | null = null;

export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      try {
        await db.execute(sql`
        CREATE TABLE IF NOT EXISTS gifts (
          id TEXT PRIMARY KEY,
          slug TEXT UNIQUE,
          product_id TEXT NOT NULL,
          data TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          amount_cents INTEGER NOT NULL,
          mp_preference_id TEXT,
          mp_payment_id TEXT,
          buyer_email TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          paid_at INTEGER
        )
      `);
        await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_gifts_slug ON gifts (slug)`);
        await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_gifts_status ON gifts (status)`);
      } catch (error) {
        schemaReady = null;
        throw error;
      }
    })();
  }
  return schemaReady;
}
