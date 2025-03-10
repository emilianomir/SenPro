// Service (Address: string (primary key), Info: array)
import { sql } from "drizzle-orm";
import { json } from "drizzle-orm/mysql-core";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const services = sqliteTable("services", {
    address: text('address').notNull().primaryKey(),
    info: text('info', {mode: json})
    .notNull()
    .default(sql`'[]'`),
});
