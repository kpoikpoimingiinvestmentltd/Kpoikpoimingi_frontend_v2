import * as React from "react";
import { IconWrapper } from "@/assets/icons";
import { Button } from "@/components/ui/button";

type Props = {
	label: React.ReactNode;
	value: React.ReactNode;
	className?: string;
	copyable?: boolean;
	leftClassName?: string;
	rightClassName?: string;
	leftProps?: React.HTMLAttributes<HTMLDivElement>;
	rightProps?: React.HTMLAttributes<HTMLDivElement>;
};

export default function KeyValueRow({ label, value, className = "", copyable = false, leftClassName, rightClassName, leftProps, rightProps }: Props) {
	const handleCopy = async () => {
		try {
			if (typeof value === "string") await navigator.clipboard.writeText(value);
		} catch (e) {
			/* ignore */
		}
	};

	return (
		<div className={`flex items-start justify-between py-2 ${className}`}>
			<p {...(leftProps || {})} className={`text-muted-foreground text-sm sm:text-base ${leftClassName || ""}`}>
				{label}
			</p>
			<div {...(rightProps || {})} className={`flex items-center gap-3 ${rightClassName || ""}`}>
				<div className="text-sm sm:text-base text-balance text-right">{value}</div>
				{copyable ? (
					<Button variant="ghost" size="sm" onClick={handleCopy}>
						<IconWrapper>📋</IconWrapper>
					</Button>
				) : null}
			</div>
		</div>
	);
}
