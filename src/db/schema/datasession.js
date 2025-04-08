// session data for something outside user info.
// data(id:autoincrement: primary key, email: string<can be null>, info: json)
import { sql } from "drizzle-orm";
import { text, sqliteTable, integer} from "drizzle-orm/sqlite-core";
import { users } from "./users.js"; // reference to users table
import { json } from "drizzle-orm/mysql-core";


export const datasession = sqliteTable("datasession", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    userEmail: text("userEmail").references(() => users.email),
    expiresAt: integer("expiresAt").default(sql`(CURRENT_TIMESTAMP)`),
    info: text('info', {mode: json})
    .notNull()
    .default(sql`'[]'`),
    userResponses: text('userResponses', {mode: json})
    .notNull()
    .default(sql`'[]'`),
});
