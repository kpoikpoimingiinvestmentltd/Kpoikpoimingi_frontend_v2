export type ThermalReceiptLine = {
	name: string;
	quantity: number;
	amount?: number | null;
};

export type ThermalPaperWidth = 80 | 58;

export type ThermalReceiptKind = "outright" | "hire_purchase" | "full_payment";

export type ThermalReceiptData = {
	receiptNumber: string;
	dateTime: string;
	customerName?: string | null;
	customerPhone?: string | null;
	customerEmail?: string | null;
	homeAddress?: string | null;
	lines: ThermalReceiptLine[];
	/**
	 * Outright / full-payment thermal: ex-VAT line/payment subtotal.
	 * Hire-purchase thermal: unused for agreement total (see contractTotal).
	 */
	totalAmount?: number | null;
	/**
	 * Outright thermal: gross charged (net + VAT).
	 * Hire-purchase thermal: receipt.amountPaid (A4 "Total Amount Paid" — ex-VAT).
	 */
	amountPaid?: number | null;
	vatAmount?: number | null;
	/**
	 * Hire-purchase only: same formula as A4 "Amount paid plus VAT"
	 * (`amountPaid + vatAmount` when both are present).
	 */
	amountPaidPlusVat?: number | null;
	paymentMethod?: string | null;
	reference?: string | null;
	installmentProgress?: string | null;
	remainingBalance?: number | null;
	issuedByCode?: string | null;
	/** @deprecated Prefer `kind` for presentation. */
	subtitle?: string | null;
	kind?: ThermalReceiptKind;
	contractCode?: string | null;
	/** A4 "Total amount" — contract.property.price */
	contractTotal?: number | null;
	/** A4 "Starting amount" — contract.downPayment */
	startingAmount?: number | null;
	/** A4 payment duration label, e.g. "12 months" */
	paymentDuration?: string | null;
	/** A4 next payment due — receipt.nextPaymentDate */
	nextPaymentDate?: string | null;
	isMigrated?: boolean;
};
