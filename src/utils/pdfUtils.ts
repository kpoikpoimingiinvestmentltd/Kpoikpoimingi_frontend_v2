/**
 * A4 invoice / receipt PDF — unchanged from pre-thermal behaviour.
 * Thermal 80mm is entirely in thermalPdfUtils.ts.
 */
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { sendReceiptPdfToEmail, trackReceiptDownload } from "@/api/receipt";
import { generateThermalPDF } from "@/utils/thermalPdfUtils";

const A4_WIDTH_PX = 794;

export type ReceiptPdfFormat = "a4" | "thermal";

/**
 * Print uses the browser engine (spaces OK with Poppins).
 * Download uses html2canvas, which drops space glyphs for custom fonts like Poppins.
 * Use Arial in the capture clone only — do not convert spaces to NBSP (that prevents wrapping).
 */
function prepareDownloadCloneForHtml2Canvas(clonedDocument: Document, clonedElement: HTMLElement) {
	const overrideStyle = clonedDocument.createElement("style");
	overrideStyle.textContent = `
		* {
			color: #1f2937 !important;
			border-color: #d1d5db !important;
			/* Poppins breaks space width in html2canvas; print still uses Poppins */
			font-family: Arial, Helvetica, sans-serif !important;
			letter-spacing: 0.01px !important;
			word-spacing: 0.05em !important;
			font-synthesis: initial !important;
			-webkit-font-smoothing: antialiased !important;
		}
		*:not(img):not(svg):not([class*="bg-primary"]):not([class*="bg-card"]) {
			background-color: transparent !important;
		}
		[class*="bg-primary"] {
			background-color: #e8f4fb !important;
		}
		[class*="bg-card"], .receipt-content {
			background-color: #ffffff !important;
			border: none !important;
			box-shadow: none !important;
			display: flex;
			flex-direction: column;
		}
		/* Payment reminder / footer must wrap inside page width (download clone) */
		.receipt-reminder,
		.receipt-reminder * {
			white-space: normal !important;
			overflow-wrap: anywhere !important;
			word-break: break-word !important;
			max-width: 100% !important;
		}
	`;
	clonedDocument.head.appendChild(overrideStyle);

	clonedElement.style.fontFamily = "Arial, Helvetica, sans-serif";
	clonedElement.style.letterSpacing = "0.01px";
	clonedElement.style.wordSpacing = "0.05em";

	// Payment breakdown headers: absolute layout is reliable in html2canvas
	const bgPrimaryHeaders = clonedElement.querySelectorAll<HTMLElement>('div[class*="bg-primary"]');
	bgPrimaryHeaders.forEach((header) => {
		header.style.cssText =
			"background-color:#e8f4fb;border-radius:6px;height:40px;position:relative;overflow:hidden;font-family:Arial,Helvetica,sans-serif;letter-spacing:0.01px;";
		const spans = Array.from(header.querySelectorAll<HTMLElement>("span"));
		if (spans[0]) {
			spans[0].style.cssText =
				"position:absolute;left:16px;top:0;height:40px;line-height:40px;font-size:12px;font-weight:500;white-space:nowrap;color:#1f2937;font-family:Arial,Helvetica,sans-serif;letter-spacing:0.01px;";
		}
		if (spans[1]) {
			spans[1].style.cssText =
				"position:absolute;right:16px;top:0;height:40px;line-height:40px;font-size:12px;font-weight:500;color:#1f2937;font-family:Arial,Helvetica,sans-serif;letter-spacing:0.01px;";
		}
	});
}

