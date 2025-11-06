import * as React from "react";
import { twMerge } from "tailwind-merge";

export function Skeleton({ className = "", children }: { className?: string; children?: React.ReactNode }) {
	return <div className={`animate-pulse bg-transparent ${className}`}>{children}</div>;
}

export function Rect({ className = "h-4 bg-gray-200 rounded" }: { className?: string }) {
	return <div className={className} />;
}

export function RectangleSkeleton({ className = "bg-gray-200 rounded" }: { className?: string }) {
	return <div className={twMerge("bg-gray-200 rounded", className)} aria-hidden />;
}

export function AvatarSkeleton({ size = 36 }: { size?: number }) {
	const s = `${size}px`;
	return <div style={{ width: s, height: s }} className="rounded-full bg-gray-200" aria-hidden />;
}

export function CardSkeleton({ lines = 4 }: { lines?: number }) {
	return (
		<Skeleton className="p-4 bg-white rounded-lg">
			<div className="space-y-3.5">
				<div className="w-1/3 h-6 bg-gray-200 rounded" />
				{Array.from({ length: lines }).map((_, i) => (
					<div key={i} className="w-full h-4 bg-gray-200 rounded" />
				))}
			</div>
		</Skeleton>
	);
}

export function TableSkeleton({ rows = 4, cols = 6 }: { rows?: number; cols?: number }) {
	const colWidths = ["w-2/5", "w-1/5", "w-1/6", "w-1/12", "w-1/12", "w-1/12"];
	return (
		<div className="overflow-x-auto w-full">
			<div className="w-full bg-white">
				<div className="w-full">
					<div className="mb-4">
						<div className="h-6 w-1/6 bg-gray-200 rounded" />
					</div>
					<div className="space-y-3">
						{Array.from({ length: rows }).map((_, r) => (
							<div key={r} className="flex items-center gap-4 w-full" aria-hidden>
								{Array.from({ length: cols }).map((_, c) => (
									<div key={c} className={`${colWidths[c] ?? "flex-1"} h-6 bg-gray-200 rounded`} />
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Skeleton;
