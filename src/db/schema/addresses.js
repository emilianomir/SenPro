import { sql } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./users.js"; // reference to users table

export const addresses = sqliteTable("addresses", {
    userEmail: text("user_email").primaryKey().references(() => users.email),
    address: text("address").notNull(),
    createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`)
  });