import { createMiddleware, createStart } from "@tanstack/react-start";
import { logger } from "#/lib/logger";

const errorLoggingMiddleware = createMiddleware().server(
	async ({ request, next }) => {
		try {
			return await next();
		} catch (error) {
			logger.error(`[${request.method}] ${request.url} unhandled error`, error);
			throw error;
		}
	},
);

export const startInstance = createStart(() => ({
	requestMiddleware: [errorLoggingMiddleware],
}));
