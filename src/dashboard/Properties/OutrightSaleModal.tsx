import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import CustomInput from "@/components/base/CustomInput";
import ActionButton from "@/components/base/ActionButton";
import {
	inputStyle,
	labelStyle,
	modalContentStyle,
	radioStyle,
	selectTriggerStyle,
} from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";
import { useGetReferenceData } from "@/api/reference";
import { useGetSystemSettings } from "@/api/settings";
import {
	useCreateOutrightSale,
} from "@/api/outrightSale";
import { extractErrorMessage } from "@/lib/utils";
import { IconWrapper, CheckIcon } from "@/assets/icons";

export type SellPropertyItem = {
	id: string;
	name: string;
	price: string | number;
	quantityAvailable: number;
};

type LineItem = {
	propertyId: string;
	name: string;
	unitPrice: number;
	quantity: number;
	maxQuantity: number;
	salePrice: number;
};

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	properties: SellPropertyItem[];
	onSold?: () => void;
};

function formatMoney(value: number) {
	return `₦${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function parsePrice(value: string | number) {
	const n = Number(value);
	return Number.isFinite(n) ? n : 0;
}

function buildLines(items: SellPropertyItem[]): LineItem[] {
	return items
		.filter((p) => Boolean(p?.id) && Number(p.quantityAvailable) > 0)
		.map((p) => {
			const unitPrice = parsePrice(p.price);
			return {
				propertyId: String(p.id),
				name: p.name,
				unitPrice,
				quantity: 1,
				maxQuantity: Number(p.quantityAvailable) || 1,
				salePrice: unitPrice,
			};
		});
}

export default function OutrightSaleModal({ open, onOpenChange, properties, onSold }: Props) {
	const [step, setStep] = React.useState<"confirm" | "customer" | "payment" | "success">("confirm");
	const [lines, setLines] = React.useState<LineItem[]>(() => buildLines(properties));
	const [customerName, setCustomerName] = React.useState("");
	const [customerEmail, setCustomerEmail] = React.useState("");
	const [customerPhone, setCustomerPhone] = React.useState("");
	const [paymentMode, setPaymentMode] = React.useState<"cash" | "link">("cash");
	const [paymentMethodId, setPaymentMethodId] = React.useState("1");
	const [paymentLink, setPaymentLink] = React.useState("");

	const propertyIdsKey = properties.map((p) => p.id).join(",");

	const { data: refData } = useGetReferenceData(open);
	const { data: settings } = useGetSystemSettings(open);

	const inShopMethods = React.useMemo(() => {
		const raw = (refData as { paymentMethods?: Array<Record<string, unknown>> } | undefined)
			?.paymentMethods;
		if (!Array.isArray(raw)) {
			return [
				{ id: "1", label: "CASH" },
				{ id: "2", label: "POS" },
				{ id: "3", label: "TRANSFER" },
			];
		}
		return raw
			.map((m) => {
				const label = String(m.method ?? m.value ?? m.displayValue ?? "")
					.toUpperCase()
					.replace(/\s+/g, "_");
				return { id: String(m.id ?? ""), label };
			})
			.filter((m) => m.id && m.label && m.label !== "PAYMENT_LINK");
	}, [refData]);

	const vatRate = React.useMemo(() => {
		const fromSettings = settings?.vatRate;
		if (typeof fromSettings === "number" && !Number.isNaN(fromSettings)) {
			return fromSettings > 1 ? fromSettings / 100 : fromSettings;
		}
		const vatList = (refData as { vatPercentages?: Array<Record<string, unknown>> } | undefined)
			?.vatPercentages;
		const first = Array.isArray(vatList) ? vatList[0] : undefined;
		const pct = Number(first?.percentage ?? first?.value ?? 0);
		return Number.isFinite(pct) ? (pct > 1 ? pct / 100 : pct) : 0;
	}, [settings, refData]);

	React.useEffect(() => {
		if (!open) return;
		setStep("confirm");
		setCustomerName("");
		setCustomerEmail("");
		setCustomerPhone("");
		setPaymentMode("cash");
		setPaymentLink("");
		setLines(buildLines(properties));
		// Re-seed when modal opens or the selected property set changes.
		// eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: use propertyIdsKey, not properties identity
	}, [open, propertyIdsKey]);

	React.useEffect(() => {
		if (!open || !inShopMethods.length) return;
		setPaymentMethodId((prev) =>
			inShopMethods.some((m) => m.id === prev) ? prev : inShopMethods[0].id,
		);
	}, [open, inShopMethods]);

	const subtotal = React.useMemo(
		() => lines.reduce((sum, line) => sum + line.salePrice, 0),
		[lines],
	);
	const vatAmount = subtotal * vatRate;
	const totalWithVat = subtotal + vatAmount;

	const createSale = useCreateOutrightSale(
		(data) => {
			const link =
				(typeof data.paymentLink === "string" && data.paymentLink) ||
				((data as { data?: { paymentLink?: string } }).data?.paymentLink ?? "");
			if (link) {
				setPaymentLink(link);
				setStep("success");
				toast.success("Sale recorded — payment link generated");
			} else {
				toast.success("Outright sale recorded");
				onSold?.();
				onOpenChange(false);
			}
		},
		(err) => {
			toast.error(extractErrorMessage(err, "Failed to record outright sale"));
		},
	);

	const updateLine = (propertyId: string, patch: Partial<LineItem>) => {
		setLines((prev) =>
			prev.map((line) => {
				if (line.propertyId !== propertyId) return line;
				const next = { ...line, ...patch };
				if (patch.quantity !== undefined && patch.salePrice === undefined) {
					next.salePrice = next.unitPrice * next.quantity;
				}
				return next;
			}),
		);
	};

	const handleConfirmNext = () => {
		if (!lines.length) {
			toast.error("Select at least one property with stock available");
			return;
		}
		for (const line of lines) {
			if (!line.propertyId?.trim()) {
				toast.error(`Missing property id for ${line.name || "item"}`);
				return;
			}
			if (line.quantity < 1 || line.quantity > line.maxQuantity) {
				toast.error(`Invalid quantity for ${line.name}`);
				return;
			}
			if (!Number.isFinite(line.salePrice) || line.salePrice < 0) {
				toast.error(`Invalid sale price for ${line.name}`);
				return;
			}
		}
		setStep("customer");
	};

	const handleCustomerNext = () => {
		if (!customerName.trim()) {
			toast.error("Customer name is required");
			return;
		}
		setStep("payment");
	};

	const handleSubmit = async () => {
		if (paymentMode === "link" && !customerEmail.trim()) {
			toast.error("Customer email is required to generate a payment link");
			return;
		}
		if (paymentMode === "cash" && !paymentMethodId) {
			toast.error("Select a payment method");
			return;
		}

		const payloadProperties = lines
			.map((line) => {
				const quantity = Math.max(1, Number(line.quantity) || 1);
				const salePrice = Number(line.salePrice);
				return {
					propertyId: String(line.propertyId || "").trim(),
					quantity,
					salePrice: Number.isFinite(salePrice) ? salePrice : line.unitPrice * quantity,
				};
			})
			.filter((item) => item.propertyId.length > 0 && item.salePrice >= 0);

		if (!payloadProperties.length) {
			toast.error("No valid properties to sell — go back and confirm the selection");
			setStep("confirm");
			return;
		}

		await createSale.mutateAsync({
			items: payloadProperties,
			paymentMethodId:
				paymentMode === "link" ? 4 : Number(paymentMethodId),
			generatePaymentLink: paymentMode === "link",
			customerName: customerName.trim(),
			customerEmail: customerEmail.trim() || undefined,
			customerPhone: customerPhone.trim() || undefined,
		});
	};

	const handleCopy = async () => {
		if (!paymentLink || !navigator?.clipboard) return;
		await navigator.clipboard.writeText(paymentLink);
		toast.info("Link copied to clipboard!");
	};

	const handleCloseSuccess = () => {
		onSold?.();
		onOpenChange(false);
	};

	const qrSrc = paymentLink
		? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentLink)}`
		: "";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle("md:max-w-2xl")}>
				<DialogHeader>
					<DialogTitle>
						{step === "confirm" && "Confirm sale"}
						{step === "customer" && "Customer details"}
						{step === "payment" && "Payment"}
						{step === "success" && "Payment link generated"}
					</DialogTitle>
				</DialogHeader>

				{step === "confirm" && (
					<div className="flex flex-col gap-5 py-2">
						<div className="space-y-3">
							{lines.map((line) => (
								<div
									key={line.propertyId}
									className="rounded-md border border-border p-3 space-y-3">
									<div className="flex items-start justify-between gap-3">
										<div>
											<p className="text-sm font-medium">{line.name}</p>
											<p className="text-xs text-muted-foreground">
												Unit: {formatMoney(line.unitPrice)} · Available: {line.maxQuantity}
											</p>
										</div>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
										<CustomInput
											label="Quantity"
											type="number"
											min={1}
											max={line.maxQuantity}
											value={String(line.quantity)}
											onChange={(e) => {
												const qty = Math.max(
													1,
													Math.min(line.maxQuantity, Number(e.target.value) || 1),
												);
												updateLine(line.propertyId, { quantity: qty });
											}}
										/>
										<CustomInput
											label="Line total (before VAT)"
											type="number"
											min={0}
											value={String(line.salePrice)}
											onChange={(e) =>
												updateLine(line.propertyId, {
													salePrice: Math.max(0, Number(e.target.value) || 0),
												})
											}
										/>
									</div>
								</div>
							))}
							{lines.length === 0 && (
								<p className="text-sm text-muted-foreground text-center py-6">
									No available stock for the selected properties.
								</p>
							)}
						</div>

						<div className="rounded-md bg-muted/30 border border-border p-3 space-y-1.5 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Subtotal</span>
								<span className="font-medium">{formatMoney(subtotal)}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">
									VAT ({(vatRate * 100).toFixed(vatRate * 100 % 1 === 0 ? 0 : 1)}%)
								</span>
								<span className="font-medium">{formatMoney(vatAmount)}</span>
							</div>
							<div className="flex justify-between border-t border-border pt-1.5">
								<span className="font-medium">Total with VAT</span>
								<span className="font-semibold text-primary">{formatMoney(totalWithVat)}</span>
							</div>
						</div>

						<footer className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3 pt-2">
							<ActionButton variant="outline" onClick={() => onOpenChange(false)}>
								Cancel
							</ActionButton>
							<ActionButton onClick={handleConfirmNext} disabled={!lines.length}>
								Continue
							</ActionButton>
						</footer>
					</div>
				)}

				{step === "customer" && (
					<div className="flex flex-col gap-5 py-2">
						<div className="rounded-md bg-muted/30 border border-border p-3 text-sm space-y-1">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Items</span>
								<span>{lines.length}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Total with VAT</span>
								<span className="font-semibold text-primary">{formatMoney(totalWithVat)}</span>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-3">
							<CustomInput
								label="Customer name*"
								value={customerName}
								onChange={(e) => setCustomerName(e.target.value)}
							/>
							<CustomInput
								label="Customer email"
								type="email"
								value={customerEmail}
								onChange={(e) => setCustomerEmail(e.target.value)}
							/>
							<CustomInput
								label="Customer phone"
								value={customerPhone}
								onChange={(e) => setCustomerPhone(e.target.value)}
							/>
						</div>

						<footer className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3 pt-2">
							<ActionButton variant="outline" onClick={() => setStep("confirm")}>
								Back
							</ActionButton>
							<ActionButton onClick={handleCustomerNext}>
								Continue to payment
							</ActionButton>
						</footer>
					</div>
				)}

				{step === "payment" && (
					<div className="flex flex-col gap-5 py-2">
						<div className="rounded-md bg-muted/30 border border-border p-3 text-sm space-y-1">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Items</span>
								<span>{lines.length}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Total with VAT</span>
								<span className="font-semibold text-primary">{formatMoney(totalWithVat)}</span>
							</div>
							<p className="text-xs text-muted-foreground pt-1">
								Customer: {customerName}
								{customerEmail ? ` · ${customerEmail}` : ""}
							</p>
						</div>

						<div>
							<Label className={labelStyle()}>How was / will payment be made?*</Label>
							<RadioGroup
								value={paymentMode}
								onValueChange={(v) => setPaymentMode(v as "cash" | "link")}
								className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="cash" id="outright-cash" className={radioStyle} />
									<Label htmlFor="outright-cash" className="text-sm cursor-pointer">
										Paid in shop
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="link" id="outright-link" className={radioStyle} />
									<Label htmlFor="outright-link" className="text-sm cursor-pointer">
										Generate payment link
									</Label>
								</div>
							</RadioGroup>
						</div>

						{paymentMode === "cash" && (
							<div>
								<Label className={labelStyle()}>Payment method*</Label>
								<Select value={paymentMethodId} onValueChange={setPaymentMethodId}>
									<SelectTrigger className={twMerge(selectTriggerStyle())}>
										<SelectValue placeholder="Select method" />
									</SelectTrigger>
									<SelectContent>
										{inShopMethods.map((m) => (
											<SelectItem key={m.id} value={m.id}>
												{m.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}

						{paymentMode === "link" && (
							<div className="space-y-2">
								<p className="text-sm text-muted-foreground">
									A Paystack link and QR code will be generated for the customer to pay{" "}
									<span className="font-medium text-foreground">{formatMoney(totalWithVat)}</span>.
									Email is required.
								</p>
								{!customerEmail.trim() && (
									<CustomInput
										label="Customer email*"
										type="email"
										value={customerEmail}
										onChange={(e) => setCustomerEmail(e.target.value)}
										className={inputStyle}
									/>
								)}
							</div>
						)}

						<footer className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3 pt-2">
							<ActionButton
								variant="outline"
								onClick={() => setStep("customer")}
								disabled={createSale.isPending}>
								Back
							</ActionButton>
							<ActionButton onClick={handleSubmit} isLoading={createSale.isPending}>
								{paymentMode === "link" ? "Generate link & sell" : "Complete sale"}
							</ActionButton>
						</footer>
					</div>
				)}

				{step === "success" && (
					<div className="flex flex-col items-center gap-5 py-4 px-2 w-full">
						<IconWrapper className="text-4xl text-emerald-500">
							<CheckIcon />
						</IconWrapper>
						<div className="text-center space-y-1">
							<p className="text-lg font-semibold">Payment Link Generated</p>
							<p className="text-sm text-muted-foreground">
								Customer can scan the QR code or open the link to pay.
							</p>
						</div>

						{qrSrc && (
							<img
								src={qrSrc}
								alt="Payment QR code"
								className="w-[200px] h-[200px] rounded-md border border-stone-200 bg-white p-2"
							/>
						)}

						<div className="w-full">
							<span className="text-sm font-medium mb-1 block">Link</span>
							<p className="text-sm [word-break:break-all] text-muted-foreground">
								<a
									href={paymentLink}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary underline hover:text-primary">
									{paymentLink}
								</a>
							</p>
						</div>

						<div className="flex flex-wrap gap-3 justify-center mt-2">
							<ActionButton variant="outline" onClick={handleCopy} className="px-6 w-max">
								Copy Link
							</ActionButton>
							<ActionButton onClick={handleCloseSuccess} className="px-6 w-max">
								Done
							</ActionButton>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
