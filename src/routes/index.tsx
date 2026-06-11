import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 p-8">
			<div className="flex items-center gap-2">
				<Sparkles className="size-7 text-primary" />
				<h1 className="font-bold text-4xl">TanStack AI</h1>
			</div>
			<p className="text-lg text-muted-foreground">
				TanStack 全家桶 + React 19 + Vite 8 + Tailwind 4 + Coss UI demo 模板.
				主演示围绕 <code>@tanstack/ai</code>: 流式输出, 工具调用,
				流式结构化输出.
			</p>
			<Link to="/demo">
				<Button size="lg">
					进入 AI 演示 <ArrowRight />
				</Button>
			</Link>
		</div>
	);
}
