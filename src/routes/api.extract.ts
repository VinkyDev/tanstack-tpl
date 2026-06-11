import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { createFileRoute } from "@tanstack/react-router";
import { deepseek } from "#/lib/ai-adapter";
import { ProfileCardSchema } from "@/lib/ai-tools";

export const Route = createFileRoute("/api/extract")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const abortController = new AbortController();
				const { messages } = await request.json();

				const stream = chat({
					adapter: deepseek,
					messages,
					systemPrompts: [
						"你将根据用户输入抽取/生成一张 ProfileCard. 字段必须严格符合 schema, 用中文.",
					],
					outputSchema: ProfileCardSchema,
					stream: true,
					abortController,
				});

				return toServerSentEventsResponse(stream, { abortController });
			},
		},
	},
});
