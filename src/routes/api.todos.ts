import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "#/db";
import { todos } from "#/db/schema";

const todoInputSchema = z.object({
	title: z.string().min(1).max(200),
});

const todoUpdateSchema = z.object({
	id: z.number(),
	completed: z.boolean(),
});

const todoDeleteSchema = z.object({
	id: z.number(),
});

export const Route = createFileRoute("/api/todos")({
	server: {
		handlers: {
			GET: async () => {
				const all = await db.query.todos.findMany({
					orderBy: (t, { desc }) => [desc(t.createdAt)],
				});
				return Response.json(all);
			},
			POST: async ({ request }) => {
				const body = await request.json();
				const parsed = todoInputSchema.safeParse(body);
				if (!parsed.success) {
					return Response.json(
						{ error: parsed.error.format() },
						{ status: 400 },
					);
				}
				const [todo] = await db
					.insert(todos)
					.values({ title: parsed.data.title })
					.returning();
				return Response.json(todo, { status: 201 });
			},
			PATCH: async ({ request }) => {
				const body = await request.json();
				const parsed = todoUpdateSchema.safeParse(body);
				if (!parsed.success) {
					return Response.json(
						{ error: parsed.error.format() },
						{ status: 400 },
					);
				}
				const [todo] = await db
					.update(todos)
					.set({ completed: parsed.data.completed })
					.where(eq(todos.id, parsed.data.id))
					.returning();
				return Response.json(todo);
			},
			DELETE: async ({ request }) => {
				const body = await request.json();
				const parsed = todoDeleteSchema.safeParse(body);
				if (!parsed.success) {
					return Response.json(
						{ error: parsed.error.format() },
						{ status: 400 },
					);
				}
				await db.delete(todos).where(eq(todos.id, parsed.data.id));
				return new Response(null, { status: 204 });
			},
		},
	},
});
