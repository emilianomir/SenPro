import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

config({ path: '.env.local' }); // or .env.local


// Making use of local Evironments doesn't seem to work ( later fix)
export const db = drizzle({ connection: {
  url: TURSO_CONNECTION_URL, // change this
  authToken: TURSO_AUTH_TOKEN, // change this
}});
