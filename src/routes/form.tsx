import { useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, FormInput } from "lucide-react";
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
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/form")({ component: FormPage });

function FormPage() {
	const [submitted, setSubmitted] = useState<Record<
		string,
		string | number
	> | null>(null);

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			age: 18,
			bio: "",
		},
		onSubmit: async ({ value }) => {
			await new Promise((r) => setTimeout(r, 600));
			setSubmitted(value);
		},
	});

	return (
		<div className="mx-auto max-w-5xl space-y-6 p-6 sm:p-10">
			<header className="space-y-2">
				<div className="flex items-center gap-2">
					<FormInput className="size-6 text-pink-500" />
					<h1 className="font-bold text-3xl">TanStack Form</h1>
				</div>
				<p className="text-muted-foreground">
					类型安全表单 — useForm + Field 组件 + 同步/异步校验
				</p>
			</header>

			<div className="grid gap-4 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="text-base">用户信息</CardTitle>
						<CardDescription>
							演示字段级校验、错误提示与提交状态
						</CardDescription>
					</CardHeader>
					<form
						className="space-y-4 p-6 pt-0"
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
					>
						<form.Field
							name="name"
							validators={{
								onChange: ({ value }) =>
									value.length < 2 ? "姓名至少 2 个字符" : undefined,
							}}
						>
							{(field) => (
								<div className="space-y-1">
									<Label htmlFor={field.name}>姓名</Label>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="输入姓名"
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-destructive text-xs">
											{field.state.meta.errors[0]}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field
							name="email"
							validators={{
								onChange: ({ value }) =>
									!value.includes("@") ? "请输入有效的邮箱地址" : undefined,
							}}
						>
							{(field) => (
								<div className="space-y-1">
									<Label htmlFor={field.name}>邮箱</Label>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="you@example.com"
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-destructive text-xs">
											{field.state.meta.errors[0]}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field
							name="age"
							validators={{
								onChange: ({ value }) =>
									value < 1 || value > 120
										? "年龄必须在 1-120 之间"
										: undefined,
							}}
						>
							{(field) => (
								<div className="space-y-1">
									<Label htmlFor={field.name}>年龄</Label>
									<Input
										id={field.name}
										name={field.name}
										type="number"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(Number(e.target.value))}
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-destructive text-xs">
											{field.state.meta.errors[0]}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Field
							name="bio"
							validators={{
								onChange: ({ value }) =>
									value.length > 200 ? "简介最多 200 字" : undefined,
							}}
						>
							{(field) => (
								<div className="space-y-1">
									<div className="flex items-center justify-between">
										<Label htmlFor={field.name}>简介</Label>
										<span className="text-muted-foreground text-xs">
											{field.state.value.length}/200
										</span>
									</div>
									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="简单介绍一下自己..."
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-destructive text-xs">
											{field.state.meta.errors[0]}
										</p>
									)}
								</div>
							)}
						</form.Field>

						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
						>
							{([canSubmit, isSubmitting]) => (
								<Button type="submit" disabled={!canSubmit} className="w-full">
									{isSubmitting ? "提交中..." : "提交"}
								</Button>
							)}
						</form.Subscribe>
					</form>
				</Card>

				<div className="space-y-3">
					<Card>
						<CardHeader>
							<CardTitle className="text-base">表单状态</CardTitle>
							<CardDescription>
								通过 form.Subscribe 监听整体状态
							</CardDescription>
						</CardHeader>
						<div className="space-y-2 p-6 pt-0">
							<form.Subscribe
								selector={(state) => ({
									isDirty: state.isDirty,
									isTouched: state.isTouched,
									isValid: state.isValid,
									isSubmitting: state.isSubmitting,
								})}
							>
								{(s) => (
									<>
										<StateRow
											label="isDirty"
											value={s.isDirty ? "true" : "false"}
											active={s.isDirty}
										/>
										<StateRow
											label="isTouched"
											value={s.isTouched ? "true" : "false"}
											active={s.isTouched}
										/>
										<StateRow
											label="isValid"
											value={s.isValid ? "true" : "false"}
											active={s.isValid}
										/>
										<StateRow
											label="isSubmitting"
											value={s.isSubmitting ? "true" : "false"}
											active={s.isSubmitting}
										/>
									</>
								)}
							</form.Subscribe>
						</div>
					</Card>

					{submitted && (
						<Card className="border-success/50 bg-success/5">
							<CardHeader>
								<div className="flex items-center gap-2">
									<CheckCircle2 className="size-5 text-success" />
									<CardTitle className="text-base">提交成功</CardTitle>
								</div>
							</CardHeader>
							<div className="space-y-1 p-6 pt-0">
								{Object.entries(submitted).map(([k, v]) => (
									<div
										key={k}
										className="flex items-center justify-between rounded-lg border p-2"
									>
										<span className="text-muted-foreground text-sm">{k}</span>
										<Badge variant="secondary">{String(v)}</Badge>
									</div>
								))}
							</div>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}

function StateRow({
	label,
	value,
	active,
}: {
	label: string;
	value: string;
	active?: boolean;
}) {
	return (
		<div className="flex items-center justify-between rounded-lg border p-2.5">
			<span className="text-muted-foreground text-sm">{label}</span>
			<Badge variant={active ? "secondary" : "outline"}>{value}</Badge>
		</div>
	);
}
