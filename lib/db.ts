import knex from "knex";

// Singleton pattern: reuse the same connection pool across Next.js hot-reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __db: ReturnType<typeof knex> | undefined;
}

const db =
  globalThis.__db ??
  knex({
    client: "pg",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // required for Supabase
    },
    pool: { min: 0, max: 5 },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__db = db;
}

export default db;
