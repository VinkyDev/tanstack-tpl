"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TechItem {
	name: string;
	color: string;
}

const techStack: TechItem[] = [
	{ name: "TanStack Router", color: "#f59e0b" },
	{ name: "TanStack Query", color: "#ef4444" },
	{ name: "TanStack AI", color: "#8b5cf6" },
	{ name: "TanStack Form", color: "#ec4899" },
	{ name: "TanStack Store", color: "#06b6d4" },
	{ name: "TanStack DB", color: "#10b981" },
	{ name: "TanStack Pacer", color: "#f97316" },
	{ name: "React 19", color: "#0ea5e9" },
	{ name: "Vite 8", color: "#6366f1" },
	{ name: "Tailwind 4", color: "#14b8a6" },
	{ name: "Drizzle", color: "#22c55e" },
	{ name: "Biome", color: "#eab308" },
];

export function LogoLoop({ className }: { className?: string }) {
	const trackRef = useRef<HTMLDivElement>(null);
	const positionRef = useRef(0);
	const rafRef = useRef<number>(0);

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;

		let lastTime = performance.now();
		const speed = 40; // pixels per second

		const animate = (time: number) => {
			const delta = (time - lastTime) / 1000;
			lastTime = time;

			const itemWidth = track.scrollHeight * 3.5; // approximate width per item
			const totalWidth = itemWidth * techStack.length;

			positionRef.current += speed * delta;
			if (positionRef.current >= totalWidth / 2) {
				positionRef.current = 0;
			}

			track.style.transform = `translateX(-${positionRef.current}px)`;
			rafRef.current = requestAnimationFrame(animate);
		};

		rafRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(rafRef.current);
	}, []);

	const doubled = [...techStack, ...techStack];

	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-xl border bg-card/50 py-4",
				className,
			)}
		>
			<div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
			<div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
			<div
				ref={trackRef}
				className="flex items-center gap-6 will-change-transform"
				style={{ width: "max-content" }}
			>
				{doubled.map((tech, i) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: static array, never reordered
						key={i}
						className="flex shrink-0 items-center gap-2 rounded-lg border bg-background/80 px-4 py-2 shadow-sm"
					>
						<span
							className="inline-block size-2.5 rounded-full"
							style={{ backgroundColor: tech.color }}
						/>
						<span className="whitespace-nowrap text-sm font-medium">
							{tech.name}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
