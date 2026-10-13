import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { sendReceiptPdfToEmail, trackReceiptDownload } from "@/api/receipt";

const A4_WIDTH_PX = 794;
/** 74mm printable content at 96dpi (80mm paper − ~3mm L/R padding) */
const THERMAL_80_CONTENT_WIDTH_PX = 280;

export type ReceiptPdfFormat = "a4" | "thermal";

/**
 * html2canvas cannot parse modern CSS color functions (oklch/oklab/lab/lch)
 * used by Tailwind v4 / shadcn themes. Strip theme stylesheets from the clone
 * before capture and rely on our injected hex-only overrides + inline styles.
 */
function stripThemeStylesheets(clonedDocument: Document) {
	clonedDocument.querySelectorAll("style, link[rel='stylesheet']").forEach((el) => {
		el.remove();
	});
}

/**
 * Paint safe colors without opaque backgrounds on nested nodes.
 * Forcing white backgrounds on every child makes html2canvas clip/overlap
 * text when it underestimates line boxes.
 */
function forceThermalSafeColors(root: HTMLElement) {
	root.style.setProperty("color", "#000000", "important");
	root.style.setProperty("background-color", "#ffffff", "important");
	root.style.setProperty("box-shadow", "none", "important");

	const walk = (el: HTMLElement) => {
		if (el !== root) {
			el.style.setProperty("color", "#000000", "important");
			el.style.setProperty("background-color", "transparent", "important");
			el.style.setProperty("box-shadow", "none", "important");
			el.style.setProperty("text-shadow", "none", "important");
		}
		el.style.setProperty("overflow", "visible", "important");
		Array.from(el.children).forEach((child) => {
			if (child instanceof HTMLElement) walk(child);
		});
	};
	walk(root);
}

async function captureElementToCanvas(
	element: HTMLElement,
	widthPx: number,
	onClone?: (clonedDocument: Document, clonedElement: HTMLElement) => void,
	options?: { placeOnscreen?: boolean },
) {
	const clone = element.cloneNode(true) as HTMLElement;

	// Place on-screen for accurate font metrics. Off-screen (-9999px) captures
	// often under-measure line boxes with monospace fonts in html2canvas.
	clone.style.position = "fixed";
	clone.style.top = options?.placeOnscreen ? "0" : "-9999px";
	clone.style.left = options?.placeOnscreen ? "0" : "-9999px";
	clone.style.width = `${widthPx}px`;
	clone.style.minWidth = `${widthPx}px`;
	clone.style.maxWidth = `${widthPx}px`;
	clone.style.height = "auto";
	clone.style.overflow = "visible";
	clone.style.zIndex = options?.placeOnscreen ? "2147483646" : "-1";
	clone.style.pointerEvents = "none";
	clone.style.backgroundColor = "#ffffff";
	if (options?.placeOnscreen) {
		clone.style.opacity = "0.01";
	}

	document.body.appendChild(clone);
	void clone.offsetWidth;
	const captureHeight = Math.max(clone.scrollHeight, clone.offsetHeight, 1);

	try {
		return await html2canvas(clone, {
			useCORS: true,
			allowTaint: true,
			scale: 2,
			backgroundColor: "#ffffff",
			logging: false,
			windowWidth: widthPx,
			windowHeight: captureHeight,
			width: widthPx,
			height: captureHeight,
			scrollX: 0,
			scrollY: 0,
			x: 0,
			y: 0,
			onclone: (clonedDocument, clonedElement) => {
				stripThemeStylesheets(clonedDocument);
				clonedElement.style.position = "static";
				clonedElement.style.top = "auto";
				clonedElement.style.left = "auto";
				clonedElement.style.opacity = "1";
				clonedElement.style.width = `${widthPx}px`;
				clonedElement.style.minWidth = `${widthPx}px`;
				clonedElement.style.maxWidth = `${widthPx}px`;
				clonedElement.style.height = "auto";
				clonedElement.style.boxSizing = "border-box";
				clonedElement.style.overflow = "visible";
				onClone?.(clonedDocument, clonedElement);
			},
		});
	} finally {
		document.body.removeChild(clone);
	}
}

function applyA4CloneOverrides(clonedDocument: Document, clonedElement: HTMLElement) {
	const overrideStyle = clonedDocument.createElement("style");
	overrideStyle.textContent = `
		* {
			color: #1f2937 !important;
			border-color: #d1d5db !important;
			font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
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
		.flex { display: flex !important; }
		.flex-col { flex-direction: column !important; }
		.items-center { align-items: center !important; }
		.justify-between { justify-content: space-between !important; }
		.justify-center { justify-content: center !important; }
		.grid { display: grid !important; }
		.w-full { width: 100% !important; }
		.text-center { text-align: center !important; }
		.text-right { text-align: right !important; }
		.font-medium { font-weight: 500 !important; }
		.font-semibold { font-weight: 600 !important; }
		.font-bold { font-weight: 700 !important; }
	`;
	clonedDocument.head.appendChild(overrideStyle);

	clonedElement.style.backgroundColor = "#ffffff";
	clonedElement.style.color = "#1f2937";

	const bgPrimaryHeaders = clonedElement.querySelectorAll<HTMLElement>('div[class*="bg-primary"]');
	bgPrimaryHeaders.forEach((header) => {
		header.style.cssText =
			"background-color:#e8f4fb;border-radius:6px;height:40px;position:relative;overflow:hidden;";
		const spans = Array.from(header.querySelectorAll<HTMLElement>("span"));
		if (spans[0]) {
			spans[0].style.cssText =
				"position:absolute;left:16px;top:0;height:40px;line-height:40px;font-size:12px;font-weight:500;white-space:nowrap;color:#1f2937;";
		}
		if (spans[1]) {
			spans[1].style.cssText =
				"position:absolute;right:16px;top:0;height:40px;line-height:40px;font-size:12px;font-weight:500;color:#1f2937;";
		}
	});
}

