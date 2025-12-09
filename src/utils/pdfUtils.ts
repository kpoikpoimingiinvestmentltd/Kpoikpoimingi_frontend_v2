import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export const generatePDF = async (element: HTMLElement, filename: string, isForSharing = false) => {
	if (!element) return null;

	try {
		const styleEl = document.createElement("style");
		styleEl.id = isForSharing ? "pdf-color-override-share" : "pdf-color-override";
		styleEl.textContent = `
			* {
				color: inherit !important;
				border-color: ${isForSharing ? "transparent" : "inherit"} !important;
			}
			.receipt-content {
				border: none !important;
				box-shadow: none !important;
				display: flex;
				flex-direction: column;
			}
			[class*="CustomCard"] {
				border: none !important;
				background-color: #f5f5f5 !important;
			}
			[class*="bg-\\["] {
				background-color: rgba(3, 180, 250, 0.2) !important;
			}
		`;
		document.head.appendChild(styleEl);

		const canvas = await html2canvas(element, {
			useCORS: true,
			allowTaint: true,
			scale: 1.5,
			backgroundColor: "#ffffff",
			logging: false,
			onclone: (clonedDocument) => {
				// Remove oklch colors by setting fallback hex colors
				const allElements = clonedDocument.querySelectorAll("*");
				allElements.forEach((el) => {
					const styles = window.getComputedStyle(el);
					const bgColor = styles.backgroundColor;
					if (bgColor && bgColor.includes("oklch")) {
						(el as HTMLElement).style.backgroundColor = "#f5f5f5";
					}
				});
			},
		});

		styleEl.remove();

		const pdf = new jsPDF("p", "mm", "a4");
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const pdfHeight = pdf.internal.pageSize.getHeight();

		// Scale image to fit on a single page
		const imgHeight = (canvas.height * pdfWidth) / canvas.width;
		const imgData = canvas.toDataURL("image/jpeg", 0.85);

		if (imgHeight <= pdfHeight) {
			// Fits on one page
			pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeight);
		} else {
			// Scale down to fit on one page
			const scale = pdfHeight / imgHeight;
			const scaledHeight = pdfHeight;
			const scaledWidth = pdfWidth * scale;
			pdf.addImage(imgData, "JPEG", 0, 0, scaledWidth, scaledHeight);
		}

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
	}
};

export const handleDownloadPDF = async (element: HTMLElement, receiptNumber?: string | number, receiptId?: string | number) => {
	const filename = `receipt-${receiptNumber || receiptId || "unknown"}.pdf`;
	await generatePDF(element, filename, false);
};

export const handleSharePDF = async (element: HTMLElement, receiptNumber?: string | number, receiptId?: string | number) => {
	if (!navigator.share) {
		toast.error("Sharing not supported on this device");
		return;
	}

	const filename = `receipt-${receiptNumber || receiptId || "unknown"}.pdf`;
	const file = await generatePDF(element, filename, true);

	if (file) {
		try {
			await navigator.share({
				title: "Receipt",
				text: "Here is your receipt",
				files: [file],
			});
		} catch (err) {
			const errMsg = err instanceof Error ? err.message : String(err);
			toast.error(`Sharing failed: ${errMsg}`);
		}
	}
};
