import { Logger } from "tslog";

const isProduction = process.env.NODE_ENV === "production";
const isServer = typeof window === "undefined";

export const logger = new Logger({
	name: isServer ? "server" : "client",
	type: isProduction && isServer ? "json" : "pretty",
	minLevel: isProduction ? 3 : 0,
	hideLogPositionForProduction: true,
});
