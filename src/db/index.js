import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

config(); // instead of passing path to config of env file this will load the env from root
const connectionUrl = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: connectionUrl,
  authToken: authToken,
});

export const db = drizzle(client);
