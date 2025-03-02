import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
    schema: "./src/db/schema",
    dialect: "turso",
    out: "./src/db/migrations",
    dbCredentials: {
        url: 'libsql://servicesapp-gaelgalvan.turso.io', // change this
        authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NDA5NTA1ODksImlkIjoiMmFlOTE4NzYtMTdlMC00ZDIzLWFmMWUtNDYwZGMyNWMxOWE2In0.Z9GMj5TeiqcS72v_V_SWDDQ9HTipuPu6dcvYfJnMZZucp89ZAJUWad4DYP_gJoT6GUWp9eOOP5Xw8GQqoVJzAg', // change this
    },

});

