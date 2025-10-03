import { twMerge } from "tailwind-merge";
type Props = {
	status: "Successful" | "Failed" | string;
	className?: string;
};

export default function StatusBadge({ status, className = "" }: Props) {
	const normalized = String(status).trim().toLowerCase();
	const base = "px-3 py-1 rounded-md text-sm font-medium inline-block";

	const variant =
		normalized.includes("success") || normalized === "successful"
			? "bg-green-100 text-green-700"
			: normalized.includes("pending") || normalized.includes("process")
			? "bg-yellow-100 text-yellow-800"
			: "bg-red-50 text-red-600";

	return <span className={twMerge(base, variant, className)}>{status}</span>;
}
