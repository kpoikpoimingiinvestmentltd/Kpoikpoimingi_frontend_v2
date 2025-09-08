import React from "react";
import { IconWrapper } from "../../assets/icons";
import { Skeleton } from "../ui/skeleton";
import { twMerge } from "tailwind-merge";

interface StatCardProps {
	title: string;
	value: string | number;
	icon?: React.ReactNode;
	className?: string;
	loading?: boolean;
	iconColor?: string;
	badge?: React.ReactNode;
}

export default function StatCard({ title, value, icon, loading, badge, iconColor = "", className = "" }: StatCardProps) {
	return (
		<div
			className={`bg-white w-full dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-lg p-4 flex flex-col justify-between min-w-[180px] min-h-32 ${className}`}>
			<div className="flex items-center justify-between">
				<div>
					<h3 className="text-gray-500 text-[.95rem] mb-1">{title}</h3>
				</div>
			</div>
			{loading ? (
				<Skeleton className="w-full bg-gray-100 dark:bg-gray-100/20 h-7 rounded-xs" />
			) : (
				<>
					{value && (
						<div className={`flex items-center gap-2 mt-2`}>
							<div className="text-2xl font-semibold text-black">{value}</div>
							{badge ? badge : null}
						</div>
					)}
				</>
			)}
			{icon && (
				<IconWrapper className={`${twMerge(iconColor)} text-3xl ml-auto`}>
					<span className="ml-2">{icon}</span>
				</IconWrapper>
			)}
		</div>
	);
}
