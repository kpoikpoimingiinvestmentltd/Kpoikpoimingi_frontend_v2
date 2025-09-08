import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CloseIcon, IconWrapper } from "../../../../assets/icons";

export default function ProfitSharingDetailsOffcanvas({
	open,
	onOpenChange,
	item,
}: {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	item?: {
		id: string;
		tier: string;
		platformShare: string;
		creatorShare: string;
		date: string;
		active: boolean;
	} | null;
}) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent hideCloseButton className="sm:min-w-xl w-full">
				<SheetHeader>
					<SheetTitle>Profit Sharing details</SheetTitle>
					<div className="absolute top-4 right-4">
						<button type="button" aria-label="Close" className="rounded-full bg-muted p-2" onClick={() => onOpenChange?.(false)}>
							<IconWrapper>
								<CloseIcon />
							</IconWrapper>
						</button>
					</div>
				</SheetHeader>

				<div className="px-4">
					{item ? (
						<div className="space-y-3 grid grid-cols-2 gap-4">
							<div>
								<div className="text-sm text-muted-foreground">Tier</div>
								<div className="font-medium">{item.tier}</div>
							</div>
							<div>
								<div className="text-sm text-muted-foreground">Platform share</div>
								<div className="font-medium">{item.platformShare}</div>
							</div>
							<div>
								<div className="text-sm text-muted-foreground">Creator share</div>
								<div className="font-medium">{item.creatorShare}</div>
							</div>
							<div>
								<div className="text-sm text-muted-foreground">Date</div>
								<div className="font-medium">{item.date}</div>
							</div>
							<div>
								<div className="text-sm text-muted-foreground">Status</div>
								<div className="font-medium">{item.active ? "Active" : "Inactive"}</div>
							</div>
						</div>
					) : (
						<div>No item selected.</div>
					)}
				</div>

				<div className="flex-1" />
				<SheetFooter>
					<SheetClose asChild>{/* <Button variant="outline">Close</Button> */}</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
