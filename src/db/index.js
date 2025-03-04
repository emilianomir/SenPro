import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';


config(); // instead of passing path to config of env file this will load the env from root
const connectionUrl = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({
  url: 'libsql://servicesapp-gaelgalvan.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDA5NTA1ODksImlkIjoiMmFlOTE4NzYtMTdlMC00ZDIzLWFmMWUtNDYwZGMyNWMxOWE2In0.Z9GMj5TeiqcS72v_V_SWDDQ9HTipuPu6dcvYfJnMZZucp89ZAJUWad4DYP_gJoT6GUWp9eOOP5Xw8GQqoVJzAg',
});

export const db = drizzle(client);