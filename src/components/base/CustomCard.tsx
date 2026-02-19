import { twMerge } from "tailwind-merge";
import React from "react";

// Forward ref so consumers can capture the card node for printing / PDF
const CustomCard = React.forwardRef<HTMLDivElement, { className?: string; children: React.ReactNode }>(({ className = "", children }, ref) => {
	return (
		<div
			ref={ref}
			className={`${twMerge("bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 w-full rounded-lg p-4 h-full", className)}`}>
			{children}
		</div>
	);
});

CustomCard.displayName = "CustomCard";

export default CustomCard;
