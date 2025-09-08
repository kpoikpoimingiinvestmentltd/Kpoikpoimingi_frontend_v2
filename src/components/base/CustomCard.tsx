import { twMerge } from "tailwind-merge";

export default function CustomCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
	return <div className={`${twMerge("bg-white border border-gray-100 rounded-lg p-4 h-full", className)}`}>{children}</div>;
}
