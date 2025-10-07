import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { IconWrapper, CheckIcon } from "@/assets/icons";
import React from "react";
import { twMerge } from "tailwind-merge";
import { modalContentStyle } from "./commonStyles";

export default function SuccessModal({
	open,
	onOpenChange,
	title,
	subtitle,
	message,
	buttonLabel = "Ok",
	titleBeforeIcon = false,
	icon,
	primaryAction,
	fields,
	actions,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	title?: string;
	subtitle?: string;
	message?: React.ReactNode;
	buttonLabel?: string;
	titleBeforeIcon?: boolean;
	icon?: React.ReactNode;
	primaryAction?: () => void;
	fields?: Array<{
		label?: string;
		value?: React.ReactNode;
		variant?: "inline" | "block";
	}>;
	actions?: Array<{
		label: string;
		onClick?: () => void;
		variant?: "primary" | "outline";
		fullWidth?: boolean;
	}>;
}) {
	const handlePrimary = () => {
		if (primaryAction) primaryAction();
		onOpenChange(false);
	};

	const renderedIcon = icon ?? <CheckIcon />;

	const FieldRow = ({ label, value, variant = "inline" }: { label?: string; value?: React.ReactNode; variant?: "inline" | "block" }) => {
		if (!value && !label) return null;
		if (variant === "inline") {
			return (
				<div className="text-center">
					{label && <span className="text-muted-foreground mr-1">{label}</span>}
					{value && <span className="font-medium text-primary">{value}</span>}
				</div>
			);
		}

		return (
			<div className="w-full">
				{label && <div className="text-sm font-medium text-muted-foreground mb-1">{label}</div>}
				{value && <p className="break-words text-wrap text-base text-muted-foreground">{value}</p>}
			</div>
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle()}>
				<div className="flex flex-col items-center gap-4 py-6 px-4">
					{titleBeforeIcon && title && <div className="text-lg font-semibold text-center">{title}</div>}

					<IconWrapper className="text-5xl text-[#4caf50]">{renderedIcon}</IconWrapper>

					{!titleBeforeIcon && title && (
						<DialogHeader className="mt-2">
							<DialogTitle className="text-center">{title}</DialogTitle>
						</DialogHeader>
					)}

					{subtitle && <p className="text-muted-foreground text-center">{subtitle}</p>}

					{/* fields: flexible labeled values (inline or block) */}
					{fields && fields.length > 0 && (
						<div className="w-full mt-2 flex flex-col items-center gap-2">
							{fields.map((f, i) => (
								<div key={i} className={twMerge(f.variant === "block" ? "w-full px-2" : "w-full")}>
									<FieldRow label={f.label} value={f.value} variant={f.variant} />
								</div>
							))}
						</div>
					)}

					{message && <div className="text-base text-center mt-2">{message}</div>}

					<DialogFooter className="mt-2 w-full">
						{/* If actions provided, render them; otherwise fall back to single primary button */}
						{actions && actions.length > 0 ? (
							<div className="w-full flex gap-3 items-center">
								{(actions as NonNullable<typeof actions>).map((a: NonNullable<typeof actions>[0], i: number) => {
									const isPrimary = a.variant === "primary" || (!a.variant && i === 0);
									const btnBase = a.fullWidth ? "px-16 py-5 mx-auto" : "px-10";
									const merged = twMerge(
										"py-3 rounded-md active-scale",
										btnBase,
										isPrimary ? "bg-primary text-white" : "border-2 bg-card border-primary"
									);
									return (
										<button
											key={i}
											onClick={() => {
												if (a.onClick) a.onClick();
												if (isPrimary) onOpenChange(false);
											}}
											className={merged}>
											{a.label}
										</button>
									);
								})}
							</div>
						) : (
							<button onClick={handlePrimary} className="w-max  mx-auto px-16 !py-5 bg-primary text-white">
								{buttonLabel}
							</button>
						)}
					</DialogFooter>
				</div>
			</DialogContent>
		</Dialog>
	);
}
