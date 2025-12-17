import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import ActionButton from "@/components/base/ActionButton";

interface ExportConfirmModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	searchTerm?: string;
	filterLabels?: Record<string, string>; // e.g., { "statusId": "Active" }
	onExportFiltered: () => void;
	onExportAll: () => void;
	isLoading?: boolean;
}

export default function ExportConfirmModal({
	open,
	onOpenChange,
	searchTerm,
	filterLabels,
	onExportFiltered,
	onExportAll,
	isLoading = false,
}: ExportConfirmModalProps) {
	const hasFilters = Boolean(searchTerm || (filterLabels && Object.keys(filterLabels).length > 0));

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Export CSV</DialogTitle>
				</DialogHeader>

				<div className="py-4 space-y-3">
					<p className="text-sm text-gray-600">You have active filters applied. What would you like to export?</p>

					{hasFilters && (
						<div className="bg-gray-50 p-3 rounded-md space-y-2">
							{searchTerm && (
								<p className="text-sm">
									<span className="text-gray-600">Search: </span>
									<span className="text-primary font-semibold">"{searchTerm}"</span>
								</p>
							)}
							{filterLabels && Object.keys(filterLabels).length > 0 && (
								<div className="space-y-1">
									{Object.entries(filterLabels).map(([key, value]) => (
										<p key={key} className="text-sm">
											<span className="text-gray-600">{key}: </span>
											<span className="text-primary font-semibold">{value}</span>
										</p>
									))}
								</div>
							)}
						</div>
					)}
				</div>

				<DialogFooter className="gap-3">
					<ActionButton
						type="button"
						variant="outline"
						onClick={() => {
							onExportAll();
							onOpenChange(false);
						}}
						disabled={isLoading}>
						Export All
					</ActionButton>
					<ActionButton
						type="button"
						variant="primary"
						onClick={() => {
							onExportFiltered();
							onOpenChange(false);
						}}
						disabled={isLoading}>
						{isLoading ? "Exporting..." : "Export Filtered"}
					</ActionButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
