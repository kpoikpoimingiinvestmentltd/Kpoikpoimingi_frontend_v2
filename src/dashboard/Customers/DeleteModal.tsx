import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomCard from "@/components/base/CustomCard";

export default function DeleteModal({
	open,
	onOpenChange,
	title = "Delete",
	description = "Are you sure you want to delete this item?",
	onConfirm,
}: {
	open: boolean;
	onOpenChange: (o: boolean) => void;
	title?: string;
	description?: string;
	onConfirm?: () => void;
}) {
	const handleConfirm = () => {
		if (onConfirm) onConfirm();
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader />

				<CustomCard className="border-0 p-6 flex flex-col items-center gap-6 text-center">
					<DialogTitle className="text-lg">{title}</DialogTitle>

					<p className="text-sm text-muted-foreground">{description}</p>

					<div className="flex items-center gap-4 mt-2">
						<Button className="bg-red-600 border-0 px-6 py-2.5 hover:bg-red-500" onClick={handleConfirm}>
							Yes, Delete this
						</Button>
						<Button variant="outline" className="border-primary bg-stone-100 px-6 text-primary" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
					</div>
				</CustomCard>
			</DialogContent>
		</Dialog>
	);
}
