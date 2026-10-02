import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CustomInput from "@/components/base/CustomInput";
import ActionButton from "@/components/base/ActionButton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { inputStyle, labelStyle, modalContentStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import {
	useGetSuppliers,
	usePreviewBatchUpdate,
	useUpdateBatchPurchase,
	useUpdateIndividualPurchase,
	type BatchPreviewResponse,
	type PurchaseRecord,
	type Supplier,
	type UpdateBatchPurchasePayload,
} from "@/api/purchase";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

function formatMoney(value: string | number) {
	return `₦${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function toDateInput(value?: string) {
	if (!value) return "";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "";
	return d.toISOString().slice(0, 10);
}

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	purchase: PurchaseRecord | null | undefined;
};

export default function EditAcquisitionModal({ open, onOpenChange, purchase }: Props) {
	const isBatch = Boolean(purchase?.batch?.id);
	const { data: suppliersData } = useGetSuppliers(1, 100);
	const suppliers = ((suppliersData as { data?: Supplier[] })?.data || []) as Supplier[];

	const [supplierId, setSupplierId] = React.useState("");
	const [purchaseDate, setPurchaseDate] = React.useState("");
	const [purchasePrice, setPurchasePrice] = React.useState("");
	const [quantity, setQuantity] = React.useState("");
	const [transportation, setTransportation] = React.useState("");
	const [miscellaneous, setMiscellaneous] = React.useState("");
	const [notes, setNotes] = React.useState("");
	const [preview, setPreview] = React.useState<BatchPreviewResponse | null>(null);
	const [step, setStep] = React.useState<"edit" | "review">("edit");

	React.useEffect(() => {
		if (!open || !purchase) return;
		setSupplierId(purchase.supplier?.id || "");
		setPurchaseDate(toDateInput(purchase.purchaseDate));
		setPurchasePrice(String(purchase.purchasePrice ?? ""));
		setQuantity(String(purchase.quantity ?? ""));
		setNotes(purchase.notes || "");
		if (purchase.batch?.id) {
			setTransportation(String(purchase.batch.transportationCost ?? ""));
			setMiscellaneous(String(purchase.batch.miscellaneousCost ?? ""));
		} else {
			setTransportation(String(purchase.allocatedTransportation ?? ""));
			setMiscellaneous(String(purchase.allocatedMiscellaneous ?? ""));
		}
		setPreview(null);
		setStep("edit");
	}, [open, purchase]);

	const updateIndividual = useUpdateIndividualPurchase(
		() => {
			toast.success("Acquisition updated");
			onOpenChange(false);
		},
		(err: unknown) => {
			const msg =
				(err as { message?: string })?.message ||
				(err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
				"Failed to update acquisition";
			toast.error(String(msg));
		},
	);

	const previewBatch = usePreviewBatchUpdate();
	const updateBatch = useUpdateBatchPurchase(
		() => {
			toast.success("Batch acquisition updated");
			onOpenChange(false);
		},
		(err: unknown) => {
			const msg =
				(err as { message?: string })?.message ||
				(err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
				"Failed to update batch acquisition";
			toast.error(String(msg));
		},
	);

	const buildBatchPayload = (): UpdateBatchPurchasePayload => ({
		supplierId: supplierId || undefined,
		purchaseDate: purchaseDate || undefined,
		transportationCost: transportation || "0",
		miscellaneousCost: miscellaneous || "0",
		notes: notes || undefined,
		lines: purchase
			? [
					{
						purchaseId: purchase.id,
						purchasePrice: purchasePrice || undefined,
						quantity: quantity ? Number(quantity) : undefined,
					},
				]
			: undefined,
	});

	const handleSaveIndividual = () => {
		if (!purchase?.id) return;
		if (!supplierId) {
			toast.error("Supplier is required");
			return;
		}
		if (!purchasePrice || Number(purchasePrice) < 0) {
			toast.error("Purchase price is required");
			return;
		}
		if (!quantity || Number(quantity) < 1) {
			toast.error("Quantity must be at least 1");
			return;
		}
		updateIndividual.mutate({
			id: purchase.id,
			payload: {
				supplierId,
				purchaseDate,
				purchasePrice,
				quantity: Number(quantity),
				transportation: transportation || "0",
				miscellaneous: miscellaneous || "0",
				notes: notes || undefined,
			},
		});
	};

	const handleReviewBatch = async () => {
		if (!purchase?.batch?.id) return;
		try {
			const data = (await previewBatch.mutateAsync({
				batchId: purchase.batch.id,
				payload: buildBatchPayload(),
			})) as BatchPreviewResponse;
			setPreview(data);
			setStep("review");
		} catch (err: unknown) {
			const msg =
				(err as { message?: string })?.message ||
				(err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
				"Failed to preview batch changes";
			toast.error(String(msg));
		}
	};

	const handleConfirmBatch = () => {
		if (!purchase?.batch?.id) return;
		updateBatch.mutate({
			batchId: purchase.batch.id,
			payload: buildBatchPayload(),
		});
	};

	const busy =
		updateIndividual.isPending || previewBatch.isPending || updateBatch.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle("md:max-w-3xl max-h-[90vh] overflow-y-auto")}>
				<DialogHeader className="justify-center flex-row my-4">
					<DialogTitle className="font-medium">
						{step === "review" ? "Review Acquisition Changes" : "Edit Acquisition"}
					</DialogTitle>
				</DialogHeader>

				{!purchase ? (
					<p className="text-sm text-muted-foreground text-center pb-6">No purchase record for this property.</p>
				) : step === "review" && preview ? (
					<div className="mx-auto w-full md:max-w-2xl pb-4 space-y-4">
						<p className="text-sm text-muted-foreground">{preview.warning}</p>
						<div className="text-sm space-y-1">
							<p>
								<span className="text-muted-foreground">Batch: </span>
								{preview.reference}
							</p>
							<p>
								<span className="text-muted-foreground">Shared transportation: </span>
								{formatMoney(preview.nextBatch.transportationCost)}
							</p>
							<p>
								<span className="text-muted-foreground">Shared miscellaneous: </span>
								{formatMoney(preview.nextBatch.miscellaneousCost)}
							</p>
						</div>

						<div className="border rounded-md overflow-hidden">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Property</TableHead>
										<TableHead>Previous AC</TableHead>
										<TableHead>New AC</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{preview.lines.map((line) => (
										<TableRow key={line.purchaseId}>
											<TableCell>
												<div className="font-medium">{line.propertyName || line.propertyCode || line.reference}</div>
												<div className="text-xs text-muted-foreground">{line.reference}</div>
											</TableCell>
											<TableCell>{formatMoney(line.previous.totalAcquisitionCost)}</TableCell>
											<TableCell className="font-medium">{formatMoney(line.next.totalAcquisitionCost)}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						<footer className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
							<ActionButton variant="outline" onClick={() => setStep("edit")} disabled={busy}>
								Back
							</ActionButton>
							<ActionButton variant="primary" onClick={handleConfirmBatch} disabled={busy}>
								{updateBatch.isPending ? "Saving…" : "Confirm Changes"}
							</ActionButton>
						</footer>
					</div>
				) : (
					<div className="mx-auto w-full md:max-w-2xl pb-4 space-y-4">
						{isBatch ? (
							<p className="text-sm text-muted-foreground">
								This property is part of batch <strong>{purchase.batch?.reference}</strong>. Changing shared
								fees will update acquisition costs for every property in the batch.
							</p>
						) : (
							<p className="text-sm text-muted-foreground">
								Correct the individual purchase details. Total acquisition cost updates automatically.
							</p>
						)}

						<div>
							<label className={labelStyle()}>Supplier*</label>
							<Select value={supplierId} onValueChange={setSupplierId}>
								<SelectTrigger className={twMerge(inputStyle)}>
									<SelectValue placeholder="Select supplier" />
								</SelectTrigger>
								<SelectContent>
									{suppliers.map((s) => (
										<SelectItem key={s.id} value={s.id}>
											{s.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<CustomInput
								required
								label="Purchase Date"
								type="date"
								value={purchaseDate}
								onChange={(e) => setPurchaseDate(e.target.value)}
								className={twMerge(inputStyle)}
							/>
							{!isBatch ? (
								<CustomInput
									required
									label="Quantity"
									type="number"
									value={quantity}
									onChange={(e) => setQuantity(e.target.value)}
									className={twMerge(inputStyle)}
								/>
							) : (
								<CustomInput
									required
									label="This Property Quantity"
									type="number"
									value={quantity}
									onChange={(e) => setQuantity(e.target.value)}
									className={twMerge(inputStyle)}
								/>
							)}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<CustomInput
								required
								label="Purchase Price (per unit)"
								value={purchasePrice}
								onChange={(e) => setPurchasePrice(e.target.value.replace(/[^\d.]/g, ""))}
								className={twMerge(inputStyle)}
							/>
							{isBatch ? (
								<div className="text-sm text-muted-foreground self-end pb-2">
									Line reference: {purchase.reference}
								</div>
							) : null}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<CustomInput
								required
								label={isBatch ? "Batch Transportation (shared)" : "Transportation"}
								value={transportation}
								onChange={(e) => setTransportation(e.target.value.replace(/[^\d.]/g, ""))}
								className={twMerge(inputStyle)}
							/>
							<CustomInput
								required
								label={isBatch ? "Batch Miscellaneous (shared)" : "Miscellaneous"}
								value={miscellaneous}
								onChange={(e) => setMiscellaneous(e.target.value.replace(/[^\d.]/g, ""))}
								className={twMerge(inputStyle)}
							/>
						</div>

						<div>
							<label className={labelStyle()}>Notes</label>
							<textarea
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								className={twMerge(inputStyle, "h-auto min-h-20 w-full")}
								rows={3}
							/>
						</div>

						<footer className="pt-2">
							{isBatch ? (
								<ActionButton
									variant="primary"
									className="w-full"
									onClick={handleReviewBatch}
									disabled={busy}>
									{previewBatch.isPending ? "Preparing review…" : "Review Changes"}
								</ActionButton>
							) : (
								<ActionButton
									variant="primary"
									className="w-full"
									onClick={handleSaveIndividual}
									disabled={busy}>
									{updateIndividual.isPending ? "Saving…" : "Save Acquisition"}
								</ActionButton>
							)}
						</footer>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
