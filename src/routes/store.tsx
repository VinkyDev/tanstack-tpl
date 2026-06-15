import { createFileRoute } from "@tanstack/react-router";
import { createStore, useSelector } from "@tanstack/react-store";
import { Layers, Minus, Plus, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/store")({ component: StorePage });

// --- Store Demo 1: Counter with actions factory ---
// Zustand-style: state + actions live together in one store.
// Components subscribe to only the slice they need via useSelector.
interface CounterState {
	count: number;
	step: number;
}

const counterStore = createStore(
	{ count: 0, step: 1 },
	({
		setState,
	}: {
		setState: (updater: (prev: CounterState) => CounterState) => void;
	}) => ({
		increment: () => setState((s) => ({ ...s, count: s.count + s.step })),
		decrement: () => setState((s) => ({ ...s, count: s.count - s.step })),
		reset: () => setState(() => ({ count: 0, step: 1 })),
		setStep: (step: number) =>
			setState((s) => ({ ...s, step: Math.max(1, step) })),
	}),
);

// --- Store Demo 2: Derived selections ---
// Derived values are computed inside useSelector selectors, not stored.
// This is the zustand-style equivalent of computed atoms.
interface CartState {
	price: number;
	quantity: number;
	discount: number;
}

const cartStore = createStore(
	{ price: 100, quantity: 2, discount: 0.1 },
	({
		setState,
	}: {
		setState: (updater: (prev: CartState) => CartState) => void;
	}) => ({
		setPrice: (price: number) => setState((s) => ({ ...s, price })),
		setQuantity: (quantity: number) => setState((s) => ({ ...s, quantity })),
		setDiscount: (discount: number) =>
			setState((s) => ({ ...s, discount: Math.max(0, Math.min(1, discount)) })),
	}),
);

function StorePage() {
	return (
		<div className="mx-auto max-w-5xl space-y-6 p-6 sm:p-10">
			<header className="space-y-2">
				<div className="flex items-center gap-2">
					<Layers className="size-6 text-cyan-500" />
					<h1 className="font-bold text-3xl">TanStack Store</h1>
				</div>
				<p className="text-muted-foreground">
					Zustand 风格状态管理 — createStore + useSelector 细粒度订阅 / actions
					factory / selector 派生
				</p>
			</header>

			<Tabs defaultValue="counter">
				<TabsList>
					<TabsTrigger value="counter">Counter + Actions</TabsTrigger>
					<TabsTrigger value="derived">Selector 派生</TabsTrigger>
				</TabsList>

				<TabsContent value="counter" className="pt-4">
					<CounterDemo />
				</TabsContent>
				<TabsContent value="derived" className="pt-4">
					<DerivedDemo />
				</TabsContent>
			</Tabs>
		</div>
	);
}

function CounterDemo() {
	const [localStep, setLocalStep] = useState(1);

	return (
		<div className="grid gap-4 lg:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle className="text-base">计数器 Store</CardTitle>
					<CardDescription>
						通过 store.actions 更新，useSelector 订阅避免无关重渲染
					</CardDescription>
				</CardHeader>
				<div className="flex flex-col items-center gap-4 p-6 pt-0">
					<CounterDisplay />
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="icon"
							onClick={() => counterStore.actions.decrement()}
						>
							<Minus className="size-4" />
						</Button>
						<Button
							variant="outline"
							size="icon"
							onClick={() => counterStore.actions.increment()}
						>
							<Plus className="size-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => counterStore.actions.reset()}
						>
							<RotateCcw className="size-4" />
						</Button>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground text-sm">步长:</span>
						<Input
							type="number"
							className="w-20"
							value={localStep}
							onChange={(e) => {
								const v = Number(e.target.value) || 1;
								setLocalStep(v);
								counterStore.actions.setStep(v);
							}}
						/>
					</div>
				</div>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">独立订阅组件</CardTitle>
					<CardDescription>每个组件只订阅自己关心的字段</CardDescription>
				</CardHeader>
				<div className="space-y-3 p-6 pt-0">
					<StepDisplay />
					<HistoryDisplay />
				</div>
			</Card>
		</div>
	);
}

function CounterDisplay() {
	const count = useSelector(counterStore, (s) => s.count);
	return (
		<div className="flex items-center gap-3">
			<span className="text-muted-foreground text-sm">当前值</span>
			<span className="font-mono text-4xl font-bold">{count}</span>
		</div>
	);
}

function StepDisplay() {
	const step = useSelector(counterStore, (s) => s.step);
	return (
		<div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
			<span className="text-sm">步长 (step)</span>
			<Badge variant="secondary">{step}</Badge>
		</div>
	);
}

function HistoryDisplay() {
	const count = useSelector(counterStore, (s) => s.count);
	const [history, setHistory] = useState<number[]>([count]);

	useEffect(() => {
		setHistory((prev) => {
			if (prev[prev.length - 1] === count) return prev;
			return [...prev.slice(-9), count];
		});
	}, [count]);

	return (
		<div className="space-y-1">
			<span className="text-muted-foreground text-sm">最近变化</span>
			<div className="flex flex-wrap gap-1">
				{history.map((v, i) => (
					<Badge key={`${v}-${i}`} variant="outline">
						{v}
					</Badge>
				))}
			</div>
		</div>
	);
}

function DerivedDemo() {
	const price = useSelector(cartStore, (s) => s.price);
	const quantity = useSelector(cartStore, (s) => s.quantity);
	const discount = useSelector(cartStore, (s) => s.discount);

	// Derived values are computed on read via selectors.
	// Each selector only re-computes when its dependencies change.
	const subtotal = useSelector(cartStore, (s) => s.price * s.quantity);
	const discountAmount = useSelector(
		cartStore,
		(s) => s.price * s.quantity * s.discount,
	);
	const total = useSelector(
		cartStore,
		(s) => s.price * s.quantity * (1 - s.discount),
	);

	return (
		<div className="grid gap-4 lg:grid-cols-2">
			<Card>
				<CardHeader>
					<CardTitle className="text-base">原子状态</CardTitle>
					<CardDescription>
						Store 中只存原始值，派生值交给 useSelector
					</CardDescription>
				</CardHeader>
				<div className="space-y-4 p-6 pt-0">
					<RangeField
						label="单价 (price)"
						value={price}
						onChange={(v) => cartStore.actions.setPrice(v)}
					/>
					<RangeField
						label="数量 (quantity)"
						value={quantity}
						onChange={(v) => cartStore.actions.setQuantity(v)}
					/>
					<RangeField
						label="折扣 (discount)"
						value={discount}
						step={0.05}
						max={1}
						onChange={(v) => cartStore.actions.setDiscount(v)}
					/>
				</div>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Selector 派生</CardTitle>
					<CardDescription>
						useSelector 内部做纯计算，组件只订阅结果
					</CardDescription>
				</CardHeader>
				<div className="space-y-3 p-6 pt-0">
					<div className="flex items-center justify-between rounded-lg border p-3">
						<span className="text-sm text-muted-foreground">小计</span>
						<span className="font-mono font-medium">
							¥{subtotal.toFixed(2)}
						</span>
					</div>
					<div className="flex items-center justify-between rounded-lg border p-3">
						<span className="text-sm text-muted-foreground">折扣</span>
						<span className="font-mono font-medium">
							-¥{discountAmount.toFixed(2)} ({(discount * 100).toFixed(0)}%)
						</span>
					</div>
					<div className="flex items-center justify-between rounded-lg bg-primary/5 p-3">
						<span className="text-sm font-medium">合计</span>
						<span className="font-mono text-xl font-bold">
							¥{total.toFixed(2)}
						</span>
					</div>
				</div>
			</Card>
		</div>
	);
}

function RangeField({
	label,
	value,
	onChange,
	step = 1,
	max,
}: {
	label: string;
	value: number;
	onChange: (v: number) => void;
	step?: number;
	max?: number;
}) {
	return (
		<div className="space-y-1">
			<div className="flex items-center justify-between">
				<span className="text-sm text-muted-foreground">{label}</span>
				<Badge variant="secondary">{value}</Badge>
			</div>
			<input
				type="range"
				min={0}
				max={max ?? 1000}
				step={step}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className="w-full accent-primary"
			/>
		</div>
	);
}
