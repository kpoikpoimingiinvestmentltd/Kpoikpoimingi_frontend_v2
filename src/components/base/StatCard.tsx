import React, { useState, useEffect } from "react";
import { ChevronDownIcon, IconWrapper } from "../../assets/icons";
import { Skeleton } from "../ui/skeleton";
import { twMerge } from "tailwind-merge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";

interface StatCardProps {
	title: string;
	value: string | number;
	icon?: React.ReactNode;
	className?: string;
	loading?: boolean;
	iconColor?: string;
	badge?: React.ReactNode;
	variant?: "default" | "income";
	currency?: string;
	footer?: React.ReactNode;
	period?: string;
	onPeriodChange?: (period: string) => void;
}

export default function StatCard({
	title,
	value,
	icon,
	loading,
	badge,
	iconColor = "",
	className = "",
	variant = "default",
	currency = "₦",
	footer,
	period: externalPeriod,
	onPeriodChange,
}: StatCardProps) {
	// Hooks must be at top level
	const periods = ["Daily", "Weekly", "Monthly", "Yearly"];
	const [period, setPeriod] = useState<string>(externalPeriod || "Monthly");

	useEffect(() => {
		if (externalPeriod) {
			setPeriod(externalPeriod.charAt(0).toUpperCase() + externalPeriod.slice(1));
		}
	}, [externalPeriod]);

	const handlePeriodChange = (newPeriod: string) => {
		setPeriod(newPeriod);
		onPeriodChange?.(newPeriod.toLowerCase());
	};

	// Income stat variant component
	function IncomeStat() {
		return (
			<>
				<div className="mt-2">
					<div className="flex items-center text-black">
						<sub className="mr-1 text-sm font-normal text-stone-500">{currency}</sub>
						<h1 className="text-2xl dark:text-gray-200 font-semibold">{value}</h1>
					</div>
					{badge ? badge : null}
				</div>

				<div className="mt-4">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-primary">
								<span>{period}</span>
								<IconWrapper>
									<ChevronDownIcon />
								</IconWrapper>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-40">
							{periods.map((p) => (
								<DropdownMenuItem key={p} onSelect={() => handlePeriodChange(p)}>
									{p}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</>
		);
	}

	return (
		<div
			className={`bg-white w-full dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-lg p-4 flex flex-col justify-between min-w-[180px] min-h-32 ${className}`}>
			<div className="flex items-center justify-between">
				<h3 className="text-gray-500 dark:text-gray-300 text-[.95rem] mb-1">{title}</h3>
			</div>
			{loading ? (
				<Skeleton className="w-full bg-gray-100 dark:bg-gray-100/20 h-7 rounded-xs" />
			) : (
				<>
					{variant === "income"
						? IncomeStat()
						: value && (
								<div className={`flex items-center gap-2 mt-2`}>
									<div className="text-2xl dark:text-gray-100 font-semibold text-black">{value}</div>
									{badge ? badge : null}
								</div>
							)}
				</>
			)}
			{footer || icon ? (
				<div className="mt-4 flex items-center">
					{footer ? footer : null}

					{icon && (
						<IconWrapper className={`${twMerge(iconColor)} text-3xl ml-auto`}>
							<span className="ml-2">{icon}</span>
						</IconWrapper>
					)}
				</div>
			) : null}
		</div>
	);
}
