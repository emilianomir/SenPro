import { sql } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./users.js"; // reference to users table so we can store user email

export const questions = sqliteTable("questions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userEmail: text("user_email").notNull().references(() => users.email),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`)
});