function applyThermalCloneOverrides(clonedDocument: Document, clonedElement: HTMLElement) {
	const overrideStyle = clonedDocument.createElement("style");
	overrideStyle.textContent = `
		html, body {
			margin: 0 !important;
			padding: 0 !important;
			background: #ffffff !important;
		}
		.thermal-receipt {
			width: ${THERMAL_80_CONTENT_WIDTH_PX}px !important;
			max-width: ${THERMAL_80_CONTENT_WIDTH_PX}px !important;
			margin: 0 !important;
			box-sizing: border-box !important;
			overflow: visible !important;
			background-color: #ffffff !important;
			color: #000000 !important;
			font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
		}
		.thermal-receipt * {
			background-color: transparent !important;
			box-shadow: none !important;
			text-shadow: none !important;
			overflow: visible !important;
		}
	`;
	clonedDocument.head.appendChild(overrideStyle);

	const thermalRoot = clonedElement.classList.contains("thermal-receipt")
		? clonedElement
		: clonedElement.querySelector<HTMLElement>(".thermal-receipt") || clonedElement;

	thermalRoot.style.width = `${THERMAL_80_CONTENT_WIDTH_PX}px`;
	thermalRoot.style.maxWidth = `${THERMAL_80_CONTENT_WIDTH_PX}px`;
	thermalRoot.style.boxSizing = "border-box";
	thermalRoot.style.overflow = "visible";
	thermalRoot.style.margin = "0";
	thermalRoot.style.height = "auto";

	forceThermalSafeColors(thermalRoot);
}

function finishPdf(
	pdf: jsPDF,
	filename: string,
	isForSharing: boolean,
): File | null {
	if (isForSharing) {
		const pdfBlob = pdf.output("blob");
		return new File([pdfBlob], filename, { type: "application/pdf" });
	}
	pdf.save(filename);
	return null;
}

export const generatePDF = async (element: HTMLElement, filename: string, isForSharing = false) => {
	if (!element) return null;

	try {
		const canvas = await captureElementToCanvas(element, A4_WIDTH_PX, applyA4CloneOverrides);
		const pdf = new jsPDF("p", "mm", "a4", true);
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const margin = 10;
		const contentWidth = pdfWidth - margin * 2;
		const imgHeight = (canvas.height * contentWidth) / canvas.width;
		const imgData = canvas.toDataURL("image/jpeg", 0.92);
		pdf.addImage(imgData, "JPEG", margin, margin, contentWidth, imgHeight);
		return finishPdf(pdf, filename, isForSharing);
	} catch (err) {
		const errMsg = err instanceof Error ? err.message : String(err);
		console.error("PDF generation failed:", errMsg, err);
		toast.error(`Failed to generate PDF: ${errMsg}`);
		return null;
	}
};

export const generateThermalPDF = async (
	element: HTMLElement,
	filename: string,
	isForSharing = false,
	paperWidthMm = 80,
) => {
	if (!element) return null;

	try {
		const target =
			(element.classList?.contains("thermal-receipt")
				? element
				: element.querySelector<HTMLElement>(".thermal-receipt")) || element;
		const canvas = await captureElementToCanvas(
			target,
			THERMAL_80_CONTENT_WIDTH_PX,
			applyThermalCloneOverrides,
			{ placeOnscreen: true },
		);
		const sideMargin = 3;
		const topMargin = 2;
		const bottomMargin = 2;
		const contentWidth = paperWidthMm - sideMargin * 2;
		const imgHeight = (canvas.height * contentWidth) / canvas.width;
		// Page height follows content — never crop into a fixed-height page.
		const pageHeight = imgHeight + topMargin + bottomMargin;
		const pdf = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: [paperWidthMm, pageHeight],
			compress: true,
		});
		const imgData = canvas.toDataURL("image/png");
		pdf.addImage(imgData, "PNG", sideMargin, topMargin, contentWidth, imgHeight);
		return finishPdf(pdf, filename, isForSharing);
	} catch (err) {
		const errMsg = err instanceof Error ? err.message : String(err);
		console.error("Thermal PDF generation failed:", errMsg, err);
		toast.error(`Failed to generate thermal PDF: ${errMsg}`);
		return null;
	}
};

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

function pdfFilename(receiptNumber?: string | number, receiptId?: string | number, _format: ReceiptPdfFormat = "a4") {
	const base = `receipt-${receiptNumber || receiptId || "unknown"}`;
	return `${base}.pdf`;
}

export const handleDownloadPDF = async (
	element: HTMLElement,
	receiptNumber?: string | number,
	receiptId?: string | number,
	format: ReceiptPdfFormat = "a4",
) => {
	const filename = pdfFilename(receiptNumber, receiptId, format);
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

	const filename = pdfFilename(receiptNumber, receiptId, format);
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
		const filename = pdfFilename(receiptNumber, receiptId, format);
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
