import React from "react";

interface DetailFieldProps {
	label: string;
	value: React.ReactNode;
	labelClassName?: string;
	valueClassName?: string;
}

export default function DetailField({
	label,
	value,
	labelClassName = "text-sm text-gray-600 dark:text-gray-400",
	valueClassName = "font-medium dark:text-gray-100",
}: DetailFieldProps) {
	return (
		<div>
			<label className={labelClassName}>{label}</label>
			<p className={valueClassName}>{value}</p>
		</div>
	);
}
