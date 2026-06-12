import type { UIMessage } from "@tanstack/ai-client";
import { clientTools } from "@tanstack/ai-client";
import {
	createChatClientOptions,
	fetchServerSentEvents,
	type InferChatMessages,
	useChat,
} from "@tanstack/ai-react";
import { createFileRoute } from "@tanstack/react-router";
import { Bot, Sparkles, User, Wrench } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { highlightUiDef, ProfileCardSchema } from "@/lib/ai-tools";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/demo")({ component: DemoPage });

function DemoPage() {
	const [highlight, setHighlight] = useState<{
		section: string;
		note: string;
	} | null>(null);

	return (
		<div className="mx-auto max-w-5xl space-y-6 p-6 sm:p-10">
			<header className="space-y-2">
				<div className="flex items-center gap-2">
					<Sparkles className="size-6 text-primary" />
					<h1 className="font-bold text-3xl">TanStack AI 演示</h1>
				</div>
				<p className="text-muted-foreground">
					围绕 <code>@tanstack/ai</code> 的简易 Agent: 流式输出 + 工具调用 +
					流式结构化输出.
				</p>
				<TechStackStrip highlighted={highlight?.section === "tech-stack"} />
			</header>

			<Tabs defaultValue="agent">
				<TabsList>
					<TabsTrigger value="agent">Agent (流式 + 工具)</TabsTrigger>
					<TabsTrigger value="structured">结构化输出 (流式)</TabsTrigger>
				</TabsList>

				<TabsContent value="agent" className="pt-4">
					<AgentDemo highlight={highlight} setHighlight={setHighlight} />
				</TabsContent>
				<TabsContent value="structured" className="pt-4">
					<StructuredDemo />
				</TabsContent>
			</Tabs>
		</div>
	);
}

function TechStackStrip({ highlighted }: { highlighted: boolean }) {
	const items = [
		"TanStack Start",
		"TanStack Router",
		"TanStack Query",
		"TanStack AI",
		"TanStack Form",
		"TanStack Store",
		"React 19",
		"Vite 8",
		"TailwindCSS 4",
		"Coss UI",
		"drizzle",
		"biome",
	];
	return (
		<div
			className={cn(
				"flex flex-wrap gap-1.5 rounded-lg border border-transparent p-2 transition",
				highlighted && "border-primary bg-primary/5",
			)}
		>
			{items.map((t) => (
				<Badge key={t} variant="secondary">
					{t}
				</Badge>
			))}
		</div>
	);
}

function AgentDemo({
	highlight,
	setHighlight,
}: {
	highlight: { section: string; note: string } | null;
	setHighlight: (h: { section: string; note: string } | null) => void;
}) {
	const [input, setInput] = useState("");

	// 客户端工具实现 — 直接操作 React state
	const highlightUi = highlightUiDef.client((args) => {
		setHighlight({ section: args.section, note: args.note });
		setTimeout(() => setHighlight(null), 4000);
		return { highlighted: true };
	});

	const chatOptions = createChatClientOptions({
		connection: fetchServerSentEvents("/api/chat"),
		tools: clientTools(highlightUi),
	});

	type Messages = InferChatMessages<typeof chatOptions>;

	const { messages, sendMessage, isLoading, stop, error } =
		useChat(chatOptions);

	const submit = () => {
		const t = input.trim();
		if (!t) return;
		sendMessage(t);
		setInput("");
	};

	const tryQuestions = [
		"上海现在天气怎么样?",
		"帮我算一下 (12.5 + 7.5) * 8",
		"高亮 chat 区域, 提示 '看这里'",
	];

	return (
		<div className="grid gap-4 lg:grid-cols-[1fr_280px]">
			<Card
				className={cn(
					"min-h-[420px] gap-0 transition",
					highlight?.section === "chat" && "ring-2 ring-primary",
				)}
			>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Bot className="size-4" /> 对话流
					</CardTitle>
					<CardDescription>
						SSE 流式输出, 自动渲染思考/工具调用/工具结果部分
					</CardDescription>
				</CardHeader>
				<div className="flex-1 space-y-3 overflow-y-auto px-6 pb-3">
					{messages.length === 0 && (
						<p className="text-muted-foreground text-sm">
							输入下面的问题, 或点右侧示例.
						</p>
					)}
					{messages.map((m) => (
						<MessageBlock key={m.id} message={m as Messages[number]} />
					))}
					{error && (
						<p className="text-destructive text-sm">错误: {error.message}</p>
					)}
				</div>
				<div className="flex items-end gap-2 border-t p-3">
					<Textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								submit();
							}
						}}
						placeholder="问点什么..."
						disabled={isLoading}
						className="min-h-12"
					/>
					{isLoading ? (
						<Button onClick={stop} variant="outline">
							停止
						</Button>
					) : (
						<Button onClick={submit} disabled={!input.trim()}>
							发送
						</Button>
					)}
				</div>
			</Card>

			<div className="space-y-3">
				<Card
					className={cn(
						"p-4 transition",
						highlight?.section === "tools" && "ring-2 ring-primary",
					)}
				>
					<div className="flex items-center gap-2">
						<Wrench className="size-4" />
						<span className="font-medium text-sm">已注册工具</span>
					</div>
					<ul className="mt-2 space-y-1.5 text-muted-foreground text-xs">
						<li>
							<code>get_weather</code> · 服务端
						</li>
						<li>
							<code>calculate</code> · 服务端
						</li>
						<li>
							<code>highlight_ui</code> · 客户端
						</li>
					</ul>
				</Card>
				<Card className="p-4">
					<p className="font-medium text-sm">试一下</p>
					<div className="mt-2 flex flex-col gap-1.5">
						{tryQuestions.map((q) => (
							<Button
								key={q}
								variant="ghost"
								size="sm"
								className="justify-start text-left"
								onClick={() => setInput(q)}
							>
								{q}
							</Button>
						))}
					</div>
				</Card>
				{highlight && (
					<Card className="border-primary p-3 text-sm">
						<p className="font-medium">客户端工具触发</p>
						<p className="text-muted-foreground">
							→ {highlight.section}: {highlight.note}
						</p>
					</Card>
				)}
			</div>
		</div>
	);
}

