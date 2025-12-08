// icons are provided by ReceiptActions
import CustomCard from "@/components/base/CustomCard";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import KeyValueRow from "@/components/common/KeyValueRow";
import ReceiptWrapper from "@/components/common/ReceiptWrapper";
import { useParams } from "react-router";
import { useGetReceiptById } from "@/api/receipt";
import { TableSkeleton } from "@/components/common/Skeleton";
import type { ReceiptDetail } from "@/types/receipt";
import { useRef } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function ReceiptDetails() {
	const params = useParams();
	const id = params.id ?? undefined;
	const { data, isLoading } = useGetReceiptById(id);
	const receipt: ReceiptDetail | null = data ?? null;
	const receiptRef = useRef<HTMLDivElement>(null);

	const handlePrint = () => {
		window.print();
	};

	const handleDownloadPDF = async () => {
		if (!receiptRef.current || !receipt) return;
		try {
			// Inject styles to override oklch colors, remove borders, and set min height for PDF
			const styleEl = document.createElement("style");
			styleEl.id = "pdf-color-override";
			styleEl.textContent = `
				* { 
					color: inherit !important; 
					background-color: inherit !important;
					border-color: inherit !important;
				}
				.receipt-content {
					border: none !important;
					box-shadow: none !important;
					min-height: 297mm;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
				}
				[class*="CustomCard"] {
					border: none !important;
				}
			`;
			document.head.appendChild(styleEl);

			const canvas = await html2canvas(receiptRef.current, {
				useCORS: true,
				allowTaint: true,
				scale: 1.5,
				backgroundColor: "#ffffff",
				logging: false,
			});

			// Clean up injected style
			styleEl.remove();

			const pdf = new jsPDF("p", "mm", "a4");
			const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm for A4
			const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm for A4
			const pxPerMm = canvas.width / pdfWidth;
			const pageHeightPx = Math.floor(pdfHeight * pxPerMm);
			const pages = Math.ceil(canvas.height / pageHeightPx);
			// Helper to create a canvas slice per page
			const createPageCanvas = (index: number) => {
				const pageCanvas = document.createElement("canvas");
				pageCanvas.width = canvas.width;
				const h = Math.min(pageHeightPx, canvas.height - index * pageHeightPx);
				pageCanvas.height = h;
				const ctx = pageCanvas.getContext("2d");
				if (ctx) ctx.drawImage(canvas, 0, index * pageHeightPx, canvas.width, h, 0, 0, canvas.width, h);
				return pageCanvas;
			};
			for (let i = 0; i < pages; i++) {
				const pageCanvas = createPageCanvas(i);
				const imgData = pageCanvas.toDataURL("image/jpeg", 0.85);
				const imgHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
				if (i > 0) pdf.addPage();
				pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeight);
			}
			// Save PDF
			pdf.save(`receipt-${receipt.receiptNumber || receipt.id}.pdf`);
		} catch (err) {
			const errMsg = err instanceof Error ? err.message : String(err);
			console.error("PDF generation failed:", errMsg, err);
			toast.error(`Failed to generate PDF: ${errMsg}`);
		}
	};

	const handleSharePDF = async () => {
		if (!receiptRef.current || !receipt || !navigator.share) {
			alert("Sharing not supported on this device");
			return;
		}
		try {
			// Inject styles to override oklch colors, remove borders, and set min height for PDF
			const styleEl = document.createElement("style");
			styleEl.id = "pdf-color-override-share";
			styleEl.textContent = `
				* { 
					color: inherit !important; 
					background-color: inherit !important;
					border-color: transparent !important;
				}
				.receipt-content {
					border: none !important;
					box-shadow: none !important;
					min-height: 297mm;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
				}
				[class*="CustomCard"] {
					border: none !important;
				}
			`;
			document.head.appendChild(styleEl);

			const canvas = await html2canvas(receiptRef.current, {
				useCORS: true,
				allowTaint: true,
				scale: 1.5,
				backgroundColor: "#ffffff",
				logging: false,
			});

			styleEl.remove();

			const pdf = new jsPDF("p", "mm", "a4");
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = pdf.internal.pageSize.getHeight();
			const pxPerMm = canvas.width / pdfWidth;
			const pageHeightPx = Math.floor(pdfHeight * pxPerMm);
			const pages = Math.ceil(canvas.height / pageHeightPx);
			const createPageCanvas = (index: number) => {
				const pageCanvas = document.createElement("canvas");
				pageCanvas.width = canvas.width;
				const h = Math.min(pageHeightPx, canvas.height - index * pageHeightPx);
				pageCanvas.height = h;
				const ctx = pageCanvas.getContext("2d");
				if (ctx) ctx.drawImage(canvas, 0, index * pageHeightPx, canvas.width, h, 0, 0, canvas.width, h);
				return pageCanvas;
			};
			for (let i = 0; i < pages; i++) {
				const page = createPageCanvas(i);
				const imgData = page.toDataURL("image/jpeg", 0.85);
				if (i > 0) pdf.addPage();
				pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, (page.height * pdfWidth) / page.width);
			}
			const pdfBlob = pdf.output("blob");
			const file = new File([pdfBlob], `receipt-${receipt.receiptNumber || receipt.id}.pdf`, { type: "application/pdf" });
			await navigator.share({
				title: "Receipt",
				text: "Here is your receipt",
				files: [file],
			});
		} catch (err) {
			const errMsg = err instanceof Error ? err.message : String(err);
			toast.error(`Sharing failed: ${errMsg}`);
		}
	};

	if (isLoading) {
		return (
			<CustomCard className="mt-4 p-6">
				<TableSkeleton rows={6} cols={2} />
			</CustomCard>
		);
	}

	if (!receipt) {
		return (
			<CustomCard className="mt-4 p-6">
				<p className="text-sm text-muted-foreground">Receipt not found</p>
			</CustomCard>
		);
	}

	return (
		<div>
			<ReceiptWrapper
				contentRef={receiptRef}
				emailSubject="Receipt from Kpoikpoimingi"
				emailBody="Please find attached the receipt."
				onDownload={handleDownloadPDF}
				onPrint={handlePrint}
				onShare={handleSharePDF}>
				<header className="grid grid-cols-1 md:grid-cols-2 items-start border-b-2 border-dashed pb-8">
					<aside className="order-2 md:order-1 flex flex-col items-start gap-y-3">
						<Image src={media.logos.logo} className="w-40 sm:w-48" />
						<div className="text-start">
							<p className="text-[#13121299] text-sm">
								<span className="text-black">Office adress: </span>
								Block 1 Shop 6 Django House, After the communication Mast, Ndakwo Villa Abuja
							</p>
						</div>
						<div className="text-start">
							<p className="text-[#13121299] text-sm">
								<span className="text-black">Contact: </span>
								+2349017041023
							</p>
						</div>
					</aside>
					<aside className="order-1 md:order-2 text-start md:text-end md:mb-4 block">
						<p className="text-black">Receipt Number: {receipt.receiptNumber ?? receipt.id}</p>
					</aside>
				</header>
				<main className="flex-grow">
					<section className="flex flex-col gap-y-2 my-4">
						<KeyValueRow label="Phone" value={receipt.customer?.phoneNumber ?? "-"} />
						<KeyValueRow label="Property" value={receipt.contract?.property?.name ?? receipt.propertyName ?? "-"} />
						<KeyValueRow label="Total amount" value={receipt.totalAmount ? `₦${Number(receipt.totalAmount).toLocaleString()}` : "-"} />
						<KeyValueRow label="Amount paid" value={receipt.amountPaid ? `₦${Number(receipt.amountPaid).toLocaleString()}` : "-"} />
						<KeyValueRow
							label="Payment date"
							value={
								receipt.paymentDate
									? new Date(receipt.paymentDate).toLocaleString()
									: receipt.createdAt
									? new Date(receipt.createdAt).toLocaleString()
									: "-"
							}
						/>
					</section>

					<section className="mt-4 flex flex-col gap-y-6">
						<header className="flex items-center justify-between bg-[#03B4FA33] px-4 md:px-6 py-2.5 rounded-md">
							<h5 className="text-start">Payment Details</h5>
							<span className="text-sm text-end text-slate-700">Payment duration ({receipt.contract?.durationValue ?? "-"} months)</span>
						</header>
						<CustomCard className="grid grid-cols-1 gap-y-3 px-4 md:px-6 py-5 bg-card border-0">
							<KeyValueRow
								label="Property Price"
								value={receipt.contract?.property?.price ? `₦${Number(receipt.contract.property.price).toLocaleString()}` : "-"}
							/>
							<KeyValueRow label="Installment progress" value={receipt.installmentProgress ?? "-"} />
							<KeyValueRow label="Total installments" value={String(receipt.totalInstallments ?? "-")} />
						</CustomCard>
					</section>
					<section className="md:w-11/12 mx-auto mt-48 text-center py-4">
						<p className="text-sm sm:text-[.9rem]">
							Next payment date: {receipt.nextPaymentDate ? new Date(receipt.nextPaymentDate).toLocaleDateString() : "-"}
						</p>
					</section>

					<footer className="border-t-2 border-dashed pb-8 pt-4 text-center">
						<p className="text-stone-700 text-[.9rem]">
							Receipt issued by: <span className="font-medium text-black">{receipt.issuedById ?? "-"}</span>
						</p>
					</footer>
				</main>
			</ReceiptWrapper>
		</div>
	);
}
