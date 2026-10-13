import { useRef } from "react";
import CustomCard from "@/components/base/CustomCard";
import PageTitles from "@/components/common/PageTitles";
import KeyValueRow from "@/components/common/KeyValueRow";
import Badge from "@/components/base/Badge";
import ActionButton from "@/components/base/ActionButton";
import Image from "@/components/base/Image";
import ThermalReceiptContent from "@/components/common/ThermalReceiptContent";
import { RectangleSkeleton } from "@/components/common/Skeleton";
import { useGetOutrightSaleById, type OutrightSaleProperty } from "@/api/outrightSale";
import { _router } from "@/routes/_router";
import { media } from "@/resources/images";
import { isOutrightSalePaid, thermalDataFromOutrightSale } from "@/utils/thermalReceiptData";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import { IconWrapper, PrinterIcon } from "@/assets/icons";

function formatMoney(value?: string | number | null) {
	const n = Number(value ?? 0);
	if (!Number.isFinite(n)) return "₦0";
	return `₦${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function formatDate(value?: string | null) {
	if (!value) return "-";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "-";
	return d.toLocaleString("en-NG", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function propertyBrief(property?: OutrightSaleProperty | null) {
	if (!property) return [];
	const bits: string[] = [];
	if (property.propertyCode) bits.push(property.propertyCode);
	if (property.category?.category) bits.push(property.category.category);
	if (property.condition) bits.push(property.condition);
	if (property.status?.status) bits.push(property.status.status);

	const vehicleBits = [
		property.vehicleMake,
		property.vehicleModel,
		property.vehicleYear ? String(property.vehicleYear) : null,
		property.vehicleColor,
		property.vehicleRegistrationNumber,
	].filter(Boolean);
	if (vehicleBits.length) bits.push(vehicleBits.join(" · "));

	return bits;
}

const THERMAL_80_PAGE_STYLE = `
	@page {
		size: 80mm auto;
		margin: 0;
	}
	html, body {
		margin: 0 !important;
		padding: 0 !important;
		width: 80mm;
		height: auto !important;
		background: #fff;
		-webkit-print-color-adjust: exact;
		print-color-adjust: exact;
		overflow: visible !important;
	}
	.thermal-receipt {
		width: 280px !important;
		max-width: 280px !important;
		margin: 0 auto !important;
		box-sizing: border-box !important;
		overflow: visible !important;
		height: auto !important;
	}
`;

export default function OutrightSaleDetails() {
	const { id } = useParams<{ id: string }>();
	const { data: sale, isLoading } = useGetOutrightSaleById(id);
	const paymentLink = sale?.paymentLink?.trim() || "";
	const paid = sale ? isOutrightSalePaid(sale) : false;
	const thermalRef = useRef<HTMLDivElement>(null);
	const qrSrc = paymentLink
		? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(paymentLink)}`
		: "";

	const handlePrintThermal = useReactToPrint({
		contentRef: thermalRef,
		documentTitle: "Outright-Sale-Thermal-80mm",
		pageStyle: THERMAL_80_PAGE_STYLE,
	});

	const handleCopy = async () => {
		if (!paymentLink || !navigator?.clipboard) return;
		await navigator.clipboard.writeText(paymentLink);
		toast.info("Payment link copied");
	};

	if (isLoading) {
		return (
			<div className="flex flex-col gap-y-6 w-full">
				<header>
					<PageTitles title="Outright Sale" description="Sale details" />
				</header>
				<CustomCard className="bg-white w-full rounded-lg p-4 md:p-6 border border-gray-100 space-y-4">
					{Array.from({ length: 8 }).map((_, i) => (
						<div key={i} className="flex justify-between gap-4">
							<RectangleSkeleton className="w-1/4 h-4" />
							<RectangleSkeleton className="w-1/2 h-4" />
						</div>
					))}
				</CustomCard>
			</div>
		);
	}

	if (!sale) {
		return (
			<div className="flex flex-col gap-y-6 w-full">
				<div className="flex flex-col items-center justify-center min-h-72 gap-3">
					<p className="text-muted-foreground">Outright sale not found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-y-6 w-full">
			<header className="flex items-start justify-between flex-wrap gap-4">
				<PageTitles title="Outright Sale" description={`Sale for ${sale.customerName}`} />
				<div className="flex items-center gap-2 flex-wrap">
					{paid && sale.receipt?.id ? (
						<Link to={_router.dashboard.receiptDetails.replace(":id", sale.receipt.id)}>
							<ActionButton variant="outline" className="w-max" type="button">
								View Receipt
							</ActionButton>
						</Link>
					) : null}
					{paid && !sale.receipt?.id ? (
						<ActionButton
							variant="outline"
							className="w-max"
							onClick={() => handlePrintThermal()}
							type="button">
							<span className="inline-flex items-center gap-2">
								<IconWrapper>
									<PrinterIcon />
								</IconWrapper>
								Print Thermal Receipt
							</span>
						</ActionButton>
					) : null}
					<Badge
						value={paid ? "paid" : "pending"}
						label={paid ? "Paid" : "Awaiting payment"}
						status={paid ? "paid" : "pending"}
						size="sm"
					/>
				</div>
			</header>

			<CustomCard className="bg-white w-full rounded-lg p-4 md:p-6 border border-gray-100 space-y-1">
				<KeyValueRow label="Customer" value={sale.customerName} />
				<KeyValueRow label="Email" value={sale.customerEmail || "-"} />
				<KeyValueRow label="Phone" value={sale.customerPhone || "-"} />
				<KeyValueRow label="Payment method" value={sale.paymentMethod?.method || "-"} />
				<KeyValueRow label="Sale price (ex-VAT)" value={formatMoney(sale.salePrice)} />
				<KeyValueRow label="Sale price with VAT" value={formatMoney(sale.salePriceWithVat)} />
				<KeyValueRow label="Created" value={formatDate(sale.createdAt)} />
				<KeyValueRow label="Paid at" value={formatDate(sale.paidAt)} />
			</CustomCard>

			{paymentLink ? (
				<CustomCard className="bg-white w-full rounded-lg p-4 md:p-6 border border-gray-100 space-y-4">
					<h3 className="font-medium">Payment QR code</h3>
					<div className="flex flex-col sm:flex-row gap-6 items-start">
						<img
							src={qrSrc}
							alt="Payment QR code"
							width={220}
							height={220}
							referrerPolicy="no-referrer"
							className="w-[220px] h-[220px] rounded-md border border-stone-200 bg-white p-2 shrink-0"
						/>
						<div className="flex-1 min-w-0 space-y-3">
							<p className="text-sm text-muted-foreground">
								{paid
									? "Payment link used for this sale."
									: "Customer can scan this QR code or open the link to pay."}
							</p>
							<p className="text-sm [word-break:break-all]">
								<a href={paymentLink} target="_blank" rel="noopener noreferrer" className="text-primary underline">
									{paymentLink}
								</a>
							</p>
							<div className="flex flex-wrap gap-2">
								<ActionButton variant="outline" onClick={handleCopy} className="w-max">
									Copy link
								</ActionButton>
								<a href={paymentLink} target="_blank" rel="noopener noreferrer">
									<ActionButton className="w-max">Open link</ActionButton>
								</a>
							</div>
						</div>
					</div>
				</CustomCard>
			) : null}

			<CustomCard className="bg-white w-full rounded-lg p-4 md:p-6 border border-gray-100">
				<h3 className="font-medium mb-4">Properties</h3>
				<div className="space-y-4">
					{(sale.items || []).map((item) => {
						const property = item.property;
						const imgSrc = property?.media?.[0] || media.images._product1;
						const brief = propertyBrief(property);
						const description = property?.description?.trim();

						return (
							<div
								key={item.id}
								className="flex flex-col sm:flex-row gap-4 border-b border-border last:border-0 pb-4 last:pb-0">
								<div className="w-full sm:w-28 h-28 shrink-0 overflow-hidden rounded bg-muted/40">
									<Image src={imgSrc} alt={property?.name || "Property"} className="w-full h-full" />
								</div>
								<div className="flex-1 min-w-0 flex flex-col gap-1">
									<div className="flex items-start justify-between gap-3 flex-wrap">
										<div className="min-w-0">
											{property?.id ? (
												<Link
													to={_router.dashboard.propertiesDetails(property.id)}
													className="text-sm font-medium text-primary hover:underline line-clamp-2">
													{property.name || "Property"}
												</Link>
											) : (
												<p className="text-sm font-medium line-clamp-2">{property?.name || item.propertyId}</p>
											)}
											{brief.length > 0 && (
												<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{brief.join(" · ")}</p>
											)}
										</div>
										<div className="text-right shrink-0">
											<p className="text-sm font-semibold">{formatMoney(item.salePrice)}</p>
											<p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
										</div>
									</div>
									{description && (
										<p className="text-xs text-muted-foreground line-clamp-2 mt-1">{description}</p>
									)}
									{property?.price != null && (
										<p className="text-xs text-muted-foreground">
											Listing price {formatMoney(property.price)}
										</p>
									)}
								</div>
							</div>
						);
					})}
					{!(sale.items || []).length && <p className="text-sm text-muted-foreground">No line items</p>}
				</div>
			</CustomCard>

			{paid && !sale.receipt?.id ? (
				<div
					aria-hidden
					className="pointer-events-none"
					style={{
						position: "fixed",
						left: 0,
						top: 0,
						width: "280px",
						opacity: 0,
						zIndex: -1,
						overflow: "visible",
					}}>
					<div ref={thermalRef} style={{ width: "280px", overflow: "visible" }}>
						<ThermalReceiptContent data={thermalDataFromOutrightSale(sale)} paperWidth={80} />
					</div>
				</div>
			) : null}
		</div>
	);
}
