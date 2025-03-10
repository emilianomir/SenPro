import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

const connectionUrl = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

export default defineConfig({
    schema: "./src/db/schema",
    dialect: "turso",
    out: "./src/db/migrations",
    dbCredentials: {
        url: connectionUrl, // change this
        authToken: authToken, // change this
    },

});