function MessageBlock({ message }: { message: UIMessage }) {
	const isUser = message.role === "user";
	return (
		<div className={cn("flex gap-2", isUser ? "flex-row-reverse" : "flex-row")}>
			<div
				className={cn(
					"flex size-7 shrink-0 items-center justify-center rounded-full border bg-muted",
				)}
			>
				{isUser ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
			</div>
			<div
				className={cn(
					"max-w-[85%] space-y-1.5 rounded-lg border px-3 py-2 text-sm",
					isUser ? "bg-primary text-primary-foreground" : "bg-card",
				)}
			>
				{message.parts.map((part) => {
					if (part.type === "text" && part.content) {
						return (
							<p key={part.content} className="whitespace-pre-wrap">
								{part.content}
							</p>
						);
					}
					if (part.type === "thinking" && part.content) {
						return (
							<details
								key={part.content}
								className="text-muted-foreground text-xs"
							>
								<summary className="cursor-pointer">思考过程</summary>
								<pre className="mt-1 whitespace-pre-wrap">{part.content}</pre>
							</details>
						);
					}
					if (part.type === "tool-call") {
						return (
							<div
								key={part.id}
								className="rounded border border-dashed px-2 py-1 text-xs"
							>
								<div className="flex items-center gap-1.5">
									<Wrench className="size-3" />
									<code>{part.name}</code>
									<Badge variant="outline" className="text-[10px]">
										{part.state}
									</Badge>
								</div>
								{part.arguments && (
									<pre className="mt-1 overflow-x-auto text-muted-foreground">
										{part.arguments}
									</pre>
								)}
								{part.output !== undefined && (
									<pre className="mt-1 overflow-x-auto text-emerald-600 dark:text-emerald-400">
										{JSON.stringify(part.output, null, 2)}
									</pre>
								)}
							</div>
						);
					}
					return null;
				})}
			</div>
		</div>
	);
}

function StructuredDemo() {
	const { sendMessage, isLoading, partial, final, error } = useChat({
		connection: fetchServerSentEvents("/api/extract"),
		outputSchema: ProfileCardSchema,
	});
	const [topic, setTopic] = useState("TanStack AI");

	return (
		<div className="grid gap-4 lg:grid-cols-2">
			<Card className="p-4">
				<CardTitle className="text-base">输入</CardTitle>
				<CardDescription>
					输入主题, 服务端流式生成 JSON, 客户端 partial 字段逐步填入
				</CardDescription>
				<Textarea
					className="mt-3"
					value={topic}
					onChange={(e) => setTopic(e.target.value)}
					placeholder="例如: TanStack AI / 一只爱睡觉的橘猫 / Vite 8"
				/>
				<div className="mt-3 flex gap-2">
					<Button
						disabled={isLoading || !topic.trim()}
						onClick={() => sendMessage(`为 "${topic.trim()}" 生成介绍卡片`)}
					>
						{isLoading && <Spinner className="mr-2 size-4" />} 生成卡片
					</Button>
					{isLoading && (
						<span className="flex items-center gap-1.5 text-muted-foreground text-sm">
							<Spinner className="size-3" /> 流式生成中...
						</span>
					)}
				</div>
				{error && (
					<p className="mt-2 text-destructive text-sm">{error.message}</p>
				)}
			</Card>

			<Card className="p-4">
				<CardTitle className="text-base">
					{final ? "完成" : isLoading ? "Streaming..." : "结果"}
				</CardTitle>
				<div className="mt-3 space-y-2 text-sm">
					<Field label="name" value={partial.name} />
					<Field label="tagline" value={partial.tagline} />
					<Field
						label="rating"
						value={
							partial.rating !== undefined
								? `${partial.rating} / 10`
								: undefined
						}
					/>
					<div>
						<p className="text-muted-foreground text-xs">highlights</p>
						<ul className="mt-1 list-disc space-y-0.5 pl-5">
							{(partial.highlights ?? []).map((h) => (
								<li key={h}>{h}</li>
							))}
							{!partial.highlights?.length && (
								<li className="list-none text-muted-foreground/60">…</li>
							)}
						</ul>
					</div>
					<div>
						<p className="text-muted-foreground text-xs">stack</p>
						<div className="mt-1 flex flex-wrap gap-1">
							{(partial.stack ?? []).map((s) => (
								<Badge key={s} variant="outline">
									{s}
								</Badge>
							))}
						</div>
					</div>
				</div>
				{final && (
					<details className="mt-3 text-xs">
						<summary className="cursor-pointer text-muted-foreground">
							已校验 JSON
						</summary>
						<pre className="mt-1 overflow-x-auto rounded bg-muted p-2">
							{JSON.stringify(final, null, 2)}
						</pre>
					</details>
				)}
			</Card>
		</div>
	);
}

function Field({ label, value }: { label: string; value?: string | number }) {
	return (
		<div>
			<p className="text-muted-foreground text-xs">{label}</p>
			<p className="font-medium">
				{value !== undefined && value !== "" ? (
					value
				) : (
					<span className="text-muted-foreground/60">…</span>
				)}
			</p>
		</div>
	);
}
