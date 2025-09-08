import React, { useState, useRef, useEffect } from "react";
import { Input } from "../ui/input";
import { twMerge } from "tailwind-merge";
import { inputStyle } from "@/components/common/commonStyles";

type CodeInputsProps = {
	defaultLength?: number;
	autoFocus?: boolean;
	onChange?: (code: string) => void;
	className?: string;
	inputClassName?: string;
};

export default function CodeInputs({ defaultLength = 6, autoFocus = false, onChange, className = "", inputClassName = "" }: CodeInputsProps) {
	const [code, setCode] = useState<string[]>(() => Array(defaultLength).fill(""));
	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

	useEffect(() => {
		if (autoFocus && inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	}, [autoFocus]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const value = e.target.value;
		if (/^\d?$/.test(value)) {
			const newCode = [...code];
			newCode[index] = value;
			setCode(newCode);
			onChange?.(newCode.join(""));

			if (value && index < defaultLength - 1) {
				inputRefs.current[index + 1]?.focus();
			}
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (e.key === "Backspace" && code[index] === "" && index > 0) {
			inputRefs.current[index - 1]?.focus();
		} else if (e.key === "ArrowLeft" && index > 0) {
			e.preventDefault();
			inputRefs.current[index - 1]?.focus();
		} else if (e.key === "ArrowRight" && index < code.length - 1) {
			e.preventDefault();
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
		e.preventDefault();
		const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, defaultLength);
		const newCode = pasted.split("");
		while (newCode.length < defaultLength) newCode.push("");
		setCode(newCode);
		onChange?.(newCode.join(""));
	};

	return (
		<div className={`${twMerge("flex gap-2 justify-center", className)}`} onPaste={handlePaste}>
			{code.map((value, index) => (
				<Input
					key={index}
					type="text"
					pattern="[0-9]*"
					inputMode="numeric"
					maxLength={1}
					value={value}
					ref={(el) => {
						inputRefs.current[index] = el;
					}}
					onChange={(e) => handleChange(e, index)}
					onKeyDown={(e) => handleKeyDown(e, index)}
					className={twMerge(
						inputStyle,
						inputClassName,
						"h-11 max-w-11 sm:h-12 sm:max-w-12 aspect-square border font-bold border-gray-300 rounded-md text-center focus:outline-none focus:border-stone-400"
					)}
				/>
			))}
		</div>
	);
}
