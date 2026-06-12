import {
	useDebouncedValue,
	useRateLimitedValue,
	useThrottledValue,
} from "@tanstack/react-pacer";
import { createFileRoute } from "@tanstack/react-router";
import { Gauge, MousePointerClick } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";

export const Route = createFileRoute("/pacer")({ component: PacerPage });

function PacerPage() {
	return (
		<div className="mx-auto max-w-5xl space-y-6 p-6 sm:p-10">
			<header className="space-y-2">
				<div className="flex items-center gap-2">
					<Gauge className="size-6 text-orange-500" />
					<h1 className="font-bold text-3xl">TanStack Pacer</h1>
				</div>
				<p className="text-muted-foreground">
					防抖 (Debounce) / 节流 (Throttle) / 速率限制 (Rate Limit) —
					控制函数与状态的执行频率
				</p>
			</header>

			<Tabs defaultValue="debounce">
				<TabsList>
					<TabsTab value="debounce">Debounce</TabsTab>
					<TabsTab value="throttle">Throttle</TabsTab>
					<TabsTab value="ratelimit">Rate Limit</TabsTab>
				</TabsList>

				<TabsPanel value="debounce" className="pt-4">
					<DebounceDemo />
				</TabsPanel>
				<TabsPanel value="throttle" className="pt-4">
					<ThrottleDemo />
				</TabsPanel>
				<TabsPanel value="ratelimit" className="pt-4">
					<RateLimitDemo />
				</TabsPanel>
			</Tabs>
		</div>
	);
}

function DebounceDemo() {
	const [input, setInput] = useState("");
	const [debouncedInput, debouncer] = useDebouncedValue(input, {
		wait: 600,
		leading: false,
		trailing: true,
	});

	return (
		<div className="grid gap-4 lg:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle className="text-base">useDebouncedValue</CardTitle>
					<CardDescription>
						输入停止 600ms 后才更新下游值，适合搜索框等场景
					</CardDescription>
				</CardHeader>
				<div className="space-y-4 p-6 pt-0">
					<div className="space-y-1">
						<label
							htmlFor="raw-input"
							className="text-muted-foreground text-xs"
						>
							原始输入
						</label>
						<Input
							id="raw-input"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="快速输入文字..."
						/>
					</div>
					<div className="space-y-1">
						<span className="text-muted-foreground text-xs">防抖后</span>
						<div className="rounded-lg border bg-muted/50 p-3 font-mono text-sm">
							{debouncedInput || (
								<span className="text-muted-foreground/50">等待输入...</span>
							)}
						</div>
					</div>
				</div>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Debouncer 状态</CardTitle>
					<CardDescription>
						通过 selector 订阅内部状态，观察防抖器行为
					</CardDescription>
				</CardHeader>
				<div className="space-y-2 p-6 pt-0">
					<StateRow label="status" value={debouncer.state.status ?? "idle"} />
					<StateRow
						label="isPending"
						value={debouncer.state.isPending ? "true" : "false"}
					/>
					<StateRow
						label="executionCount"
						value={String(debouncer.state.executionCount ?? 0)}
					/>
				</div>
			</Card>
		</div>
	);
}

function ThrottleDemo() {
	const [raw, setRaw] = useState(0);
	const [throttled, throttler] = useThrottledValue(raw, {
		wait: 1000,
		leading: true,
		trailing: true,
	});

	return (
		<div className="grid gap-4 lg:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle className="text-base">useThrottledValue</CardTitle>
					<CardDescription>
						每 1000ms 最多更新一次，适合滚动/鼠标移动等高频事件
					</CardDescription>
				</CardHeader>
				<div className="space-y-4 p-6 pt-0">
					<div className="flex items-center gap-3">
						<Button onClick={() => setRaw((v) => v + 1)} className="w-full">
							<MousePointerClick className="size-4" />
							快速点击
						</Button>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="rounded-lg border bg-muted/50 p-3 text-center">
							<p className="text-muted-foreground text-xs">原始值</p>
							<p className="font-mono text-2xl font-bold">{raw}</p>
						</div>
						<div className="rounded-lg border bg-primary/5 p-3 text-center">
							<p className="text-muted-foreground text-xs">节流后</p>
							<p className="font-mono text-2xl font-bold">{throttled}</p>
						</div>
					</div>
				</div>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Throttler 状态</CardTitle>
					<CardDescription>
						观察节流器的执行次数与下次可执行时间
					</CardDescription>
				</CardHeader>
				<div className="space-y-2 p-6 pt-0">
					<StateRow label="status" value={throttler.state.status ?? "idle"} />
					<StateRow
						label="executionCount"
						value={String(throttler.state.executionCount ?? 0)}
					/>
					<StateRow
						label="nextExecutionTime"
						value={
							throttler.state.nextExecutionTime
								? new Date(
										throttler.state.nextExecutionTime,
									).toLocaleTimeString()
								: "—"
						}
					/>
				</div>
			</Card>
		</div>
	);
}

function RateLimitDemo() {
	const [count, setCount] = useState(0);
	const [limited, limiter] = useRateLimitedValue(count, {
		limit: 5,
		window: 10000,
		windowType: "sliding",
	});

	return (
		<div className="grid gap-4 lg:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle className="text-base">useRateLimitedValue</CardTitle>
					<CardDescription>
						10 秒内最多允许 5 次更新，超出将被拒绝
					</CardDescription>
				</CardHeader>
				<div className="space-y-4 p-6 pt-0">
					<div className="flex items-center gap-3">
						<Button onClick={() => setCount((v) => v + 1)} className="w-full">
							<MousePointerClick className="size-4" />
							点击（观察限制）
						</Button>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="rounded-lg border bg-muted/50 p-3 text-center">
							<p className="text-muted-foreground text-xs">原始点击</p>
							<p className="font-mono text-2xl font-bold">{count}</p>
						</div>
						<div className="rounded-lg border bg-primary/5 p-3 text-center">
							<p className="text-muted-foreground text-xs">通过限制</p>
							<p className="font-mono text-2xl font-bold">{limited}</p>
						</div>
					</div>
					{limiter.state.rejectionCount ? (
						<p className="text-destructive text-sm">
							已被拒绝 {limiter.state.rejectionCount} 次
						</p>
					) : null}
				</div>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">RateLimiter 状态</CardTitle>
					<CardDescription>查看当前窗口内的执行次数与拒绝次数</CardDescription>
				</CardHeader>
				<div className="space-y-2 p-6 pt-0">
					<StateRow label="limit" value="5" />
					<StateRow label="window" value="10000ms" />
					<StateRow
						label="executionCount"
						value={String(limiter.state.executionCount ?? 0)}
					/>
					<StateRow
						label="rejectionCount"
						value={String(limiter.state.rejectionCount ?? 0)}
					/>
				</div>
			</Card>
		</div>
	);
}

function StateRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between rounded-lg border p-2.5">
			<span className="text-muted-foreground text-sm">{label}</span>
			<Badge variant="secondary">{value}</Badge>
		</div>
	);
}
