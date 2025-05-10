import { sql } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./users.js"; // reference to users table
import { json } from "drizzle-orm/mysql-core";

export const addresses = sqliteTable("addresses", {
    userEmail: text("userEmail").primaryKey(),
    address: text("address"),
    cords: text('cords', {mode: json})
    .default(sql`'[]'`),
    // createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`)
  });