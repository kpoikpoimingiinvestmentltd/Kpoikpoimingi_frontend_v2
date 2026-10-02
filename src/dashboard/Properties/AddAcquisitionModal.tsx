import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ActionButton from "@/components/base/ActionButton";
import { modalContentStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { useAttachAcquisition } from "@/api/purchase";
import AcquisitionSection, {
	defaultAcquisitionState,
	type AcquisitionFormState,
} from "./AcquisitionSection";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	propertyId: string;
	quantityTotal: number;
	currentListingPrice?: string | number;
	onAttached?: () => void;
};

function formatPriceDisplay(v: string | number) {
	const n = Number(String(v).replace(/,/g, ""));
	if (!Number.isFinite(n)) return "";
	return n.toLocaleString();
}

function parsePriceValue(v: string) {
	return String(v).replace(/,/g, "").trim();
}

export default function AddAcquisitionModal({
	open,
	onOpenChange,
	propertyId,
	quantityTotal,
	currentListingPrice,
	onAttached,
}: Props) {
	const [acquisition, setAcquisition] = React.useState<AcquisitionFormState>(() =>
		defaultAcquisitionState(),
	);

	React.useEffect(() => {
		if (!open) return;
		const next = defaultAcquisitionState();
		if (currentListingPrice != null && currentListingPrice !== "") {
			next.sellingPrice = String(currentListingPrice);
		}
		setAcquisition(next);
	}, [open, currentListingPrice]);

	const attach = useAttachAcquisition(
		() => {
			toast.success("Acquisition added to property");
			onOpenChange(false);
			onAttached?.();
		},
		(err: unknown) => {
			const msg =
				(err as { message?: string })?.message ||
				(err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
				"Failed to add acquisition";
			toast.error(String(msg));
		},
	);

	const handleSave = async () => {
		if (!acquisition.mode || acquisition.mode === "new_batch") {
			toast.error("Choose individual purchase or an existing batch");
			return;
		}
		if (!acquisition.purchasePrice) {
			toast.error("Purchase price is required");
			return;
		}

		const pricingPayload =
			acquisition.pricingMethod === "COST_PLUS_MARKUP"
				? {
						pricingMethod: "COST_PLUS_MARKUP" as const,
						markupPercentage: acquisition.markupPercentage || "0",
					}
				: acquisition.sellingPrice || acquisition.sellingPrice === "0"
					? {
							pricingMethod: "MANUAL" as const,
							price: acquisition.sellingPrice,
						}
					: {};

		if (acquisition.mode === "individual") {
			if (!acquisition.supplierId) {
				toast.error("Supplier is required");
				return;
			}
			await attach.mutateAsync({
				propertyId,
				payload: {
					mode: "individual",
					purchasePrice: acquisition.purchasePrice,
					supplierId: acquisition.supplierId,
					purchaseDate: acquisition.purchaseDate
						? new Date(acquisition.purchaseDate).toISOString()
						: new Date().toISOString(),
					transportation: acquisition.transportation || "0",
					miscellaneous: acquisition.miscellaneous || "0",
					notes: acquisition.notes || undefined,
					...pricingPayload,
				},
			});
			return;
		}

		if (!acquisition.batchId) {
			toast.error("Select an existing batch");
			return;
		}
		await attach.mutateAsync({
			propertyId,
			payload: {
				mode: "existing_batch",
				purchasePrice: acquisition.purchasePrice,
				batchId: acquisition.batchId,
				notes: acquisition.notes || undefined,
				...(acquisition.manualAllocations.length
					? {
							manualAllocations: acquisition.manualAllocations.map((row) => ({
								purchaseId: row.purchaseId,
								isNew: row.isNew,
								allocatedTransportation: row.allocatedTransportation || "0",
								allocatedMiscellaneous: row.allocatedMiscellaneous || "0",
							})),
						}
					: {}),
				...pricingPayload,
			},
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={twMerge(modalContentStyle(), "max-w-2xl max-h-[90vh] overflow-y-auto")}>
				<DialogHeader>
					<DialogTitle>Add Acquisition</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-muted-foreground -mt-2">
					Record how this existing property was bought. Quantity stays at {quantityTotal} unit
					{quantityTotal === 1 ? "" : "s"}.
				</p>
				<div className="-mt-4">
					<AcquisitionSection
						value={acquisition}
						onChange={setAcquisition}
						formatPriceDisplay={formatPriceDisplay}
						parsePriceValue={parsePriceValue}
						quantityTotal={quantityTotal}
						allowedModes={["individual", "existing_batch"]}
						title="How was it bought?"
						description="Attach an individual purchase or add this property into an existing batch."
					/>
				</div>
				<div className="flex justify-end gap-2 pt-4 border-t">
					<ActionButton variant="outline" onClick={() => onOpenChange(false)} disabled={attach.isPending}>
						Cancel
					</ActionButton>
					<ActionButton onClick={handleSave} isLoading={attach.isPending}>
						Save Acquisition
					</ActionButton>
				</div>
			</DialogContent>
		</Dialog>
	);
}
