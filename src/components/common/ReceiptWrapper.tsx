import CustomCard from "@/components/base/CustomCard";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import ReceiptActions from "@/components/common/ReceiptActions";
import ThermalReceiptContent from "@/components/common/ThermalReceiptContent";
import type { ReceiptDetail } from "@/types/receipt";
import { thermalDataFromReceipt } from "@/utils/thermalReceiptData";
import React, { useCallback, useRef } from "react";
import {
	handleDownloadPDF,
	handleSendPDFViaEmail,
	handleSharePDF,
	type ReceiptPdfFormat,
} from "@/utils/pdfUtils";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";

/** A4 print only — never share styles with thermal. */
const A4_PAGE_STYLE = `
	@page {
		margin: 10mm;
		size: A4;
	}
	body {
		margin: 0;
		padding: 0;
		zoom: 1;
	}
`;

/** Thermal print only (react-to-print pageStyle on thermalRef). */
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
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
	}
`;

export default function ReceiptWrapper({
	children,
	shouldPrint = true,
	shouldShare = true,
	shouldDownload = true,
	onPrint,
	contentRef,
	receiptId,
	adminIssuerLabel,
	receipt,
}: {
	children: React.ReactNode;
	emailSubject?: string;
	emailBody?: string;
	shouldPrint?: boolean;
	shouldShare?: boolean;
	shouldDownload?: boolean;
	/** @deprecated A4 download now uses the same printRef as Print A4. */
	onDownload?: () => void;
	onPrint?: () => void;
	/** @deprecated A4 share now uses the same printRef as Print A4. */
	onShare?: () => void;
	contentRef?: React.Ref<HTMLDivElement>;
	receiptId?: string;
	adminIssuerLabel?: string | null;
	receipt?: ReceiptDetail | null;
}) {
	const printRef = useRef<HTMLDivElement>(null);
	const thermalRef = useRef<HTMLDivElement>(null);

	const handlePrintA4 = useReactToPrint({
		contentRef: printRef,
		documentTitle: "Receipt",
		pageStyle: A4_PAGE_STYLE,
		onAfterPrint: () => {
			onPrint?.();
		},
	});

	const handlePrintThermal = useReactToPrint({
		contentRef: thermalRef,
		documentTitle: "Receipt-Thermal-80mm",
		pageStyle: THERMAL_80_PAGE_STYLE,
		onAfterPrint: () => {
			onPrint?.();
		},
	});

	const receiptNumber = receipt?.receiptNumber;
	const idForPdf = receiptId || receipt?.id;

	/** Same DOM node as Print A4 — keeps download identical to print. */
	const resolveA4Element = useCallback(() => printRef.current, []);

	const runDownload = useCallback(
		async (format: ReceiptPdfFormat) => {
			const el = format === "thermal" ? thermalRef.current : resolveA4Element();
			if (!el) {
				toast.error(format === "thermal" ? "Thermal receipt not available" : "Receipt content not available");
				return;
			}

			await handleDownloadPDF(el, receiptNumber, idForPdf, format);
		},
		[idForPdf, receiptNumber, resolveA4Element],
	);

	const runDeviceShare = useCallback(
		async (format: ReceiptPdfFormat) => {
			const el = format === "thermal" ? thermalRef.current : resolveA4Element();
			if (!el) {
				toast.error(format === "thermal" ? "Thermal receipt not available" : "Receipt content not available");
				return;
			}

			await handleSharePDF(el, receiptNumber, idForPdf, format);
		},
		[idForPdf, receiptNumber, resolveA4Element],
	);

	const runEmailShare = useCallback(
		async (format: ReceiptPdfFormat) => {
			if (!idForPdf) {
				toast.error("Receipt ID not available");
				return;
			}

			const el = format === "thermal" ? thermalRef.current : resolveA4Element();
			if (!el) {
				toast.error(format === "thermal" ? "Thermal receipt not available" : "Receipt content not available");
				return;
			}

			await handleSendPDFViaEmail(el, String(idForPdf), receiptNumber, undefined, format);
		},
		[idForPdf, receiptNumber, resolveA4Element],
	);

	const thermalData = receipt ? thermalDataFromReceipt(receipt) : null;

	const shareItems = [
		{
			label: "Email",
			src: media.images.gmail,
			onSelectA4: () => void runEmailShare("a4"),
			...(thermalData ? { onSelectThermal: () => void runEmailShare("thermal") } : {}),
		},
		{
			label: "Whatsapp",
			src: media.images.whatsapp,
			onSelectA4: () => void runDeviceShare("a4"),
			...(thermalData ? { onSelectThermal: () => void runDeviceShare("thermal") } : {}),
		},
	];

	return (
		<>
			<div id="receipt-container">
				<CustomCard className="receipt-wrapper-outer border-0 bg-transparent dark:bg-transparent px-0 py-4">
					<div className="max-w-4xl mx-auto flex flex-col gap-y-6 w-full px-3 md:px-0">
						<header className="receipt-header w-full mx-auto flex justify-between items-center gap-x-4 gap-y-3 flex-wrap">
							<div className="flex flex-col gap-0.5">
								<h2 className="text-lg font-medium">Receipt</h2>
								{adminIssuerLabel ? (
									<p className="text-xs sm:text-sm text-muted-foreground">
										Issued by <span className="font-medium text-foreground">{adminIssuerLabel}</span>
									</p>
								) : null}
							</div>
							<div className="receipt-actions flex items-center gap-2">
								<ReceiptActions
									showPrint={shouldPrint}
									onPrint={() => handlePrintA4()}
									onPrintA4={() => handlePrintA4()}
									onPrintThermal={thermalData ? () => handlePrintThermal() : undefined}
									showShare={shouldShare}
									showDownload={shouldDownload}
									onDownload={() => void runDownload("a4")}
									onDownloadA4={() => void runDownload("a4")}
									onDownloadThermal={thermalData ? () => void runDownload("thermal") : undefined}
									shareItems={shareItems}
								/>
							</div>
						</header>
						{/* A4 invoice only — ReceiptContent children; print/download use printRef */}
						<main className="receipt-main flex justify-center w-full">
							<CustomCard ref={printRef} className="receipt-content relative shadow-lg isolate py-6 px-4 md:px-8 w-full">
								<Image src={media.images.verticalCuts} className="w-11/12 mx-auto absolute right-0 left-0 top-0 dark:opacity-10" />
								<Image src={media.images.verticalCuts} className="w-11/12 mx-auto absolute right-0 left-0 bottom-0 -rotate-x-180 dark:opacity-10" />
								<div ref={contentRef}>{children}</div>
							</CustomCard>
						</main>
					</div>
				</CustomCard>
			</div>

			{/* Separate 80mm thermal tree — ThermalReceiptContent + thermalPdfUtils; never shares A4 DOM/CSS */}
			{thermalData ? (
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
						<ThermalReceiptContent data={thermalData} paperWidth={80} />
					</div>
				</div>
			) : null}
		</>
	);
}
