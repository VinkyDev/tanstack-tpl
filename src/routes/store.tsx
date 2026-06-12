import { createFileRoute } from "@tanstack/react-router";
import { createAtom, createStore, useAtom, useStore } from "@tanstack/react-store";
import { Layers, Minus, Plus, RotateCcw } from "lucide-react";
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

export const Route = createFileRoute("/store")({ component: StorePage });

// --- Store Demo 1: Counter Store ---
const counterStore = createStore({ count: 0, step: 1 });

// --- Store Demo 2: Derived Atoms ---
const priceAtom = createAtom(100);
const quantityAtom = createAtom(2);
const discountAtom = createAtom(0.1);

function StorePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6 sm:p-10">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <Layers className="size-6 text-cyan-500" />
          <h1 className="font-bold text-3xl">TanStack Store</h1>
        </div>
        <p className="text-muted-foreground">
          轻量级响应式状态管理 — createStore / createAtom / 派生订阅
        </p>
      </header>

      <Tabs defaultValue="store">
        <TabsList>
          <TabsTab value="store">createStore</TabsTab>
          <TabsTab value="atom">createAtom + 派生</TabsTab>
        </TabsList>

        <TabsPanel value="store" className="pt-4">
          <CounterDemo />
        </TabsPanel>
        <TabsPanel value="atom" className="pt-4">
          <DerivedAtomDemo />
        </TabsPanel>
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
            通过 store.setState 直接更新，所有订阅组件自动重渲染
          </CardDescription>
        </CardHeader>
        <div className="flex flex-col items-center gap-4 p-6 pt-0">
          <CounterDisplay />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                counterStore.setState((s) => ({
                  ...s,
                  count: s.count - s.step,
                }))
              }
            >
              <Minus className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                counterStore.setState((s) => ({
                  ...s,
                  count: s.count + s.step,
                }))
              }
            >
              <Plus className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => counterStore.setState((s) => ({ ...s, count: 0, step: 1 }))}
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
                counterStore.setState((s) => ({ ...s, step: v }));
              }}
            />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">独立订阅组件</CardTitle>
          <CardDescription>
            每个组件只订阅自己关心的字段，避免无关重渲染
          </CardDescription>
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
  const count = useStore(counterStore, (s) => s.count);
  return (
    <div className="flex items-center gap-3">
      <span className="text-muted-foreground text-sm">当前值</span>
      <span className="font-mono text-4xl font-bold">{count}</span>
    </div>
  );
}

function StepDisplay() {
  const step = useStore(counterStore, (s) => s.step);
  return (
    <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
      <span className="text-sm">步长 (step)</span>
      <Badge variant="secondary">{step}</Badge>
    </div>
  );
}

function HistoryDisplay() {
  const [history, setHistory] = useState<number[]>([0]);

  // 订阅 count 变化并记录历史
  useStore(counterStore, (s) => s.count);

  // 用 effect 监听变化（简化演示）
  const current = counterStore.state.count;
  const last = history[history.length - 1];
  if (current !== last && !history.includes(current)) {
    setHistory((h) => [...h.slice(-9), current]);
  }

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

function DerivedAtomDemo() {
  const [price] = useAtom(priceAtom);
  const [quantity] = useAtom(quantityAtom);
  const [discount] = useAtom(discountAtom);

  const subtotal = price * quantity;
  const total = subtotal * (1 - discount);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">原子状态</CardTitle>
          <CardDescription>
            createAtom 创建独立原子，可组合成派生计算
          </CardDescription>
        </CardHeader>
        <div className="space-y-4 p-6 pt-0">
          <AtomField
            label="单价 (price)"
            value={price}
            onChange={(v) => priceAtom.set(v)}
          />
          <AtomField
            label="数量 (quantity)"
            value={quantity}
            onChange={(v) => quantityAtom.set(v)}
          />
          <AtomField
            label="折扣 (discount)"
            value={discount}
            step={0.05}
            max={1}
            onChange={(v) => discountAtom.set(v)}
          />
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">派生计算</CardTitle>
          <CardDescription>
            基于 Atom 的纯派生值，无需额外订阅逻辑
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
              -¥{(subtotal * discount).toFixed(2)} ({(discount * 100).toFixed(0)}%)
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

function AtomField({
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
