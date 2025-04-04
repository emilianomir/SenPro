// History(userEmail: string, ServiceAddress: string, createdAt:date)
import { sql, Table } from "drizzle-orm";
import { text, primaryKey, sqliteTable, integer} from "drizzle-orm/sqlite-core";
import { users } from "./users.js"; // reference to users table
import { services } from "./services.js"; // reference to services table

export const history = sqliteTable("history", {
    userEmail: text("userEmail").notNull().references(() => users.email),
    sAddress: text('sAddress', { mode: 'json' })
    .notNull()
    .$default(sql`'[]'`),
    createdAt: integer("created_at").default(sql`(CURRENT_TIMESTAMP)`),

}, (table) => [
    primaryKey({columns: [table.userEmail, table.sAddress, table.createdAt]}),
]);
