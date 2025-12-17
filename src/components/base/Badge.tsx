import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
	// existing API kept for backward compatibility
	value: string | number;
	mapping?: Record<number | string, string>;
	className?: string;
	size?: "sm" | "md" | "lg";
	// `label` lets you set the visible text independently of the status/color
	label?: ReactNode;
	// `status` forces the status used for styling (icon/dot/color). If omitted,
	// status is derived from `value` (existing behavior).
	status?: string;
	// optionally show a small colored dot indicating status (default: false)
	showDot?: boolean;
};

// Default numeric -> status mapping (assumption: common codes)
const defaultNumberMap: Record<number, string> = {
	1: "banned",
	2: "inactive",
	3: "success",
	4: "pending",
	5: "active",
};

// Map normalized status -> tailwind classes
const statusClassMap: Record<string, string> = {
	success: "bg-green-100 text-green-800",
	active: "bg-green-100 text-green-800",
	pending: "bg-yellow-100 text-yellow-800",
	processing: "bg-yellow-100 text-yellow-800",
	banned: "bg-red-100 text-red-800",
	inactive: "bg-gray-100 text-gray-700",
	cancelled: "bg-red-100 text-red-800",
	canceled: "bg-red-100 text-red-800",
	expired: "bg-orange-100 text-orange-800",
	terminated: "bg-red-100 text-red-800",
	paused: "bg-yellow-100 text-yellow-800",
	primary: "bg-primary/10 text-primary",
	completed: "bg-green-800 text-white",
};

// small dot color classes keyed by normalized status
const statusDotMap: Record<string, string> = {
	success: "bg-green-500",
	active: "bg-green-500",
	pending: "bg-amber-400",
	processing: "bg-amber-400",
	banned: "bg-red-500",
	inactive: "bg-gray-400",
	cancelled: "bg-red-500",
	canceled: "bg-red-500",
	primary: "bg-primary",
	expired: "bg-orange-500",
	terminated: "bg-red-500",
	paused: "bg-amber-400",
	completed: "bg-white",
};

function normalizeStatus(s: string) {
	return s.trim().toLowerCase();
}

function prettyLabel(s: string) {
	if (!s) return "";
	return s
		.toLowerCase() // normalize to lowercase first
		.split(/[_\-\s,]+/) // split by delimiters including comma
		.filter((part) => part.length > 0) // remove empty strings
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

export default function Badge({ value, mapping, className, size = "md", label, status, showDot = false }: BadgeProps) {
	let statusStr: string;

	if (typeof value === "number") {
		statusStr = (mapping && mapping[value]) ?? defaultNumberMap[value] ?? String(value);
	} else {
		statusStr = (mapping && mapping[value]) ?? value;
	}

	const statusSource = status ?? String(statusStr);
	const key = normalizeStatus(String(statusSource));
	const variantClasses = statusClassMap[key] ?? "bg-muted text-muted-foreground";

	const sizeClasses =
		size === "sm" ? "text-xs px-2 py-0.5 rounded" : size === "lg" ? "text-sm px-3 py-1 rounded-md" : "text-sm px-2.5 py-1 rounded-md";

	const display = label ?? prettyLabel(String(statusStr));

	return (
		<span className={cn("inline-flex items-center font-medium", sizeClasses, variantClasses, className)}>
			{showDot ? <span className={cn("inline-block w-2 h-2 rounded-full mr-2", statusDotMap[key] ?? "bg-gray-400")} aria-hidden /> : null}
			{display}
		</span>
	);
}
