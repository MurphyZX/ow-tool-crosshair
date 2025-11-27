import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./schema"

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Populate env.example → .env.local with your Supabase connection string.")
}

const globalForDb = globalThis as unknown as {
  conn?: ReturnType<typeof postgres>
  db?: PostgresJsDatabase<typeof schema>
}

const conn =
  globalForDb.conn ??
  postgres(connectionString, {
    ssl: "require",
    max: 3,
    idle_timeout: 20,
    prepare: false,
  })

const db =
  globalForDb.db ??
  drizzle(conn, {
    schema,
    logger: process.env.NODE_ENV === "development",
  })

if (!globalForDb.conn) {
  globalForDb.conn = conn
}

if (!globalForDb.db) {
  globalForDb.db = db
}

export { db, schema }
