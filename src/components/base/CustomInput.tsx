import * as React from "react";
import { twMerge } from "tailwind-merge";
import { Input } from "@/components/ui/input";
import { IconWrapper } from "../../assets/icons";
import { inputStyle } from "../common/commonStyles";

type CustomInputProps = React.ComponentProps<typeof Input> & {
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	floatingLeft?: React.ReactNode; // small circular floating icon on the left of the label area
	suffix?: React.ReactNode; // element displayed inside the input at the far right (like a button or icon)
	error?: string | boolean;
	required?: boolean;
	containerClassName?: string;
	label?: React.ReactNode;
	labelClassName?: string;
	onSearch?: (v: string) => void;
	debounceMs?: number;
	showClear?: boolean;
};

export default function CustomInput({
	iconLeft,
	iconRight,
	floatingLeft,
	suffix,
	error,
	className,
	containerClassName,
	label,
	required,
	labelClassName,
	...props
}: CustomInputProps) {
	// expose a couple extra props via props (onSearch, debounceMs, showClear)
	const propsTyped = props as CustomInputProps & {
		onSearch?: (v: string) => void;
		debounceMs?: number;
		showClear?: boolean;
	};
	const { onSearch, debounceMs = 300, showClear = false } = propsTyped;

	const [internal, setInternal] = React.useState<string>((props.value as string) ?? "");

	React.useEffect(() => {
		const v = props.value as string | number | undefined;
		// If no explicit value is provided (undefined), don't override internal state
		if (typeof v === "undefined") return;
		const normalized = v == null ? "" : String(v);
		setInternal(normalized);
	}, [props.value]);

	React.useEffect(() => {
		let mounted = true;
		const id = setTimeout(() => {
			if (mounted && typeof onSearch === "function") onSearch(internal);
		}, debounceMs);
		return () => {
			mounted = false;
			clearTimeout(id);
		};
	}, [internal, onSearch, debounceMs]);
	const hasSuffix = Boolean(suffix);

	return (
		<div className={twMerge("relative flex flex-col", containerClassName)}>
			{label && (
				<label className={twMerge("text-sm block mb-1.5 text-balance", labelClassName)}>
					{label}
					{required && <sup>*</sup>}
				</label>
			)}
			{floatingLeft && (
				<div className="absolute -top-3 left-3 bg-white rounded-full p-1 shadow-sm z-10">
					<IconWrapper className="text-sm">{floatingLeft}</IconWrapper>
				</div>
			)}

			<div className={"relative isolate mt-auto"}>
				{iconLeft && (
					<div className="absolute inset-y-0 left-0 opacity-50 pl-3 flex items-center pointer-events-none z-10">
						<IconWrapper className="text-base">{iconLeft}</IconWrapper>
					</div>
				)}

				<Input
					{...props}
					value={internal}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setInternal(e.target.value);
						if (typeof props.onChange === "function") props.onChange(e);
					}}
					className={twMerge(inputStyle, iconLeft ? "pl-10" : "pl-3", hasSuffix || iconRight ? "pr-12" : "pr-3", "truncate", className)}
				/>

				{iconRight && (
					<div className="absolute inset-y-0 right-3 flex items-center z-10 pointer-events-none">
						<IconWrapper className="text-lg">{iconRight}</IconWrapper>
					</div>
				)}

				{hasSuffix && <div className="absolute inset-y-0  opacity-50 right-3 flex items-center z-20 pointer-events-auto">{suffix}</div>}

				{showClear && internal && (
					<button
						type="button"
						aria-label="Clear search"
						onClick={() => {
							setInternal("");
							if (typeof onSearch === "function") onSearch("");
						}}
						className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
						×
					</button>
				)}
			</div>

			{error && typeof error === "string" && <p className="text-xs text-destructive mt-1">{error}</p>}
		</div>
	);
}
