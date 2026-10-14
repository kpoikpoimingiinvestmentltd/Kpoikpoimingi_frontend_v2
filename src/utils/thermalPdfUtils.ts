/**
 * 80mm thermal receipt PDF only.
 * Intentionally isolated from A4 pdfUtils — do not import this into the A4 path.
 */
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const THERMAL_80_CONTENT_WIDTH_PX = 280;

function stripThemeStylesheets(clonedDocument: Document) {
	clonedDocument.querySelectorAll("style, link[rel='stylesheet']").forEach((el) => {
		el.remove();
	});
}

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

function applyThermalCloneOverrides(clonedDocument: Document, clonedElement: HTMLElement) {
	stripThemeStylesheets(clonedDocument);

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

async function captureThermalElementToCanvas(element: HTMLElement) {
	const widthPx = THERMAL_80_CONTENT_WIDTH_PX;
	const clone = element.cloneNode(true) as HTMLElement;

	clone.style.position = "fixed";
	clone.style.top = "0";
	clone.style.left = "0";
	clone.style.width = `${widthPx}px`;
	clone.style.minWidth = `${widthPx}px`;
	clone.style.maxWidth = `${widthPx}px`;
	clone.style.height = "auto";
	clone.style.overflow = "visible";
	clone.style.zIndex = "2147483646";
	clone.style.pointerEvents = "none";
	clone.style.backgroundColor = "#ffffff";
	clone.style.opacity = "0.01";

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
				applyThermalCloneOverrides(clonedDocument, clonedElement);
			},
		});
	} finally {
		document.body.removeChild(clone);
	}
}

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

		const canvas = await captureThermalElementToCanvas(target);
		const sideMargin = 3;
		const topMargin = 2;
		const bottomMargin = 2;
		const contentWidth = paperWidthMm - sideMargin * 2;
		const imgHeight = (canvas.height * contentWidth) / canvas.width;
		const pageHeight = imgHeight + topMargin + bottomMargin;
		const pdf = new jsPDF({
			orientation: "portrait",
			unit: "mm",
			format: [paperWidthMm, pageHeight],
			compress: true,
		});
		const imgData = canvas.toDataURL("image/png");
		pdf.addImage(imgData, "PNG", sideMargin, topMargin, contentWidth, imgHeight);

		if (isForSharing) {
			return new File([pdf.output("blob")], filename, { type: "application/pdf" });
		}
		pdf.save(filename);
		return null;
	} catch (err) {
		const errMsg = err instanceof Error ? err.message : String(err);
		console.error("Thermal PDF generation failed:", errMsg, err);
		toast.error(`Failed to generate thermal PDF: ${errMsg}`);
		return null;
	}
};
