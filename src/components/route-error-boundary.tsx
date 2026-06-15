import { Link, useRouter } from "@tanstack/react-router";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface RouteErrorBoundaryProps {
	error: unknown;
	reset?: () => void;
}

export function RouteErrorBoundary({ error, reset }: RouteErrorBoundaryProps) {
	const router = useRouter();

	const message =
		error instanceof Error
			? error.message
			: typeof error === "string"
				? error
				: "发生了未知错误";

	const handleReset = () => {
		reset?.();
	};

	const handleRetry = () => {
		router.invalidate();
	};

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
					<Button onClick={handleReset} variant="outline">
						<RotateCcw className="mr-2 size-4" />
						重试
					</Button>
				)}
				<Button onClick={handleRetry} variant="outline">
					<RotateCcw className="mr-2 size-4" />
					刷新路由
				</Button>
				<Button variant="default" render={<Link to="/" />}>
					<Home className="mr-2 size-4" />
					返回首页
				</Button>
			</div>
		</div>
	);
}
