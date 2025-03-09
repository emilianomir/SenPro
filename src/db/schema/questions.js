import { sql } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";
import { users } from "./users.js";

export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userEmail: text("user_email").references(() => users.email).notNull(), 
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});
