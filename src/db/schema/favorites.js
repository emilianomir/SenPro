// Favorites(userEmail: String, ServiceAddress: String)
import { sql, Table } from "drizzle-orm";
import { text, primaryKey, sqliteTable} from "drizzle-orm/sqlite-core";
import { users } from "./users.js"; // reference to users table
import { services } from "./services.js"; // reference to services table

export const favorites = sqliteTable("favorites", {
    userEmail: text("userEmail").notNull().references(() => users.email),
    sAddress: text('sAddress').notNull().references(() => services.address),
}, (table) => [
    primaryKey({columns: [table.userEmail, table.sAddress]}),
]);
