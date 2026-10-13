import type { ReceiptDetail } from "@/types/receipt";
import type { OutrightSaleResponse } from "@/api/outrightSale";
import type { ThermalReceiptData, ThermalReceiptKind, ThermalReceiptLine } from "@/types/thermalReceipt";

function formatDateTime(value?: string | null) {
	if (!value) return "-";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "-";
	return d.toLocaleString("en-GB", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function formatDateOnly(value?: string | null) {
	if (!value) return null;
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return null;
	return d.toLocaleDateString("en-GB");
}

function formatPaymentMethod(
	method?: string | { id?: number; method?: string } | null,
	fallbackId?: number | null,
) {
	if (typeof method === "string" && method.trim()) {
		return method.replace(/_/g, " ").toUpperCase();
	}
	if (method && typeof method === "object" && method.method) {
		return String(method.method).replace(/_/g, " ").toUpperCase();
	}
	if (fallbackId != null) {
		return `METHOD #${fallbackId}`;
	}
	return null;
}

function toNumber(value?: string | number | null): number | null {
	if (value == null || value === "") return null;
	const n = Number(value);
	return Number.isNaN(n) ? null : n;
}

function customerHomeAddress(receipt: ReceiptDetail): string | null {
	return (
		receipt.customer?.homeAddress ??
		receipt.customer?.address ??
		receipt.customer?.registrations?.[0]?.homeAddress ??
		null
	);
}

/** Same condition as A4 KeyValueRow for "Amount paid plus VAT". */
function amountPaidPlusVatFromReceipt(receipt: ReceiptDetail): number | null {
	if (receipt.amountPaid && receipt.vatAmount) {
		return Number(receipt.amountPaid) + Number(receipt.vatAmount);
	}
	return null;
}

function paymentDurationLabel(receipt: ReceiptDetail): string | null {
	const value = receipt.contract?.durationValue ?? receipt.totalInstallments;
	if (value == null) return null;
	const unitRaw = receipt.contract?.durationUnit?.duration?.toLowerCase();
	const unit = unitRaw === "weeks" ? "weeks" : "months";
	return `${value} ${unit}`;
}

/** Outright: line amounts are this sale's item totals (ex-VAT). */
function outrightLines(receipt: ReceiptDetail): ThermalReceiptLine[] {
	if (receipt.propertiesBreakdown && receipt.propertiesBreakdown.length > 0) {
		return receipt.propertiesBreakdown.map((p) => ({
			name: p.name,
			quantity: p.quantity,
			amount: p.subtotal,
		}));
	}
	const name = receipt.propertyName;
	if (name) {
		return [
			{
				name,
				quantity: 1,
				amount: toNumber(receipt.amountPaid),
			},
		];
	}
	return [];
}

/**
 * Hire purchase property rows: names/qty for context only.
 * Do not print catalogue prices as this installment's line amounts
 * (A4 shows property name separately from payment figures).
 */
function hirePurchaseLines(receipt: ReceiptDetail): ThermalReceiptLine[] {
	if (receipt.propertiesBreakdown && receipt.propertiesBreakdown.length > 0) {
		return receipt.propertiesBreakdown.map((p) => ({
			name: p.name,
			quantity: p.quantity,
			amount: null,
		}));
	}
	if (receipt.contract?.propertyInterestRequests?.length) {
		return receipt.contract.propertyInterestRequests.map((p) => {
			const name = p.isCustomProperty
				? (p.customPropertyName ?? "Custom Property")
				: (p.property?.name ?? "-");
			return {
				name,
				quantity: p.quantity || 1,
				amount: null,
			};
		});
	}
	const name = receipt.contract?.property?.name ?? receipt.propertyName;
	if (name) {
		return [{ name, quantity: 1, amount: null }];
	}
	return [];
}

function resolveKind(receipt: ReceiptDetail): ThermalReceiptKind {
	const isOutright =
		receipt.transactionType === "outright_sale" || Boolean(receipt.outrightSaleId || receipt.outrightSale);
	if (isOutright) return "outright";
	const isFullPayment = !receipt.totalInstallments || receipt.totalInstallments === 1;
	return isFullPayment ? "full_payment" : "hire_purchase";
}

/**
 * Maps receipt records using the same field meanings as A4 ReceiptContent.
 *
 * Hire-purchase (partial) A4:
 * - Total amount        → contract.property.price
 * - Starting amount     → contract.downPayment
 * - Amount paid plus VAT → amountPaid + vatAmount (when both present)
 * - Total Amount Paid   → amountPaid
 * - Installment covered → installmentProgress
 * - Remaining balance   → contract.outStandingBalance
 * - Next payment due    → nextPaymentDate
 */
export function thermalDataFromReceipt(receipt: ReceiptDetail): ThermalReceiptData {
	const kind = resolveKind(receipt);
	const isOutright = kind === "outright";
	const isHirePurchase = kind === "hire_purchase";

	const net = toNumber(receipt.amountPaid);
	const vat = toNumber(receipt.vatAmount);
	const receiptGross = toNumber(receipt.totalAmount);
	const plusVat = amountPaidPlusVatFromReceipt(receipt);

	const remaining = toNumber(receipt.contract?.outStandingBalance ?? null);
	const contractTotal = toNumber(receipt.contract?.property?.price ?? null);
	const startingAmount = toNumber(receipt.contract?.downPayment ?? null);

	if (isOutright || kind === "full_payment") {
		// Outright / one-time: thermal shows subtotal (net) and total paid (gross).
		const gross = receiptGross ?? plusVat ?? net;
		return {
			receiptNumber: String(receipt.receiptNumber ?? receipt.id),
			dateTime: formatDateTime(receipt.paymentDate ?? receipt.createdAt),
			customerName: receipt.customer?.fullName ?? receipt.outrightSale?.customerName ?? null,
			customerPhone: receipt.customer?.phoneNumber ?? receipt.outrightSale?.customerPhone ?? null,
			customerEmail: receipt.customer?.email ?? receipt.outrightSale?.customerEmail ?? null,
			homeAddress: customerHomeAddress(receipt),
			lines: isOutright ? outrightLines(receipt) : hirePurchaseLines(receipt),
			totalAmount: net,
			amountPaid: gross,
			vatAmount: vat,
			amountPaidPlusVat: plusVat,
			paymentMethod: formatPaymentMethod(receipt.paymentMethod, receipt.paymentMethodId),
			reference: receipt.payment?.reference ?? receipt.outrightSale?.paymentReference ?? null,
			installmentProgress: null,
			remainingBalance: null,
			issuedByCode: receipt.issuedBy?.staffCode ?? null,
			kind,
			subtitle: isOutright ? "Outright Sale" : "Full Payment",
		};
	}

	return {
		receiptNumber: String(receipt.receiptNumber ?? receipt.id),
		dateTime: formatDateOnly(receipt.paymentDate ?? receipt.createdAt) ?? formatDateTime(receipt.paymentDate ?? receipt.createdAt),
		customerName: receipt.customer?.fullName ?? null,
		customerPhone: receipt.customer?.phoneNumber ?? null,
		customerEmail: receipt.customer?.email ?? null,
		homeAddress: customerHomeAddress(receipt),
		lines: hirePurchaseLines(receipt),
		// Align labels with A4 HP invoice meanings:
		totalAmount: null,
		amountPaid: net, // A4 "Total Amount Paid"
		vatAmount: vat,
		amountPaidPlusVat: plusVat, // A4 "Amount paid plus VAT"
		paymentMethod: formatPaymentMethod(receipt.paymentMethod, receipt.paymentMethodId),
		reference: receipt.payment?.reference ?? null,
		installmentProgress: receipt.installmentProgress ?? null,
		remainingBalance: remaining,
		issuedByCode: receipt.issuedBy?.staffCode ?? null,
		kind: "hire_purchase",
		contractCode: receipt.contract?.contractCode ?? null,
		contractTotal,
		startingAmount,
		paymentDuration: paymentDurationLabel(receipt),
		nextPaymentDate: formatDateOnly(receipt.nextPaymentDate),
		isMigrated: receipt.customer?.isMigrated ?? false,
		subtitle: "Invoice With Partial Payment",
	};
}

export function thermalDataFromOutrightSale(sale: OutrightSaleResponse): ThermalReceiptData {
	const lines: ThermalReceiptLine[] = (sale.items ?? []).map((item) => ({
		name: item.property?.name ?? item.propertyId,
		quantity: item.quantity,
		amount: item.salePrice != null ? Number(item.salePrice) : null,
	}));

	const withVat = sale.salePriceWithVat != null ? Number(sale.salePriceWithVat) : null;
	const net = sale.salePrice != null ? Number(sale.salePrice) : null;
	const vat = net != null && withVat != null ? Math.max(0, withVat - net) : null;

	return {
		receiptNumber: sale.paymentReference ?? sale.id.slice(0, 8).toUpperCase(),
		dateTime: formatDateTime(sale.paidAt ?? sale.createdAt),
		customerName: sale.customerName ?? null,
		customerPhone: sale.customerPhone ?? null,
		customerEmail: sale.customerEmail ?? null,
		lines,
		totalAmount: net,
		amountPaid: withVat ?? net,
		vatAmount: vat,
		amountPaidPlusVat: net != null && vat != null ? net + vat : withVat,
		paymentMethod: formatPaymentMethod(sale.paymentMethod),
		reference: sale.paymentReference ?? null,
		issuedByCode: null,
		kind: "outright",
		subtitle: "Outright Sale",
	};
}

export function isOutrightSalePaid(sale: OutrightSaleResponse): boolean {
	if (sale.paidAt) return true;
	const link = sale.paymentLink?.trim();
	return !link;
}
