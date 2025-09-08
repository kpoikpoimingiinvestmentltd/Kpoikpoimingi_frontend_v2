import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { _router } from "@/routes/_router";
import { twMerge } from "tailwind-merge";

interface OffcanvasQuickViewProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: React.ReactNode;
	side?: "right" | "left";
	hideCloseButton?: boolean;
	footer?: React.ReactNode;
	user?: any | null;
	className?: string;
}

export default function OffcanvasQuickView({
	open,
	onOpenChange,
	title,
	side = "right",
	hideCloseButton = false,
	user,
	className,
}: OffcanvasQuickViewProps) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side={side}
				hideCloseButton={hideCloseButton}
				className={twMerge(className, "h-[96dvh] rounded-lg my-auto right-3 border md:min-w-md")}>
				<SheetHeader>
					<SheetTitle>{title}</SheetTitle>
				</SheetHeader>

				<div className="px-4 py-3 overflow-auto">
					{user ? (
						<div className="space-y-4">
							<div className="flex items-center gap-4">
								<div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-neutral-800 flex items-center justify-center text-xl font-semibold">
									{`${(user.username ?? user.firstName ?? "").charAt(0) ?? ""}`}
								</div>
								<div>
									<div className="text-sm text-muted-foreground">{user.username ?? `${user.firstName ?? ""} ${user.lastName ?? ""}`}</div>
									<div className="font-medium text-sm">{user.email ?? ""}</div>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<div className="flex flex-col">
									<div className="text-xs text-muted-foreground">First name</div>
									<div className="text-sm font-medium">{user.firstName ?? "N/A"}</div>
								</div>

								<div className="flex flex-col">
									<div className="text-xs text-muted-foreground">Last name</div>
									<div className="text-sm font-medium">{user.lastName ?? "N/A"}</div>
								</div>

								<div className="flex flex-col">
									<div className="text-xs text-muted-foreground">Email</div>
									<div className="text-sm font-medium">{user.email ?? "N/A"}</div>
								</div>

								<div className="flex flex-col">
									<div className="text-xs text-muted-foreground">Date joined</div>
									<div className="text-sm font-medium">{user.dateJoined ?? "N/A"}</div>
								</div>

								<div className="flex flex-col">
									<div className="text-xs text-muted-foreground">Subscriptions</div>
									<div className="text-sm font-medium">{user.subscriptions ?? 0}</div>
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-2">
							<div className="text-sm text-muted-foreground">User</div>
							<div className="font-medium">—</div>
						</div>
					)}
				</div>

				<SheetFooter>
					<div className="w-full flex justify-end gap-2">
						<Button variant="ghost" onClick={() => onOpenChange(false)}>
							Close
						</Button>
						{user ? (
							<Link to={_router.dashboard.userDetails.replace(":id", user.id)}>
								<Button>View details</Button>
							</Link>
						) : (
							<Button disabled>View details</Button>
						)}
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
