// Users (email*: text, username: text, password: text, address: text, type:text (user or admin for testing))
import { sql } from "drizzle-orm";
import { json } from "drizzle-orm/mysql-core";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  email: text('email').notNull().primaryKey(),
  username: text('username').notNull(),
  password: text('password').notNull(),
  type: text('type', { enum: ["user", "admin"] }),
  theme: text('theme').default('light'),
  address: text('address'),
  createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  cords: text('cords', {mode: json})
      .notNull()
      .default(sql`'[]'`),
});