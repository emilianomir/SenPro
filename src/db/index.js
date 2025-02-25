import Database from "better-sqlite3";
import { config } from "dotenv";

config({ path: ".env.local" });

const db = new Database("database.sqlite");
export default db;
