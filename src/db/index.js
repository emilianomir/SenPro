import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';

config({ path: '.env.local' }); // or .env.local


// Making use of local Evironments doesn't seem to work ( later fix)
export const db = drizzle({ connection: {
  url: 'libsql://servicesapp-gaelgalvan.turso.io', // change this
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDA5NTA1ODksImlkIjoiMmFlOTE4NzYtMTdlMC00ZDIzLWFmMWUtNDYwZGMyNWMxOWE2In0.Z9GMj5TeiqcS72v_V_SWDDQ9HTipuPu6dcvYfJnMZZucp89ZAJUWad4DYP_gJoT6GUWp9eOOP5Xw8GQqoVJzAg', // change this
}});
