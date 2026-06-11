import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { createFileRoute } from "@tanstack/react-router";
import { deepseek } from "#/lib/ai-adapter";
import { calculate, getWeather, highlightUiDef } from "@/lib/ai-tools";

export const Route = createFileRoute("/api/chat")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const abortController = new AbortController();
				const { messages } = await request.json();

				const stream = chat({
					adapter: deepseek,
					messages,
					tools: [getWeather, calculate, highlightUiDef],
					systemPrompts: [
						"你是一个简明友好的中文助手, 在 TanStack AI 演示项目里运行.",
						"碰到天气问题用 get_weather; 算术用 calculate; 用户让你 '高亮' / '指向' / '展示某区域' 时调用 highlight_ui.",
						"工具调完后, 用一句话总结结果.",
					],
					abortController,
				});

				return toServerSentEventsResponse(stream, { abortController });
			},
		},
	},
});
