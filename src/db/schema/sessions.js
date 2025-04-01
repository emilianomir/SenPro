// Sessions (UserEmail: string (primarykey/foreign key) , expiresAt: date)
import { sql } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { users } from "./users.js"; // reference to users table

export const sessions = sqliteTable("sessions", {
    id: integer({ mode: 'text' }),
    userEmail: text("userEmail").notNull().primaryKey().references(() => users.email),
    expiresAt: integer("expiresAt").default(sql`(CURRENT_TIMESTAMP)`),
});
