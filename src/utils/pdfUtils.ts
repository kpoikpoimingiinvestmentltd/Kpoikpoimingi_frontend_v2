import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { sendReceiptPdfToEmail, trackReceiptDownload } from "@/api/receipt";

export const generatePDF = async (element: HTMLElement, filename: string, isForSharing = false) => {
	if (!element) return null;

	try {
		const styleEl = document.createElement("style");
		styleEl.id = isForSharing ? "pdf-color-override-share" : "pdf-color-override";
		styleEl.textContent = `
			.receipt-content {
				border: none !important;
				box-shadow: none !important;
				display: flex;
				flex-direction: column;
			}
			table tr td, table tr th {
				vertical-align: middle !important;
				padding: 8px !important;
			}
		`;
		document.head.appendChild(styleEl);

		const canvas = await html2canvas(element, {
			useCORS: true,
			allowTaint: true,
			scale: 1.3,
			backgroundColor: "#ffffff",
			logging: false,
			onclone: (clonedDocument) => {
				const allElements = clonedDocument.querySelectorAll("*");
				allElements.forEach((el) => {
					const htmlEl = el as HTMLElement;
					const styles = window.getComputedStyle(el);

					const bgColor = styles.backgroundColor;
					if (bgColor && (bgColor.includes("oklch") || bgColor.includes("oklab"))) {
						htmlEl.style.backgroundColor = "#f3fbff";
					}

					const textColor = styles.color;
					if (textColor && (textColor.includes("oklch") || textColor.includes("oklab"))) {
						htmlEl.style.color = "#1f2937";
					}

					const borderColor = styles.borderColor;
					if (borderColor && (borderColor.includes("oklch") || borderColor.includes("oklab"))) {
						htmlEl.style.borderColor = "#d1d5db";
					}
				});
			},
		});

		styleEl.remove();

		const pdf = new jsPDF("p", "mm", "a4");
		const pdfWidth = pdf.internal.pageSize.getWidth();
		const margin = 10;
		const contentWidth = pdfWidth - margin * 2;

		const imgHeight = (canvas.height * contentWidth) / canvas.width;
		const imgData = canvas.toDataURL("image/jpeg", 0.85);

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
	}
};

export const handleDownloadPDF = async (element: HTMLElement, receiptNumber?: string | number, receiptId?: string | number) => {
	const filename = `receipt-${receiptNumber || receiptId || "unknown"}.pdf`;
	await generatePDF(element, filename, false);

	// Track the download
	if (receiptId) {
		try {
			await trackReceiptDownload(String(receiptId));
		} catch (err) {
			console.error("Failed to track receipt download:", err);
			// Don't show error toast - tracking failure shouldn't block the download
		}
	}
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

export const handleSendPDFViaEmail = async (element: HTMLElement, receiptId: string, receiptNumber?: string | number, recipientEmail?: string) => {
	if (!element) {
		toast.error("Receipt element not found");
		return false;
	}

	try {
		// Show loading state
		const loadingToastId = toast.loading("Generating and sending receipt...");

		const filename = `receipt-${receiptNumber || receiptId || "unknown"}.pdf`;

		// Generate PDF file
		const pdfFile = await generatePDF(element, filename, true);

		if (!pdfFile) {
			toast.dismiss(loadingToastId);
			toast.error("Failed to generate PDF");
			return false;
		}

		// Convert PDF to base64
		const reader = new FileReader();
		const pdfBase64 = await new Promise<string>((resolve, reject) => {
			reader.onload = () => {
				const result = reader.result as string;
				// Extract base64 string (remove data:application/pdf;base64, prefix)
				const base64String = result.split(",")[1];
				resolve(base64String);
			};
			reader.onerror = reject;
			reader.readAsDataURL(pdfFile);
		});

		// Send PDF via API endpoint
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
