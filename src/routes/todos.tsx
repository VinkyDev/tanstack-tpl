"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, Loader2, Plus, Trash2 } from "lucide-react";
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

export const Route = createFileRoute("/todos")({ component: TodosPage });

interface Todo {
	id: number;
	title: string;
	completed: boolean;
	createdAt: string | null;
}

const todosQueryKey = ["todos"] as const;

function TodosPage() {
	const queryClient = useQueryClient();
	const [title, setTitle] = useState("");

	const {
		data: todos,
		isLoading,
		error,
	} = useQuery<Todo[]>({
		queryKey: todosQueryKey,
		queryFn: async () => {
			const res = await fetch("/api/todos");
			if (!res.ok) throw new Error("Failed to load todos");
			return res.json();
		},
	});

	const createMutation = useMutation({
		mutationFn: async (newTitle: string) => {
			const res = await fetch("/api/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title: newTitle }),
			});
			if (!res.ok) {
				const err = await res.json();
				throw new Error(err.error?.title?._errors?.[0] ?? "Create failed");
			}
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: todosQueryKey });
			setTitle("");
		},
	});

	const toggleMutation = useMutation({
		mutationFn: async (todo: Todo) => {
			const res = await fetch("/api/todos", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: todo.id, completed: !todo.completed }),
			});
			if (!res.ok) throw new Error("Update failed");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: todosQueryKey });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: number) => {
			const res = await fetch("/api/todos", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			if (!res.ok) throw new Error("Delete failed");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: todosQueryKey });
		},
	});

	const handleAdd = (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim()) return;
		createMutation.mutate(title.trim());
	};

	const completedCount = todos?.filter((t) => t.completed).length ?? 0;
	const totalCount = todos?.length ?? 0;

	return (
		<div className="mx-auto max-w-5xl space-y-6 p-6 sm:p-10">
			<header className="space-y-2">
				<div className="flex items-center gap-2">
					<CheckCircle2 className="size-6 text-blue-500" />
					<h1 className="font-bold text-3xl">TanStack Query + Drizzle</h1>
				</div>
				<p className="text-muted-foreground">
					服务端 PostgreSQL CRUD：useQuery 读取，useMutation 写入，自动缓存失效
				</p>
			</header>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">新增待办</CardTitle>
					<CardDescription>
						输入标题后提交，POST /api/todos 写入 PostgreSQL
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleAdd} className="flex items-start gap-3 p-6 pt-0">
					<Input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="写点什么..."
						disabled={createMutation.isPending}
						className="flex-1"
					/>
					<Button
						type="submit"
						disabled={!title.trim() || createMutation.isPending}
					>
						{createMutation.isPending ? (
							<Loader2 className="mr-2 size-4 animate-spin" />
						) : (
							<Plus className="mr-2 size-4" />
						)}
						添加
					</Button>
				</form>
				{createMutation.error && (
					<p className="px-6 pb-6 text-destructive text-sm">
						{createMutation.error.message}
					</p>
				)}
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-base">待办列表</CardTitle>
							<CardDescription>
								GET /api/todos 返回 Drizzle 查询结果
							</CardDescription>
						</div>
						<Badge variant="secondary">
							{completedCount} / {totalCount} 完成
						</Badge>
					</div>
				</CardHeader>
				<div className="space-y-2 p-6 pt-0">
					{isLoading && (
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<Loader2 className="size-4 animate-spin" />
							加载中...
						</div>
					)}
					{error && (
						<p className="text-destructive text-sm">
							加载失败: {error.message}
						</p>
					)}
					{!isLoading && !error && todos?.length === 0 && (
						<p className="text-muted-foreground text-sm">
							暂无待办，添加一条吧
						</p>
					)}
					{todos?.map((todo) => (
						<div
							key={todo.id}
							className="flex items-center justify-between gap-3 rounded-lg border p-3"
						>
							<div className="flex min-w-0 items-center gap-3">
								<Button
									variant="ghost"
									size="icon-xs"
									onClick={() => toggleMutation.mutate(todo)}
									disabled={toggleMutation.isPending}
									aria-label={todo.completed ? "标记未完成" : "标记完成"}
								>
									{todo.completed ? (
										<CheckCircle2 className="size-4 text-success" />
									) : (
										<Circle className="size-4 text-muted-foreground" />
									)}
								</Button>
								<span
									className={`truncate text-sm ${
										todo.completed ? "text-muted-foreground line-through" : ""
									}`}
								>
									{todo.title}
								</span>
							</div>
							<Button
								variant="ghost"
								size="icon-xs"
								onClick={() => deleteMutation.mutate(todo.id)}
								disabled={deleteMutation.isPending}
								aria-label="删除"
							>
								<Trash2 className="size-4 text-destructive" />
							</Button>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
}
