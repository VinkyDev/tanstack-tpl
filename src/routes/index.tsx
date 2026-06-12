import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Bot,
	Database,
	FormInput,
	Gauge,
	Layers,
	Sparkles,
	Zap,
} from "lucide-react";
import { LogoLoop } from "@/components/logo-loop";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const Route = createFileRoute("/")({ component: Home });

const demos = [
	{
		title: "TanStack AI",
		description: "流式输出 + 工具调用 + 结构化输出",
		icon: Bot,
		href: "/demo",
		color: "text-violet-500",
		bg: "bg-violet-500/10",
	},
	{
		title: "TanStack Store",
		description: "响应式状态管理 + Atom 派生",
		icon: Layers,
		href: "/store",
		color: "text-cyan-500",
		bg: "bg-cyan-500/10",
	},
	{
		title: "TanStack DB",
		description: "本地乐观集合 + Live Query",
		icon: Database,
		href: "/db",
		color: "text-emerald-500",
		bg: "bg-emerald-500/10",
	},
	{
		title: "TanStack Pacer",
		description: "防抖 / 节流 / 速率限制",
		icon: Gauge,
		href: "/pacer",
		color: "text-orange-500",
		bg: "bg-orange-500/10",
	},
	{
		title: "TanStack Form",
		description: "类型安全表单 + 校验",
		icon: FormInput,
		href: "/form",
		color: "text-pink-500",
		bg: "bg-pink-500/10",
	},
];

function Home() {
	return (
		<div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 p-6 sm:p-10">
			<section className="space-y-4">
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
						<Sparkles className="size-5" />
					</div>
					<div>
						<h1 className="font-bold text-3xl tracking-tight">
							TanStack 全家桶演示
						</h1>
						<p className="text-muted-foreground text-sm">
							React 19 + Vite 8 + Tailwind 4 + Coss UI
						</p>
					</div>
				</div>

				<LogoLoop />

				<p className="max-w-2xl text-muted-foreground leading-relaxed">
					这是一个完整的 TanStack 技术栈演示模板，展示了
					Router、Query、AI、Form、Store、DB、Pacer
					等库的典型用法。每个模块都有独立的交互页面，帮助你快速理解各库的能力边界。
				</p>
			</section>

			<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{demos.map((d) => (
					<Link key={d.href} to={d.href} className="group">
						<Card className="h-full transition hover:border-primary/40 hover:shadow-sm">
							<CardHeader>
								<div className="flex items-center justify-between">
									<div
										className={`flex size-9 items-center justify-center rounded-lg ${d.bg}`}
									>
										<d.icon className={`size-4.5 ${d.color}`} />
									</div>
									<ArrowRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
								</div>
								<CardTitle className="text-base">{d.title}</CardTitle>
								<CardDescription>{d.description}</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				))}

				<Card className="h-full border-dashed">
					<CardHeader>
						<div className="flex size-9 items-center justify-center rounded-lg bg-muted">
							<Zap className="size-4.5 text-muted-foreground" />
						</div>
						<CardTitle className="text-base">更多能力</CardTitle>
						<CardDescription>
							已内置 Drizzle ORM、Biome、React Compiler、TanStack Devtools
							等基础设施
						</CardDescription>
					</CardHeader>
				</Card>
			</section>

			<footer className="mt-auto pt-8 text-center text-muted-foreground text-xs">
				<p>
					Built with{" "}
					<span className="font-medium text-foreground">TanStack Start</span> ·
					Open the TanStack Devtools (bottom-right) to inspect router & query
					state
				</p>
			</footer>
		</div>
	);
}
