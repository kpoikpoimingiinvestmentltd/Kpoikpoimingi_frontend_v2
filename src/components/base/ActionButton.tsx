import React from "react";
import { twMerge } from "tailwind-merge";
import { IconWrapper, SpinnerIcon } from "../../assets/icons";

type Variant = "primary" | "outline" | "danger" | "success" | "ghost";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	isLoading?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	fullWidth?: boolean;
	variant?: Variant;
};

export default function ActionButton({
	isLoading,
	leftIcon,
	rightIcon,
	fullWidth,
	children,
	className,
	disabled,
	variant = "primary",
	...rest
}: Props) {
	const variantClass = (() => {
		switch (variant) {
			case "outline":
				return "bg-transparent border border-primary text-primary bg-gray-50";
			case "danger":
				return "bg-red-600 text-white hover:bg-red-700";
			case "success":
				return "bg-emerald-600 text-white hover:bg-emerald-700";
			case "ghost":
				return "bg-transparent text-black font-normal";
			case "primary":
			default:
				return "bg-primary text-white hover:bg-primary";
		}
	})();

	const base =
		"flex items-center justify-center py-2.5 rounded-md active-scale text-white px-4 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:scale-100 disabled:hover:opacity-50 disabled:cursor-not-allowed";

	const classes = twMerge(base, variantClass, fullWidth ? "w-full" : "", className ?? "");

	return (
		<button className={classes} disabled={disabled || isLoading} {...rest}>
			{isLoading ? (
				<IconWrapper>
					<SpinnerIcon />
				</IconWrapper>
			) : (
				leftIcon
			)}
			{children}
			{rightIcon}
		</button>
	);
}
