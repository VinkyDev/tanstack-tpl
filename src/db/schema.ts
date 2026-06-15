import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
	id: serial().primaryKey(),
	title: text().notNull(),
	completed: boolean().notNull().default(false),
	createdAt: timestamp("created_at").defaultNow(),
});
