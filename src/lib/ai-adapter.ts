import { openaiCompatible } from "@tanstack/ai-openai/compatible";
import { env } from "#/env";

const aiAdapter = openaiCompatible({
	name: "ai-proxy",
	baseURL: env.AI_BASE_URL,
	apiKey: env.AI_API_KEY,
	models: ["deepseek-v4-flash-202605"],
});

export const deepseek = aiAdapter("deepseek-v4-flash-202605");
