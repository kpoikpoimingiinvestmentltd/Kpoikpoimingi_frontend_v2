import CustomInput from "@/components/base/CustomInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { inputStyle, radioStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import {
	useCreateSupplier,
	useGetPurchaseBatchById,
	useGetPurchaseBatches,
	useGetSuppliers,
	type Supplier,
} from "@/api/purchase";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ActionButton from "@/components/base/ActionButton";

export type AcquisitionMode = "individual" | "new_batch" | "existing_batch";

export type AcquisitionFormState = {
	mode: AcquisitionMode | "";
	supplierId: string;
	purchaseDate: string;
	purchasePrice: string;
	transportation: string;
	miscellaneous: string;
	notes: string;
	batchId: string;
	allocationMethod: "EQUAL" | "PURCHASE_PRICE_WEIGHTED" | "MANUAL";
	batchTransportation: string;
	batchMiscellaneous: string;
	pricingMethod: "MANUAL" | "COST_PLUS_MARKUP";
	/** Per-unit listing/selling price when pricingMethod is MANUAL */
	sellingPrice: string;
	markupPercentage: string;
	manualAllocations: Array<{
		purchaseId?: string;
		isNew?: boolean;
		allocatedTransportation: string;
		allocatedMiscellaneous: string;
		label?: string;
	}>;
};

type Props = {
	value: AcquisitionFormState;
	onChange: (next: AcquisitionFormState) => void;
	optional?: boolean;
	formatPriceDisplay: (v: string | number) => string;
	parsePriceValue: (v: string) => string;
	quantityTotal?: number;
	/** Limit which acquisition modes are shown (default: all three). */
	allowedModes?: AcquisitionMode[];
	/** Override section title / description (e.g. attach to existing property). */
	title?: string;
	description?: string;
};

const today = () => new Date().toISOString().slice(0, 10);

const ALLOCATION_HELP: Record<AcquisitionFormState["allocationMethod"], string> = {
	EQUAL:
		"Splits batch transportation fee and miscellaneous fee evenly across every property. Example: ₦100,000 transportation fee across 4 properties → ₦25,000 each.",
	PURCHASE_PRICE_WEIGHTED:
		"Splits shared fees in proportion to each property’s purchase total (purchase price × quantity). Higher-value lines take a larger share.",
	MANUAL:
		"You enter the transportation fee and miscellaneous fee for each property. Amounts must add up exactly to the batch fee totals.",
};

export const defaultAcquisitionState = (): AcquisitionFormState => ({
	mode: "",
	supplierId: "",
	purchaseDate: today(),
	purchasePrice: "",
	transportation: "",
	miscellaneous: "",
	notes: "",
	batchId: "",
	allocationMethod: "PURCHASE_PRICE_WEIGHTED",
	batchTransportation: "",
	batchMiscellaneous: "",
	pricingMethod: "MANUAL",
	sellingPrice: "",
	markupPercentage: "20",
	manualAllocations: [],
});

