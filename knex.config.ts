import type { Knex } from "knex";
import * as dotenv from "dotenv";

// Load .env.local for CLI usage (next.js doesn't load it for the CLI)
dotenv.config({ path: ".env.local" });

const config: Knex.Config = {
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // required for Supabase
  },
  migrations: {
    directory: "./migrations",
    extension: "ts",
  },
  seeds: {
    directory: "./seeds",
    extension: "ts",
  },
};

export default config;
