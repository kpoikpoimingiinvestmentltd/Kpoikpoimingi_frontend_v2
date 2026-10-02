import KeyValueRow from "@/components/common/KeyValueRow";
import ActionButton from "@/components/base/ActionButton";
import { Link } from "react-router";
import { _router } from "@/routes/_router";
import type { PurchaseRecord } from "@/api/purchase";

function money(value: string | number | null | undefined) {
	const n = Number(value || 0);
	return `₦${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function dateLabel(value?: string | null) {
	if (!value) return "—";
	return new Date(value).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

type Props = {
	purchase: PurchaseRecord | null | undefined;
	loading?: boolean;
	error?: boolean;
	errorMessage?: string;
	/** When true, show the controlled Edit Acquisition action */
	showEditAction?: boolean;
	onEditAcquisition?: () => void;
	/** When no purchase exists, show Add Acquisition */
	showAddAction?: boolean;
	onAddAcquisition?: () => void;
	/** Compact note under the summary (for edit property modal) */
	showManagementNote?: boolean;
	className?: string;
};

export default function AcquisitionInfoPanel({
	purchase,
	loading,
	error,
	errorMessage,
	showEditAction,
	onEditAcquisition,
	showAddAction,
	onAddAcquisition,
	showManagementNote,
	className,
}: Props) {
	if (loading) {
		return (
			<div className={className}>
				<h3 className="font-semibold text-base mb-4">Acquisition Information</h3>
				<p className="text-sm text-muted-foreground">Loading acquisition…</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className={className}>
				<h3 className="font-semibold text-base mb-2">Acquisition Information</h3>
				<p className="text-sm text-destructive">
					{errorMessage || "Could not load acquisition details. Check that the API includes the purchase module."}
				</p>
			</div>
		);
	}

	if (!purchase) {
		return (
			<div className={className}>
				<div className="flex items-start justify-between gap-3 mb-2">
					<div>
						<h3 className="font-semibold text-base">Acquisition Information</h3>
						<p className="text-sm text-muted-foreground mt-1">
							No acquisition has been recorded for this property yet.
						</p>
					</div>
					{showAddAction && onAddAcquisition ? (
						<ActionButton className="shrink-0 text-sm" onClick={onAddAcquisition}>
							Add Acquisition
						</ActionButton>
					) : null}
				</div>
			</div>
		);
	}

	const batch = purchase.batch;
	const isBatch = Boolean(batch?.id);

	return (
		<div className={className}>
			<div className="flex items-start justify-between gap-3 mb-4">
				<div>
					<h3 className="font-semibold text-base">Acquisition Information{showManagementNote ? " — Read Only" : ""}</h3>
					{showManagementNote ? (
						<p className="text-xs text-muted-foreground mt-1">
							Shown for visibility while editing listing details. Corrections use Edit Acquisition.
						</p>
					) : null}
				</div>
				{showEditAction && onEditAcquisition ? (
					<ActionButton variant="outline" className="shrink-0 text-sm" onClick={onEditAcquisition}>
						Edit Acquisition
					</ActionButton>
				) : null}
			</div>

			<div className="space-y-3">
				<KeyValueRow
					leftClassName="text-black"
					label="Purchase Type"
					value={isBatch ? "Batch purchase" : "Individual purchase"}
				/>
				<KeyValueRow leftClassName="text-black" label="Purchase Reference" value={String(purchase.reference || "—")} />
				{batch?.reference ? (
					<KeyValueRow
						leftClassName="text-black"
						label="Purchase Batch"
						value={
							<Link
								to={_router.dashboard.purchaseBatchDetails(batch.id)}
								className="text-primary underline underline-offset-2"
								onClick={(e) => e.stopPropagation()}>
								{batch.reference}
							</Link>
						}
					/>
				) : null}
				<KeyValueRow
					leftClassName="text-black"
					label="Supplier"
					value={String(purchase.supplier?.name || "—")}
				/>
				<KeyValueRow leftClassName="text-black" label="Purchase Date" value={dateLabel(purchase.purchaseDate)} />
				<KeyValueRow
					leftClassName="text-black"
					label="Purchase Price (per unit)"
					value={`${money(purchase.purchasePrice)} / unit`}
				/>
				<KeyValueRow leftClassName="text-black" label="Quantity" value={String(purchase.quantity ?? "—")} />
				{isBatch ? (
					<>
						<KeyValueRow
							leftClassName="text-black"
							label="Batch Transportation (shared)"
							value={money(batch?.transportationCost)}
						/>
						<KeyValueRow
							leftClassName="text-black"
							label="Batch Miscellaneous (shared)"
							value={money(batch?.miscellaneousCost)}
						/>
						<KeyValueRow
							leftClassName="text-black"
							label="Allocated Transportation"
							value={money(purchase.allocatedTransportation)}
						/>
						<KeyValueRow
							leftClassName="text-black"
							label="Allocated Miscellaneous"
							value={money(purchase.allocatedMiscellaneous)}
						/>
					</>
				) : (
					<>
						<KeyValueRow
							leftClassName="text-black"
							label="Transportation"
							value={money(purchase.allocatedTransportation)}
						/>
						<KeyValueRow
							leftClassName="text-black"
							label="Miscellaneous"
							value={money(purchase.allocatedMiscellaneous)}
						/>
					</>
				)}
				<KeyValueRow
					leftClassName="text-black"
					label="Total Acquisition Cost"
					value={money(purchase.totalAcquisitionCost)}
				/>
			</div>

			{showManagementNote ? (
				<p className="text-xs text-muted-foreground mt-4 border-t pt-3">
					Acquisition costs are managed through the purchase record. Batch costs may affect other properties in the
					same batch.
				</p>
			) : null}
		</div>
	);
}
