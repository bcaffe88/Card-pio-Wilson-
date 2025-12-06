import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { URL } from "url";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const dbUrl = new URL(process.env.DATABASE_URL);

const client = postgres({
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port, 10) || 5432,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1), // Remove a barra inicial


});
export const db = drizzle(client, { schema });

export type Database = typeof db;
