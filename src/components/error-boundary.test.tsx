import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	AppErrorBoundary,
	ErrorFallback,
	RouteErrorBoundary,
} from "./error-boundary";

vi.mock("@/lib/logger", () => ({
	logger: {
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
		debug: vi.fn(),
	},
}));

describe("ErrorFallback", () => {
	it("renders error message", () => {
		render(<ErrorFallback error={new Error("boom")} />);
		expect(screen.getByText("boom")).toBeInTheDocument();
	});

	it("shows retry button when reset is provided", () => {
		const reset = vi.fn();
		render(<ErrorFallback error={new Error("boom")} reset={reset} />);
		expect(screen.getByRole("button", { name: "重试" })).toBeInTheDocument();
	});
});

describe("RouteErrorBoundary", () => {
	it("renders fallback for router errors", () => {
		render(<RouteErrorBoundary error={new Error("route failed")} />);
		expect(screen.getByText("route failed")).toBeInTheDocument();
	});
});

describe("AppErrorBoundary", () => {
	it("renders children when there is no error", () => {
		render(
			<AppErrorBoundary>
				<div data-testid="child">hello</div>
			</AppErrorBoundary>,
		);
		expect(screen.getByTestId("child")).toBeInTheDocument();
	});
});
