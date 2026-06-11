import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

// 服务端工具: 获取天气 (mock)
export const getWeatherDef = toolDefinition({
	name: "get_weather",
	description: "Get current weather for a city. Use for any weather question.",
	inputSchema: z.object({
		city: z.string().meta({ description: "City name in English or Chinese" }),
	}),
	outputSchema: z.object({
		city: z.string(),
		temperature: z.number(),
		conditions: z.string(),
		humidity: z.number(),
	}),
});

export const getWeather = getWeatherDef.server(async ({ city }) => {
	// mock 数据 — 真实场景调外部 API
	const conditions = ["晴", "多云", "小雨", "雷阵雨", "阴"];
	const seed = [...city].reduce((a, c) => a + c.charCodeAt(0), 0);
	return {
		city,
		temperature: 10 + (seed % 25),
		conditions: conditions[seed % conditions.length],
		humidity: 30 + (seed % 60),
	};
});

// 服务端工具: 计算器
export const calculateDef = toolDefinition({
	name: "calculate",
	description:
		"Evaluate a math expression. Use for arithmetic. Supports + - * / ( ) and decimals.",
	inputSchema: z.object({
		expression: z
			.string()
			.meta({ description: "Math expression, e.g. '12.5 * (3 + 4)'" }),
	}),
	outputSchema: z.object({
		expression: z.string(),
		result: z.number(),
	}),
});

export const calculate = calculateDef.server(async ({ expression }) => {
	if (!/^[\d\s+\-*/().]+$/.test(expression)) {
		throw new Error("Invalid characters in expression");
	}
	const result = Function(`"use strict"; return (${expression})`)() as number;
	if (typeof result !== "number" || !Number.isFinite(result)) {
		throw new Error("Expression did not evaluate to finite number");
	}
	return { expression, result };
});

// 客户端工具: 高亮 UI 区域
export const highlightUiDef = toolDefinition({
	name: "highlight_ui",
	description:
		"Highlight a section of the demo page UI. Use when user asks to 'show', 'highlight' or 'point to' something.",
	inputSchema: z.object({
		section: z
			.enum(["chat", "tools", "structured", "tech-stack"])
			.meta({ description: "Which page section to highlight" }),
		note: z.string().meta({ description: "Short caption shown to the user" }),
	}),
	outputSchema: z.object({ highlighted: z.boolean() }),
});

// 结构化输出 schema — 简介卡片生成
export const ProfileCardSchema = z.object({
	name: z.string().meta({ description: "Person or product name" }),
	tagline: z.string().meta({ description: "One-line catchy tagline" }),
	highlights: z
		.array(z.string())
		.min(3)
		.max(5)
		.meta({ description: "Key strengths, 3-5 short bullet points" }),
	stack: z
		.array(z.string())
		.meta({ description: "Tech stack or skill keywords" }),
	rating: z.number().min(0).max(10).meta({ description: "Score 0-10" }),
});
export type ProfileCard = z.infer<typeof ProfileCardSchema>;
