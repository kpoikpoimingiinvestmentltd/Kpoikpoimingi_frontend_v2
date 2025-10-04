import * as React from "react";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { IconWrapper } from "@/assets/icons";
import Image from "../base/Image";
import { media } from "../../resources/images";

type Action = {
	label: string;
	onClick?: () => void;
	variant?: "primary" | "ghost" | "outline" | "danger" | "destructive" | "success";
};

export default function ConfirmModal({
	open,
	onOpenChange,
	title,
	subtitle,
	icon,
	actions,
	imageSrc = media.images.alertImage,
	children,
	footerAlign = "right",
}: {
	open: boolean;
	onOpenChange: (o: boolean) => void;
	title?: React.ReactNode;
	subtitle?: React.ReactNode;
	icon?: React.ReactNode;
	imageSrc?: string;
	actions?: Action[];
	children?: React.ReactNode;
	footerAlign?: "left" | "center" | "right";
}) {
	const mapVariantClasses = (v?: Action["variant"]) => {
		const base =
			"inline-flex items-center py-2.5 px-6 justify-center gap-2 rounded-md text-sm font-medium transition-all disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-ring/50 focus-visible:ring-[3px]";
		switch (v) {
			case "ghost":
				return `${base} hover:bg-accent dark:hover:bg-accent/50`;
			case "outline":
				return `${base} border bg-background hover:bg-accent`;
			case "destructive":
			case "danger":
				return `${base} bg-destructive text-white hover:bg-destructive/90`;
			case "primary":
				return `${base} bg-primary text-primary-foreground hover:bg-primary/90`;
			case "success":
				return `${base} bg-emerald-600 text-white hover:bg-emerald-700`;
			default:
				return `${base} bg-primary text-primary-foreground hover:bg-primary/90`;
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					{icon ? (
						<div className="mx-auto mb-3 w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
							<IconWrapper className="text-2xl">{icon}</IconWrapper>
						</div>
					) : (
						<Image className="w-16 h-16 m-auto my-4 rounded-full bg-[#FFECEF] flex items-center justify-center" src={imageSrc} alt="Log out Image" />
					)}
					{title && <DialogTitle className="text-center">{title}</DialogTitle>}
				</DialogHeader>

				<div className="py-4 text-center text-sm text-muted-foreground">{subtitle}</div>

				{children}

				<DialogFooter
					className={cn(
						footerAlign === "center"
							? "justify-center sm:justify-center"
							: footerAlign === "left"
							? "justify-start sm:justify-start"
							: "justify-end sm:justify-end"
					)}>
					{actions?.map((act, i) => {
						const classes = mapVariantClasses(act.variant);
						return (
							<button
								key={i}
								type="button"
								className={cn(classes, i > 0 ? "ml-2" : undefined)}
								onClick={() => {
									act.onClick?.();
									onOpenChange(false);
								}}>
								{act.label}
							</button>
						);
					})}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