export const generatePDF = async (element: HTMLElement, filename: string, isForSharing = false) => {
	if (!element) return null;

	const clone = element.cloneNode(true) as HTMLElement;

	// On-screen (near-invisible): off-screen clones mis-measure custom fonts in html2canvas
	clone.style.position = "fixed";
	clone.style.top = "0";
	clone.style.left = "0";
	clone.style.width = `${A4_WIDTH_PX}px`;
	clone.style.minWidth = `${A4_WIDTH_PX}px`;
	clone.style.maxWidth = `${A4_WIDTH_PX}px`;
	clone.style.overflow = "visible";
	clone.style.zIndex = "2147483646";
	clone.style.pointerEvents = "none";
	clone.style.opacity = "0.01";
	clone.style.backgroundColor = "#ffffff";
	clone.style.fontFamily = "Arial, Helvetica, sans-serif";

	document.body.appendChild(clone);
	void clone.offsetWidth;

	try {
		if (document.fonts?.ready) {
			await document.fonts.ready;
		}
		await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

		const canvas = await html2canvas(clone, {
			useCORS: true,
			allowTaint: true,
			scale: 2,
			backgroundColor: "#ffffff",
			logging: false,
			windowWidth: A4_WIDTH_PX,
			width: A4_WIDTH_PX,
			scrollX: 0,
			scrollY: 0,
			onclone: (clonedDocument, clonedElement) => {
				clonedElement.style.position = "static";
				clonedElement.style.opacity = "1";
				clonedElement.style.width = `${A4_WIDTH_PX}px`;
				clonedElement.style.minWidth = `${A4_WIDTH_PX}px`;
				clonedElement.style.boxSizing = "border-box";
				clonedElement.style.overflow = "visible";
				clonedElement.style.backgroundColor = "#ffffff";

				// Dark-mode colors + html2canvas font/space fixes (download only; print unaffected)
				prepareDownloadCloneForHtml2Canvas(clonedDocument, clonedElement);
			},
		});

		const pdf = new jsPDF("p", "mm", "a4", true);
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const margin = 10;
		const contentWidth = pdfWidth - margin * 2;
		const imgHeight = (canvas.height * contentWidth) / canvas.width;
		const imgData = canvas.toDataURL("image/jpeg", 0.92);

		pdf.addImage(imgData, "JPEG", margin, margin, contentWidth, imgHeight);

		if (isForSharing) {
			const pdfBlob = pdf.output("blob");
			const file = new File([pdfBlob], filename, { type: "application/pdf" });
			return file;
		} else {
			pdf.save(filename);
			return null;
		}
	} catch (err) {
		const errMsg = err instanceof Error ? err.message : String(err);
		console.error("PDF generation failed:", errMsg, err);
		toast.error(`Failed to generate PDF: ${errMsg}`);
		return null;
	} finally {
		document.body.removeChild(clone);
	}
};

function pdfFilename(receiptNumber?: string | number, receiptId?: string | number) {
	return `receipt-${receiptNumber || receiptId || "unknown"}.pdf`;
}

async function generateByFormat(
	element: HTMLElement,
	filename: string,
	format: ReceiptPdfFormat,
	isForSharing: boolean,
) {
	if (format === "thermal") {
		return generateThermalPDF(element, filename, isForSharing);
	}
	return generatePDF(element, filename, isForSharing);
}

export const handleDownloadPDF = async (
	element: HTMLElement,
	receiptNumber?: string | number,
	receiptId?: string | number,
	format: ReceiptPdfFormat = "a4",
) => {
	const filename = pdfFilename(receiptNumber, receiptId);
	await generateByFormat(element, filename, format, false);

	if (receiptId) {
		try {
			await trackReceiptDownload(String(receiptId));
		} catch (err) {
			console.error("Failed to track receipt download:", err);
		}
	}
};

export const handleSharePDF = async (
	element: HTMLElement,
	receiptNumber?: string | number,
	receiptId?: string | number,
	format: ReceiptPdfFormat = "a4",
) => {
	if (!navigator.share) {
		toast.error("Sharing not supported on this device");
		return;
	}

	const filename = pdfFilename(receiptNumber, receiptId);
	const file = await generateByFormat(element, filename, format, true);

	if (file) {
		try {
			await navigator.share({
				title: format === "thermal" ? "Thermal Receipt" : "Receipt",
				text: "Here is your receipt",
				files: [file],
			});
		} catch (err) {
			const errMsg = err instanceof Error ? err.message : String(err);
			toast.error(`Sharing failed: ${errMsg}`);
		}
	}
};

export const handleSendPDFViaEmail = async (
	element: HTMLElement,
	receiptId: string,
	receiptNumber?: string | number,
	recipientEmail?: string,
	format: ReceiptPdfFormat = "a4",
) => {
	if (!element) {
		toast.error("Receipt element not found");
		return false;
	}

	try {
		const loadingToastId = toast.loading("Generating and sending receipt...");
		const filename = pdfFilename(receiptNumber, receiptId);
		const pdfFile = await generateByFormat(element, filename, format, true);

		if (!pdfFile) {
			toast.dismiss(loadingToastId);
			toast.error("Failed to generate PDF");
			return false;
		}

		const reader = new FileReader();
		const pdfBase64 = await new Promise<string>((resolve, reject) => {
			reader.onload = () => {
				const result = reader.result as string;
				resolve(result.split(",")[1]);
			};
			reader.onerror = reject;
			reader.readAsDataURL(pdfFile);
		});

		await sendReceiptPdfToEmail(receiptId, pdfBase64, recipientEmail);

		toast.dismiss(loadingToastId);
		toast.success("Receipt sent via email successfully!");
		return true;
	} catch (err) {
		const errMsg = err instanceof Error ? err.message : String(err);
		console.error("Failed to send receipt via email:", errMsg, err);
		toast.dismiss();
		toast.error(`Failed to send receipt: ${errMsg}`);
		return false;
	}
};
