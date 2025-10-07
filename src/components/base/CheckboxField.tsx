import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { checkboxStyle, labelStyle } from "../common/commonStyles";
import { twMerge } from "tailwind-merge";

type Props = {
	id: string;
	label?: React.ReactNode;
	wrapperClassName?: string;
	checkboxClassName?: string;
	labelClassName?: string;
	checked?: boolean;
	defaultChecked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	disabled?: boolean;
	labelPosition?: "right" | "left";
};

export default function CheckboxField({
	id,
	label,
	wrapperClassName,
	checkboxClassName,
	labelClassName,
	checked,
	defaultChecked,
	onCheckedChange,
	disabled,
	labelPosition = "right",
}: Props) {
	return (
		<div className={twMerge(wrapperClassName)}>
			{labelPosition === "left" && label && (
				<Label htmlFor={id} className={labelStyle(twMerge("mb-0 cursor-pointer", labelClassName))}>
					{label}
				</Label>
			)}

			<div className="flex items-center gap-2">
				<Checkbox
					id={id}
					className={twMerge(checkboxStyle, checkboxClassName)}
					checked={checked}
					defaultChecked={defaultChecked}
					onCheckedChange={(v: any) => onCheckedChange?.(!!v)}
					disabled={disabled}
				/>

				{labelPosition === "right" && label && (
					<Label htmlFor={id} className={labelStyle(twMerge("mb-0 cursor-pointer", labelClassName))}>
						{label}
					</Label>
				)}
			</div>
		</div>
	);
}
