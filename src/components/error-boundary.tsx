"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";

interface ErrorFallbackProps {
	error: unknown;
	reset?: () => void;
	onRetry?: () => void;
}

export function ErrorFallback({ error, reset, onRetry }: ErrorFallbackProps) {
	const message =
		error instanceof Error
			? error.message
			: typeof error === "string"
				? error
				: "发生了未知错误";

	return (
		<div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-6 p-6 sm:p-10">
			<div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
				<AlertTriangle className="size-8" />
			</div>

			<div className="text-center">
				<h1 className="font-bold text-2xl tracking-tight">出错了</h1>
				<p className="mt-2 text-muted-foreground text-sm">
					页面加载时遇到问题，请重试或返回首页。
				</p>
			</div>

			<Card className="w-full border-destructive/20">
				<CardHeader>
					<CardTitle className="text-base">错误信息</CardTitle>
					<CardDescription className="break-all font-mono text-destructive">
						{message}
					</CardDescription>
				</CardHeader>
			</Card>

			<div className="flex flex-wrap items-center justify-center gap-3">
				{reset && (
					<Button onClick={reset} variant="outline">
						<RotateCcw className="mr-2 size-4" />
						重试
					</Button>
				)}
				{onRetry && (
					<Button onClick={onRetry} variant="outline">
						<RotateCcw className="mr-2 size-4" />
						刷新路由
					</Button>
				)}
				<a href="/" className={cn(buttonVariants({ variant: "default" }))}>
					<Home className="mr-2 size-4" />
					返回首页
				</a>
			</div>
		</div>
	);
}

function ReactErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return <ErrorFallback error={error} reset={resetErrorBoundary} />;
}

export function AppErrorBoundary({
	children,
	onError,
}: {
	children: React.ReactNode;
	onError?: (error: unknown, info: React.ErrorInfo) => void;
}) {
	const handleError = (error: unknown, info: React.ErrorInfo) => {
		logger.error("React error boundary caught an error", error, info);
		onError?.(error, info);
	};

	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					onReset={reset}
					onError={handleError}
					FallbackComponent={ReactErrorFallback}
				>
					{children}
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}

export function RouteErrorBoundary({
	error,
	reset,
}: {
	error: unknown;
	reset?: () => void;
}) {
	useEffect(() => {
		logger.error("Route error boundary caught an error", error);
	}, [error]);

	return <ErrorFallback error={error} reset={reset} />;
}