export default function AcquisitionSection({
	value,
	onChange,
	optional,
	formatPriceDisplay,
	parsePriceValue,
	quantityTotal = 1,
	allowedModes,
	title = "Acquisition",
	description,
}: Props) {
	const modes = allowedModes ?? (["individual", "new_batch", "existing_batch"] as AcquisitionMode[]);
	const showMode = (m: AcquisitionMode) => modes.includes(m);
	const { data: suppliersRes, refetch: refetchSuppliers, isLoading: suppliersLoading } = useGetSuppliers(1, 200);
	const suppliers = useMemo(() => {
		return ((suppliersRes as { data?: Supplier[] })?.data || []) as Supplier[];
	}, [suppliersRes]);

	const { data: batchesRes, isLoading: batchesLoading, isError: batchesError } = useGetPurchaseBatches(1, 50);
	const batches = useMemo(() => {
		return ((batchesRes as { data?: Array<Record<string, unknown>> })?.data || []) as Array<
			Record<string, unknown>
		>;
	}, [batchesRes]);

	const { data: selectedBatchData } = useGetPurchaseBatchById(
		value.mode === "existing_batch" && value.batchId ? value.batchId : undefined,
	);

	const [newSupplierName, setNewSupplierName] = useState("");
	const [showNewSupplier, setShowNewSupplier] = useState(false);
	const set = (patch: Partial<AcquisitionFormState>) => onChange({ ...value, ...patch });

	useEffect(() => {
		if (suppliers.length === 0 && !suppliersLoading) {
			setShowNewSupplier(true);
		}
	}, [suppliers.length, suppliersLoading]);

	useEffect(() => {
		if (value.mode !== "existing_batch" || !value.batchId || !selectedBatchData) return;
		const batch = selectedBatchData as Record<string, unknown>;
		if (batch.allocationMethod !== "MANUAL") {
			onChange({ ...value, manualAllocations: [] });
			return;
		}
		const purchases = (batch.purchases as Array<Record<string, unknown>>) || [];
		const existingRows = purchases.map((p) => {
			const property = p.property as { name?: string } | undefined;
			return {
				purchaseId: p.id as string,
				allocatedTransportation: String(p.allocatedTransportation ?? "0"),
				allocatedMiscellaneous: String(p.allocatedMiscellaneous ?? "0"),
				label: property?.name || String(p.reference || p.id),
			};
		});
		onChange({
			...value,
			manualAllocations: [
				...existingRows,
				{
					isNew: true,
					allocatedTransportation: "",
					allocatedMiscellaneous: "",
					label: "This property",
				},
			],
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedBatchData, value.batchId, value.mode]);

	const createSupplier = useCreateSupplier(
		(data: unknown) => {
			const supplier = (data as { supplier?: Supplier })?.supplier;
			toast.success("Supplier added");
			setNewSupplierName("");
			setShowNewSupplier(false);
			refetchSuppliers();
			if (supplier?.id) {
				onChange({ ...value, supplierId: supplier.id });
			}
		},
		(err: unknown) => {
			const msg =
				typeof err === "object" && err && "message" in err
					? String((err as { message?: string }).message)
					: "Failed to create supplier";
			toast.error(msg);
		},
	);

	const handleCreateSupplier = () => {
		if (!newSupplierName.trim()) {
			toast.error("Enter a supplier name");
			return;
		}
		createSupplier.mutate({ name: newSupplierName.trim() });
	};

	const moneyField = (
		label: string,
		fieldValue: string,
		onValue: (v: string) => void,
		required?: boolean,
	) => (
		<CustomInput
			label={required ? `${label}*` : label}
			labelClassName="block text-sm dark:text-gray-300 mb-2"
			type="text"
			value={fieldValue === "" || fieldValue == null ? "" : formatPriceDisplay(fieldValue)}
			onChange={(e) => onValue(parsePriceValue(e.target.value))}
			className={twMerge(inputStyle)}
			placeholder="0"
		/>
	);

	const qty = Math.max(1, Number(quantityTotal) || 1);
	const purchaseUnit = Number(String(value.purchasePrice).replace(/,/g, "")) || 0;
	const linePurchase = purchaseUnit * qty;

	const previewAcquisitionCost = (() => {
		if (!value.mode || !value.purchasePrice) return null;
		if (value.mode === "individual") {
			const t = Number(value.transportation) || 0;
			const m = Number(value.miscellaneous) || 0;
			return linePurchase + t + m;
		}
		if (value.mode === "new_batch") {
			// Single property in new batch gets full shared fees for preview
			if (value.allocationMethod === "MANUAL") {
				return linePurchase + (Number(value.transportation) || 0) + (Number(value.miscellaneous) || 0);
			}
			return linePurchase + (Number(value.batchTransportation) || 0) + (Number(value.batchMiscellaneous) || 0);
		}
		if (value.mode === "existing_batch" && selectedBatchData) {
			const batch = selectedBatchData as Record<string, unknown>;
			const purchases = (batch.purchases as Array<Record<string, unknown>>) || [];
			const n = purchases.length + 1;
			const batchT = Number(batch.transportationCost) || 0;
			const batchM = Number(batch.miscellaneousCost) || 0;
			if (batch.allocationMethod === "EQUAL") {
				return linePurchase + batchT / n + batchM / n;
			}
			if (batch.allocationMethod === "MANUAL") {
				const newRow = value.manualAllocations.find((r) => r.isNew);
				return (
					linePurchase +
					(Number(newRow?.allocatedTransportation) || 0) +
					(Number(newRow?.allocatedMiscellaneous) || 0)
				);
			}
			// weighted preview
			const existingValue = purchases.reduce((s, p) => {
				return s + Number(p.purchasePrice) * Number(p.quantity || 1);
			}, 0);
			const totalValue = existingValue + linePurchase;
			const share = totalValue > 0 ? linePurchase / totalValue : 1 / n;
			return linePurchase + batchT * share + batchM * share;
		}
		return linePurchase;
	})();

	const previewSellingFromMarkup = (() => {
		if (previewAcquisitionCost == null || value.pricingMethod !== "COST_PLUS_MARKUP") return null;
		const markup = Number(value.markupPercentage) || 0;
		const unitAcq = previewAcquisitionCost / qty;
		return Math.round(unitAcq * (1 + markup / 100) * 100) / 100;
	})();

	return (
		<section className="border-t pt-6 mt-8 space-y-6">
			<div>
				<h3 className="font-semibold text-base mb-1">{title}</h3>
				<p className="text-sm text-muted-foreground mb-4">
					{description ??
						`Record how this property was bought${optional ? " (optional for this flow)" : ""}.`}
				</p>
				<RadioGroup
					value={value.mode || ""}
					onValueChange={(val) => set({ mode: val as AcquisitionMode })}
					className="flex flex-col gap-3">
					{showMode("individual") && (
					<label
						htmlFor="acq-individual"
						className="flex items-start gap-3 cursor-pointer rounded-md border p-3 has-[[data-state=checked]]:border-primary">
						<RadioGroupItem value="individual" id="acq-individual" className={twMerge(radioStyle, "mt-0.5")} />
						<span>
							<span className="block text-sm font-medium">Individual purchase</span>
							<span className="block text-xs text-muted-foreground mt-0.5">
								Bought on its own — supplier, purchase price, and costs for this property only.
							</span>
						</span>
					</label>
					)}
					{showMode("new_batch") && (
					<label
						htmlFor="acq-new-batch"
						className="flex items-start gap-3 cursor-pointer rounded-md border p-3 has-[[data-state=checked]]:border-primary">
						<RadioGroupItem value="new_batch" id="acq-new-batch" className={twMerge(radioStyle, "mt-0.5")} />
						<span>
							<span className="block text-sm font-medium">Part of a new batch</span>
							<span className="block text-xs text-muted-foreground mt-0.5">
								Start a procurement batch with this property. Add more properties later by choosing an existing batch.
							</span>
						</span>
					</label>
					)}
					{showMode("existing_batch") && (
					<label
						htmlFor="acq-existing-batch"
						className="flex items-start gap-3 cursor-pointer rounded-md border p-3 has-[[data-state=checked]]:border-primary">
						<RadioGroupItem value="existing_batch" id="acq-existing-batch" className={twMerge(radioStyle, "mt-0.5")} />
						<span>
							<span className="block text-sm font-medium">Part of an existing batch</span>
							<span className="block text-xs text-muted-foreground mt-0.5">
								Attach this property to a batch already created. Shared costs are recalculated for all items.
							</span>
						</span>
					</label>
					)}
				</RadioGroup>
			</div>

			{value.mode === "individual" && (
				<div className="space-y-5">
					<h4 className="text-sm font-semibold">Purchase details</h4>
					<SupplierField
						suppliers={suppliers}
						supplierId={value.supplierId}
						onSupplierId={(id) => set({ supplierId: id })}
						loading={suppliersLoading}
						showNewSupplier={showNewSupplier}
						setShowNewSupplier={setShowNewSupplier}
						newSupplierName={newSupplierName}
						setNewSupplierName={setNewSupplierName}
						onCreate={handleCreateSupplier}
						creating={createSupplier.isPending}
					/>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<CustomInput
							label="Purchase Date*"
							labelClassName="block text-sm dark:text-gray-300 mb-2"
							type="date"
							value={value.purchaseDate}
							onChange={(e) => set({ purchaseDate: e.target.value })}
							className={twMerge(inputStyle)}
						/>
						{moneyField("Purchase Price (per unit)", value.purchasePrice, (v) => set({ purchasePrice: v }), true)}
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{moneyField("Transportation fee", value.transportation, (v) => set({ transportation: v }))}
						{moneyField("Miscellaneous fee", value.miscellaneous, (v) => set({ miscellaneous: v }))}
					</div>
					<CustomInput
						label="Notes"
						labelClassName="block text-sm dark:text-gray-300 mb-2"
						type="text"
						value={value.notes}
						onChange={(e) => set({ notes: e.target.value })}
						className={twMerge(inputStyle)}
						placeholder="Optional"
					/>
					<p className="text-xs text-muted-foreground">
						Total acquisition cost = (purchase price × quantity) + transportation fee + miscellaneous fee
					</p>
				</div>
			)}

			{value.mode === "new_batch" && (
				<div className="space-y-5">
					<h4 className="text-sm font-semibold">Batch details</h4>
					<SupplierField
						suppliers={suppliers}
						supplierId={value.supplierId}
						onSupplierId={(id) => set({ supplierId: id })}
						loading={suppliersLoading}
						showNewSupplier={showNewSupplier}
						setShowNewSupplier={setShowNewSupplier}
						newSupplierName={newSupplierName}
						setNewSupplierName={setNewSupplierName}
						onCreate={handleCreateSupplier}
						creating={createSupplier.isPending}
					/>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<CustomInput
							label="Purchase Date*"
							labelClassName="block text-sm dark:text-gray-300 mb-2"
							type="date"
							value={value.purchaseDate}
							onChange={(e) => set({ purchaseDate: e.target.value })}
							className={twMerge(inputStyle)}
						/>
						{moneyField("Purchase Price (per unit)", value.purchasePrice, (v) => set({ purchasePrice: v }), true)}
					</div>

					<h4 className="text-sm font-semibold pt-1">Shared batch fees</h4>
					<p className="text-xs text-muted-foreground -mt-3">
						These fees apply to the whole shipment and are split across properties in the batch.
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{moneyField("Transportation fee", value.batchTransportation, (v) => set({ batchTransportation: v }))}
						{moneyField("Miscellaneous fee", value.batchMiscellaneous, (v) => set({ batchMiscellaneous: v }))}
					</div>

					<div>
						<label className="block text-sm dark:text-gray-300 mb-2">How should shared fees be split?*</label>
						<Select
							value={value.allocationMethod}
							onValueChange={(v) => set({ allocationMethod: v as AcquisitionFormState["allocationMethod"] })}>
							<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 text-sm")}>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="EQUAL">Equal split</SelectItem>
								<SelectItem value="PURCHASE_PRICE_WEIGHTED">By purchase price</SelectItem>
								<SelectItem value="MANUAL">Manual amounts</SelectItem>
							</SelectContent>
						</Select>
						<p className="text-xs text-muted-foreground mt-2">{ALLOCATION_HELP[value.allocationMethod]}</p>
					</div>

					{value.allocationMethod === "MANUAL" && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{moneyField("This property — transportation fee", value.transportation, (v) => set({ transportation: v }), true)}
							{moneyField("This property — miscellaneous fee", value.miscellaneous, (v) => set({ miscellaneous: v }), true)}
						</div>
					)}

					<CustomInput
						label="Batch notes"
						labelClassName="block text-sm dark:text-gray-300 mb-2"
						type="text"
						value={value.notes}
						onChange={(e) => set({ notes: e.target.value })}
						className={twMerge(inputStyle)}
						placeholder="Optional"
					/>
				</div>
			)}

			{value.mode === "existing_batch" && (
				<div className="space-y-5">
					<h4 className="text-sm font-semibold">Add to batch</h4>
					<div>
						<label className="block text-sm dark:text-gray-300 mb-2">Purchase batch*</label>
						{batchesError ? (
							<p className="text-sm text-destructive rounded-md border border-destructive/30 p-3">
								Failed to load purchase batches. Check that the API is reachable and try again.
							</p>
						) : !batchesLoading && batches.length === 0 ? (
							<p className="text-sm text-muted-foreground rounded-md border p-3">
								No batches yet. Create one first with &quot;Part of a new batch&quot;, then come back to add more properties.
							</p>
						) : (
							<Select
								value={value.batchId || undefined}
								onValueChange={(id) => set({ batchId: id })}
								disabled={batchesLoading}>
								<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 text-sm")}>
									<SelectValue placeholder={batchesLoading ? "Loading batches..." : "Select a batch"} />
								</SelectTrigger>
								<SelectContent>
									{batches.map((b) => {
										const supplier = b.supplier as { name?: string } | undefined;
										const count = b.propertyCount != null ? ` · ${b.propertyCount} properties` : "";
										return (
											<SelectItem key={b.id as string} value={b.id as string}>
												{String(b.reference)} — {supplier?.name || "Supplier"}
												{count}
											</SelectItem>
										);
									})}
								</SelectContent>
							</Select>
						)}
					</div>

					{moneyField("Purchase Price (per unit)", value.purchasePrice, (v) => set({ purchasePrice: v }), true)}

					{value.batchId && (selectedBatchData as { allocationMethod?: string } | undefined)?.allocationMethod && (
						<p className="text-xs text-muted-foreground">
							This batch uses{" "}
							<strong>
								{(selectedBatchData as { allocationMethod: string }).allocationMethod === "EQUAL"
									? "equal split"
									: (selectedBatchData as { allocationMethod: string }).allocationMethod === "MANUAL"
										? "manual amounts"
										: "purchase-price weighting"}
							</strong>
							. Shared fees will be recalculated for every property in the batch after you save.
						</p>
					)}

					{(selectedBatchData as { allocationMethod?: string } | undefined)?.allocationMethod === "MANUAL" &&
						value.manualAllocations.length > 0 && (
							<div className="space-y-4">
								<h4 className="text-sm font-semibold">Reallocate shared fees</h4>
								<p className="text-xs text-muted-foreground -mt-2">
									Enter amounts for each property. Totals must match the batch transportation fee and miscellaneous fee.
								</p>
								{value.manualAllocations.map((row, idx) => (
									<div key={row.purchaseId || "new"} className="space-y-2">
										<p className="text-sm font-medium">{row.label}</p>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{moneyField("Transportation fee", row.allocatedTransportation, (v) => {
												const next = [...value.manualAllocations];
												next[idx] = { ...next[idx], allocatedTransportation: v };
												set({ manualAllocations: next });
											})}
											{moneyField("Miscellaneous fee", row.allocatedMiscellaneous, (v) => {
												const next = [...value.manualAllocations];
												next[idx] = { ...next[idx], allocatedMiscellaneous: v };
												set({ manualAllocations: next });
											})}
										</div>
									</div>
								))}
							</div>
						)}
				</div>
			)}

			{value.mode && (
				<div className="space-y-4 border-t pt-6">
					<h4 className="text-sm font-semibold">Listing price</h4>
					<p className="text-xs text-muted-foreground -mt-2">
						Set a selling price yourself, or calculate it from acquisition cost plus markup.
					</p>

					<RadioGroup
						value={value.pricingMethod}
						onValueChange={(val) => set({ pricingMethod: val as AcquisitionFormState["pricingMethod"] })}
						className="flex flex-col gap-3">
						<label
							htmlFor="price-manual"
							className="flex items-start gap-3 cursor-pointer rounded-md border p-3 has-[[data-state=checked]]:border-primary">
							<RadioGroupItem value="MANUAL" id="price-manual" className={twMerge(radioStyle, "mt-0.5")} />
							<span>
								<span className="block text-sm font-medium">Manual selling price</span>
								<span className="block text-xs text-muted-foreground mt-0.5">
									Enter the listing price you want to sell at.
								</span>
							</span>
						</label>
						<label
							htmlFor="price-markup"
							className="flex items-start gap-3 cursor-pointer rounded-md border p-3 has-[[data-state=checked]]:border-primary">
							<RadioGroupItem value="COST_PLUS_MARKUP" id="price-markup" className={twMerge(radioStyle, "mt-0.5")} />
							<span>
								<span className="block text-sm font-medium">Cost + markup</span>
								<span className="block text-xs text-muted-foreground mt-0.5">
									Listing price = acquisition cost per unit × (1 + markup %).
								</span>
							</span>
						</label>
					</RadioGroup>

					{value.pricingMethod === "MANUAL" ? (
						<CustomInput
							label="Selling Price (per unit)*"
							labelClassName="block text-sm dark:text-gray-300 mb-2"
							type="text"
							value={value.sellingPrice === "" ? "" : formatPriceDisplay(value.sellingPrice)}
							onChange={(e) => set({ sellingPrice: parsePriceValue(e.target.value) })}
							className={twMerge(inputStyle)}
							placeholder="0"
						/>
					) : (
						<CustomInput
							label="Markup (%)*"
							labelClassName="block text-sm dark:text-gray-300 mb-2"
							type="text"
							value={value.markupPercentage}
							onChange={(e) => set({ markupPercentage: e.target.value.replace(/[^\d.]/g, "") })}
							className={twMerge(inputStyle)}
							placeholder="20"
						/>
					)}

					{previewAcquisitionCost != null && (
						<div className="rounded-md border p-3 space-y-2 text-sm">
							<div className="flex justify-between gap-4">
								<span className="text-muted-foreground">Estimated acquisition cost</span>
								<span>₦{previewAcquisitionCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
							</div>
							{value.pricingMethod === "COST_PLUS_MARKUP" ? (
								<div className="flex justify-between gap-4">
									<span className="text-muted-foreground">Listing price (per unit)</span>
									<span className="font-semibold text-primary">
										₦{(previewSellingFromMarkup ?? 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
									</span>
								</div>
							) : value.sellingPrice ? (
								<div className="flex justify-between gap-4">
									<span className="text-muted-foreground">Selling price (per unit)</span>
									<span className="font-semibold text-primary">
										₦{Number(value.sellingPrice || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
									</span>
								</div>
							) : null}
						</div>
					)}
				</div>
			)}
		</section>
	);
}

function SupplierField({
	suppliers,
	supplierId,
	onSupplierId,
	loading,
	showNewSupplier,
	setShowNewSupplier,
	newSupplierName,
	setNewSupplierName,
	onCreate,
	creating,
}: {
	suppliers: Supplier[];
	supplierId: string;
	onSupplierId: (id: string) => void;
	loading?: boolean;
	showNewSupplier: boolean;
	setShowNewSupplier: (v: boolean) => void;
	newSupplierName: string;
	setNewSupplierName: (v: string) => void;
	onCreate: () => void;
	creating: boolean;
}) {
	const hasSuppliers = suppliers.length > 0;

	return (
		<div className="space-y-3">
			{hasSuppliers || loading ? (
				<div>
					<label className="block text-sm dark:text-gray-300 mb-2">Supplier*</label>
					<Select value={supplierId || undefined} onValueChange={onSupplierId} disabled={loading}>
						<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 text-sm")}>
							<SelectValue placeholder={loading ? "Loading suppliers..." : "Select supplier"} />
						</SelectTrigger>
						<SelectContent>
							{suppliers.map((s) => (
								<SelectItem key={s.id} value={s.id}>
									{s.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{!showNewSupplier && (
						<button
							type="button"
							className="mt-2 text-sm text-primary underline underline-offset-2"
							onClick={() => setShowNewSupplier(true)}>
							+ Add new supplier
						</button>
					)}
				</div>
			) : (
				<p className="text-sm text-muted-foreground">No suppliers saved yet. Create one to continue.</p>
			)}

			{showNewSupplier && (
				<div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
					<CustomInput
						label={hasSuppliers ? "New supplier name*" : "Supplier name*"}
						labelClassName="block text-sm dark:text-gray-300 mb-2"
						value={newSupplierName}
						onChange={(e) => setNewSupplierName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								onCreate();
							}
						}}
						className={twMerge(inputStyle)}
						placeholder="e.g. ABC Electronics"
					/>
					<div className="flex gap-2">
						{hasSuppliers && (
							<button
								type="button"
								className="h-11 px-3 text-sm text-muted-foreground"
								onClick={() => {
									setShowNewSupplier(false);
									setNewSupplierName("");
								}}>
								Cancel
							</button>
						)}
						<ActionButton
							type="button"
							onClick={onCreate}
							disabled={creating || !newSupplierName.trim()}
							className="rounded-md h-11 min-w-[7.5rem]">
							{creating ? "Saving..." : "Save supplier"}
						</ActionButton>
					</div>
				</div>
			)}
		</div>
	);
}
