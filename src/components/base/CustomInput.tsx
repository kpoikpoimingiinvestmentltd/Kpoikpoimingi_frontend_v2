import * as React from "react";
import { twMerge } from "tailwind-merge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconWrapper } from "../../assets/icons";

type CustomInputProps = React.ComponentProps<typeof Input> & {
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	floatingLeft?: React.ReactNode; // small circular floating icon on the left of the label area
	suffix?: React.ReactNode; // element displayed inside the input at the far right (like a button or icon)
	error?: string | boolean;
	containerClassName?: string;
};

export default function CustomInput({ iconLeft, iconRight, floatingLeft, suffix, error, className, containerClassName, ...props }: CustomInputProps) {
	const hasSuffix = Boolean(suffix);

	return (
		<div className={twMerge("relative", containerClassName)}>
			{floatingLeft && (
				<div className="absolute -top-3 left-3 bg-white rounded-full p-1 shadow-sm z-10">
					<IconWrapper className="text-sm">{floatingLeft}</IconWrapper>
				</div>
			)}

			<div className={"relative"}>
				{iconLeft && (
					<div className="absolute inset-y-0 left-0 opacity-50 pl-3 flex items-center pointer-events-none z-10">
						<IconWrapper className="text-base">{iconLeft}</IconWrapper>
					</div>
				)}

				<Input
					{...props}
					className={twMerge(
						cn(
							// if iconLeft present, add padding-left; if suffix present, add padding-right
							iconLeft ? "pl-10" : "pl-3",
							hasSuffix ? "pr-14" : "pr-3"
						),
						className
					)}
				/>

				{iconRight && (
					<div className="absolute inset-y-0 right-3 flex items-center z-10 pointer-events-none">
						<IconWrapper className="text-base">{iconRight}</IconWrapper>
					</div>
				)}

				{hasSuffix && <div className="absolute inset-y-0  opacity-50 right-3 flex items-center z-20 pointer-events-auto">{suffix}</div>}
			</div>

			{error && typeof error === "string" && <p className="text-xs text-destructive mt-1">{error}</p>}
		</div>
	);
}
