import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { sendReceiptPdfToEmail, trackReceiptDownload } from "@/api/receipt";

const A4_WIDTH_PX = 794;

export const generatePDF = async (element: HTMLElement, filename: string, isForSharing = false) => {
	if (!element) return null;

	const clone = element.cloneNode(true) as HTMLElement;

	clone.style.position = "fixed";
	clone.style.top = "-9999px";
	clone.style.left = "-9999px";
	clone.style.width = `${A4_WIDTH_PX}px`;
	clone.style.minWidth = `${A4_WIDTH_PX}px`;
	clone.style.overflow = "visible";
	clone.style.zIndex = "-1";
	clone.style.pointerEvents = "none";

	document.body.appendChild(clone);

	void clone.offsetWidth;

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

		const canvas = await html2canvas(clone, {
			useCORS: true,
			allowTaint: true,
			scale: 2,
			backgroundColor: "#ffffff",
			logging: false,
			windowWidth: A4_WIDTH_PX,
			width: A4_WIDTH_PX,
			onclone: (clonedDocument, clonedElement) => {
				clonedElement.style.width = `${A4_WIDTH_PX}px`;
				clonedElement.style.minWidth = `${A4_WIDTH_PX}px`;
				clonedElement.style.boxSizing = "border-box";
				clonedElement.style.overflow = "visible";

				// Fix oklch/oklab colors unsupported by canvas
				clonedDocument.querySelectorAll("*").forEach((el) => {
					const htmlEl = el as HTMLElement;
					const styles = window.getComputedStyle(el);

					if (styles.backgroundColor?.includes("oklch") || styles.backgroundColor?.includes("oklab")) {
						htmlEl.style.backgroundColor = "#f3fbff";
					}
					if (styles.color?.includes("oklch") || styles.color?.includes("oklab")) {
						htmlEl.style.color = "#1f2937";
					}
					if (styles.borderColor?.includes("oklch") || styles.borderColor?.includes("oklab")) {
						htmlEl.style.borderColor = "#d1d5db";
					}
				});
			},
		});

		styleEl.remove();

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

export const handleDownloadPDF = async (element: HTMLElement, receiptNumber?: string | number, receiptId?: string | number) => {
	const filename = `receipt-${receiptNumber || receiptId || "unknown"}.pdf`;
	await generatePDF(element, filename, false);

	if (receiptId) {
		try {
			await trackReceiptDownload(String(receiptId));
		} catch (err) {
			console.error("Failed to track receipt download:", err);
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
		const loadingToastId = toast.loading("Generating and sending receipt...");
		const filename = `receipt-${receiptNumber || receiptId || "unknown"}.pdf`;
		const pdfFile = await generatePDF(element, filename, true);

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
