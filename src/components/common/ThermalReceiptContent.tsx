import type { ThermalPaperWidth, ThermalReceiptData } from "@/types/thermalReceipt";

/**
 * Use px (not mm) for layout metrics. html2canvas frequently underestimates
 * box heights when width/padding/font are mixed mm+px, which paints adjacent
 * opaque backgrounds over text and looks like clipping/overlap in the PDF.
 */
const LAYOUT: Record<
	ThermalPaperWidth,
	{ widthPx: number; padX: number; padY: number; fontSize: number; titleSize: number; lineHeight: number }
> = {
	80: { widthPx: 280, padX: 12, padY: 10, fontSize: 11, titleSize: 13, lineHeight: 16 },
	58: { widthPx: 196, padX: 8, padY: 8, fontSize: 10, titleSize: 12, lineHeight: 14 },
};

/** Matches A4 ReceiptHeader office address / contact. */
const OFFICE_ADDRESS = "Block 1 Shop 6 Django House, After the communication Mast, Ndakwo Villa Abuja";
const OFFICE_CONTACT = "+2349017041023";

function money(value?: number | null) {
	if (value == null || Number.isNaN(value)) return "-";
	return `₦${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function parseInstallmentProgress(progress?: string | null) {
	if (!progress) return { covered: 0, total: 0 };
	const match = progress.match(/(\d+)\/(\d+)/);
	if (match) return { covered: Number(match[1]), total: Number(match[2]) };
	return { covered: 0, total: 0 };
}

type Props = {
	data: ThermalReceiptData;
	paperWidth?: ThermalPaperWidth;
};

export default function ThermalReceiptContent({ data, paperWidth = 80 }: Props) {
	const layout = LAYOUT[paperWidth] ?? LAYOUT[80];
	const isHirePurchase = data.kind === "hire_purchase";

	return (
		<div
			className="thermal-receipt"
			data-paper-width={paperWidth}
			style={{
				width: `${layout.widthPx}px`,
				maxWidth: `${layout.widthPx}px`,
				padding: `${layout.padY}px ${layout.padX}px`,
				boxSizing: "border-box",
				fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
				fontSize: `${layout.fontSize}px`,
				lineHeight: `${layout.lineHeight}px`,
				color: "#000000",
				backgroundColor: "#ffffff",
				overflow: "visible",
			}}>
			<header
				style={{
					textAlign: "center",
					paddingBottom: "8px",
					overflow: "visible",
				}}>
				<p
					style={{
						margin: 0,
						padding: 0,
						fontWeight: 700,
						fontSize: `${layout.titleSize}px`,
						lineHeight: `${layout.titleSize + 4}px`,
						wordBreak: "break-word",
						overflowWrap: "anywhere",
					}}>
					Kpoikpoimingi Investments Limited
				</p>
				<p
					style={{
						margin: "4px 0 0",
						padding: 0,
						fontSize: "9px",
						lineHeight: "13px",
						wordBreak: "break-word",
						overflowWrap: "anywhere",
					}}>
					{OFFICE_ADDRESS}
				</p>
				<p style={{ margin: "2px 0 0", padding: 0, fontSize: "9px", lineHeight: "13px" }}>
					{OFFICE_CONTACT}
				</p>
				<p
					style={{
						margin: "8px 0 0",
						padding: 0,
						fontWeight: 700,
						fontSize: isHirePurchase ? "10px" : "11px",
						lineHeight: "15px",
						letterSpacing: isHirePurchase ? "0.04em" : "0.08em",
					}}>
					{isHirePurchase ? "Invoice With Partial Payment" : "RECEIPT"}
				</p>
			</header>

			<Separator />

			<section style={{ padding: "6px 0", overflow: "visible" }}>
				<Row label="No." value={data.receiptNumber} lineHeight={layout.lineHeight} />
				<Row label="Date" value={data.dateTime} lineHeight={layout.lineHeight} />
				{data.contractCode ? (
					<Row label="Contract" value={data.contractCode} lineHeight={layout.lineHeight} />
				) : null}
				{isHirePurchase && data.paymentDuration ? (
					<Row label="Duration" value={data.paymentDuration} lineHeight={layout.lineHeight} />
				) : null}
				{data.customerName ? (
					<Row label="Customer" value={data.customerName} lineHeight={layout.lineHeight} />
				) : null}
				{data.customerPhone ? (
					<Row label="WhatsApp" value={data.customerPhone} lineHeight={layout.lineHeight} />
				) : null}
				{data.customerEmail ? (
					<Row label="Email" value={data.customerEmail} lineHeight={layout.lineHeight} />
				) : null}
				{isHirePurchase && data.homeAddress ? (
					<Row label="Address" value={data.homeAddress} lineHeight={layout.lineHeight} />
				) : null}
			</section>

			<Separator />

			<section style={{ padding: "6px 0", overflow: "visible" }}>
				<p
					style={{
						margin: "0 0 6px",
						padding: 0,
						fontWeight: 700,
						lineHeight: `${layout.lineHeight}px`,
					}}>
					{isHirePurchase ? "Property" : "Items"}
				</p>
				{data.lines.length === 0 ? (
					<p style={{ margin: 0, padding: 0, lineHeight: `${layout.lineHeight}px` }}>-</p>
				) : (
					data.lines.map((line, i) => (
						<div
							key={`${line.name}-${i}`}
							style={{
								paddingBottom: i === data.lines.length - 1 ? 0 : "8px",
								overflow: "visible",
							}}>
							<p
								style={{
									margin: 0,
									padding: 0,
									fontWeight: 600,
									lineHeight: `${layout.lineHeight}px`,
									wordBreak: "break-word",
									overflowWrap: "anywhere",
									whiteSpace: "normal",
								}}>
								{line.name}
							</p>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "flex-start",
									gap: "8px",
									width: "100%",
									marginTop: "2px",
									minHeight: `${layout.lineHeight}px`,
								}}>
								<span style={{ flex: "0 0 auto", lineHeight: `${layout.lineHeight}px` }}>
									Qty {line.quantity}
								</span>
								{line.amount != null ? (
									<span
										style={{
											flex: "1 1 auto",
											minWidth: 0,
											textAlign: "right",
											whiteSpace: "nowrap",
											fontVariantNumeric: "tabular-nums",
											lineHeight: `${layout.lineHeight}px`,
										}}>
										{money(line.amount)}
									</span>
								) : null}
							</div>
						</div>
					))
				)}
			</section>

			<Separator />

			{isHirePurchase ? <HirePurchaseTotals data={data} lineHeight={layout.lineHeight} /> : <StandardTotals data={data} lineHeight={layout.lineHeight} />}

			{(() => {
				const isCash = Boolean(data.paymentMethod?.toUpperCase().includes("CASH"));
				const showRef = Boolean(data.reference) && !isCash;
				if (!data.paymentMethod && !showRef && !data.issuedByCode) return null;
				return (
					<>
						<Separator />
						<section style={{ padding: "6px 0", overflow: "visible" }}>
							{data.paymentMethod ? (
								<Row label="Method" value={data.paymentMethod} lineHeight={layout.lineHeight} />
							) : null}
							{showRef ? (
								<Row label="Ref" value={data.reference!} lineHeight={layout.lineHeight} />
							) : null}
							{data.issuedByCode ? (
								<Row label="Issued by" value={data.issuedByCode} lineHeight={layout.lineHeight} />
							) : null}
						</section>
					</>
				);
			})()}

			<Separator />

			<footer style={{ textAlign: "center", paddingTop: "6px", overflow: "visible" }}>
				<p style={{ margin: 0, padding: 0, fontSize: "10px", lineHeight: "14px" }}>
					{hirePurchaseFooter(data)}
				</p>
			</footer>
		</div>
	);
}

function hirePurchaseFooter(data: ThermalReceiptData) {
	if (data.kind !== "hire_purchase") return "Thank you for your payment";
	if (data.isMigrated) {
		return "Thank you for your payment. We appreciate your business.";
	}
	const { covered, total } = parseInstallmentProgress(data.installmentProgress);
	if (total > 0 && covered === total) {
		return "Thank you for completing all your installment payments.";
	}
	if (data.nextPaymentDate) {
		return `Next payment due ${data.nextPaymentDate}. Late payment attracts accrued interest.`;
	}
	return "Thank you for your payment.";
}

/** Matches A4 Hire Purchase Payment Receipt field meanings. */
function HirePurchaseTotals({ data, lineHeight }: { data: ThermalReceiptData; lineHeight: number }) {
	return (
		<section style={{ padding: "6px 0", overflow: "visible" }}>
			{data.contractTotal != null ? (
				<Row label="Contract total" value={money(data.contractTotal)} lineHeight={lineHeight} nowrapValue />
			) : null}
			{data.startingAmount != null ? (
				<Row label="Starting amt" value={money(data.startingAmount)} lineHeight={lineHeight} nowrapValue />
			) : null}
			{data.amountPaid != null ? (
				<Row label="Amount paid" value={money(data.amountPaid)} lineHeight={lineHeight} nowrapValue />
			) : null}
			{data.vatAmount != null ? (
				<Row label="VAT" value={money(data.vatAmount)} lineHeight={lineHeight} nowrapValue />
			) : null}
			{data.amountPaidPlusVat != null ? (
				<Row label="Paid + VAT" value={money(data.amountPaidPlusVat)} lineHeight={lineHeight} strong nowrapValue />
			) : null}
			{data.installmentProgress ? (
				<Row label="Installments" value={data.installmentProgress} lineHeight={lineHeight} nowrapValue />
			) : null}
			{data.remainingBalance != null ? (
				<Row label="Balance" value={money(data.remainingBalance)} lineHeight={lineHeight} nowrapValue />
			) : null}
			{data.nextPaymentDate && !data.isMigrated ? (
				<Row label="Next due" value={data.nextPaymentDate} lineHeight={lineHeight} nowrapValue />
			) : null}
		</section>
	);
}

function StandardTotals({ data, lineHeight }: { data: ThermalReceiptData; lineHeight: number }) {
	return (
		<section style={{ padding: "6px 0", overflow: "visible" }}>
			{data.totalAmount != null ? (
				<Row label="Subtotal" value={money(data.totalAmount)} lineHeight={lineHeight} nowrapValue />
			) : null}
			{data.vatAmount != null ? (
				<Row label="VAT" value={money(data.vatAmount)} lineHeight={lineHeight} nowrapValue />
			) : null}
			<Row label="Total paid" value={money(data.amountPaid)} lineHeight={lineHeight} strong nowrapValue />
		</section>
	);
}

function Separator() {
	return (
		<div
			aria-hidden
			style={{
				display: "block",
				width: "100%",
				height: 0,
				border: "none",
				borderTop: "1px dashed #000000",
				margin: "4px 0",
				padding: 0,
				background: "transparent",
			}}
		/>
	);
}

function Row({
	label,
	value,
	strong,
	nowrapValue,
	lineHeight,
}: {
	label: string;
	value: string;
	strong?: boolean;
	nowrapValue?: boolean;
	lineHeight: number;
}) {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "flex-start",
				gap: "8px",
				width: "100%",
				padding: "2px 0",
				overflow: "visible",
				background: "transparent",
			}}>
			<span
				style={{
					flex: "0 0 auto",
					maxWidth: "42%",
					lineHeight: `${lineHeight}px`,
					background: "transparent",
				}}>
				{label}
			</span>
			<span
				style={{
					flex: "1 1 auto",
					minWidth: 0,
					textAlign: "right",
					fontWeight: strong ? 700 : 400,
					fontVariantNumeric: "tabular-nums",
					lineHeight: `${lineHeight}px`,
					background: "transparent",
					...(nowrapValue
						? { whiteSpace: "nowrap" }
						: { wordBreak: "break-word", overflowWrap: "anywhere", whiteSpace: "normal" }),
				}}>
				{value}
			</span>
		</div>
	);
}
