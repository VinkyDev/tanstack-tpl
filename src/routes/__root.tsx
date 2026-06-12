import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Bot, Database, FormInput, Gauge, Home, Layers } from "lucide-react";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

function DefaultNotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<h1 className="text-4xl font-bold mb-4">404</h1>
				<p className="text-gray-600">Page not found</p>
			</div>
		</div>
	);
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	notFoundComponent: DefaultNotFound,
	shellComponent: RootDocument,
});

const navItems = [
	{ to: "/", label: "首页", icon: Home },
	{ to: "/demo", label: "AI", icon: Bot },
	{ to: "/store", label: "Store", icon: Layers },
	{ to: "/db", label: "DB", icon: Database },
	{ to: "/pacer", label: "Pacer", icon: Gauge },
	{ to: "/form", label: "Form", icon: FormInput },
];

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="zh-CN">
			<head>
				<HeadContent />
			</head>
			<body>
				<div className="flex min-h-screen flex-col">
					<Navbar />
					<main className="flex-1">{children}</main>
				</div>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}

function Navbar() {
	const { location } = useRouterState();
	const current = location.pathname;

	return (
		<header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
			<nav className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-2">
				{navItems.map((item) => {
					const active = current === item.to;
					return (
						<Link
							key={item.to}
							to={item.to}
							className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
								active
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-accent hover:text-foreground"
							}`}
						>
							<item.icon className="size-3.5" />
							{item.label}
						</Link>
					);
				})}
			</nav>
		</header>
	);
}
