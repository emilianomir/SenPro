// Tags (id*(SelfAssign): int, tag: text, question: text)
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const tags = sqliteTable("tags", {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  tag: text ('tag'),
  question: text('question')
});