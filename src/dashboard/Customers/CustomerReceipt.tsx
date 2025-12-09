import { useRef } from "react";
import { useSearchParams } from "react-router";
import CustomCard from "@/components/base/CustomCard";
import ReceiptWrapper from "@/components/common/ReceiptWrapper";
import ReceiptContent from "@/components/common/ReceiptContent";
import { useGetReceiptById } from "@/api/receipt";
import { TableSkeleton } from "@/components/common/Skeleton";
import type { ReceiptDetail } from "@/types/receipt";
import { handleDownloadPDF as downloadPDF, handleSharePDF as sharePDF } from "@/utils/pdfUtils";

export default function CustomerReceipt() {
	const [searchParams] = useSearchParams();
	const receiptId = searchParams.get("receiptId") ?? undefined;
	const { data, isLoading } = useGetReceiptById(receiptId);
	const receipt: ReceiptDetail | null = data ?? null;
	const receiptRef = useRef<HTMLDivElement>(null);

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

	const handleDownloadPDF = async () => {
		await downloadPDF(receiptRef.current!, receipt!.receiptNumber, receipt!.id);
	};

	const handlePrint = () => {
		window.print();
	};

	const handleSharePDF = async () => {
		await sharePDF(receiptRef.current!, receipt!.receiptNumber, receipt!.id);
	};

	return (
		<div>
			<ReceiptWrapper
				contentRef={receiptRef}
				emailSubject="Receipt from Kpoikpoimingi"
				emailBody="Please find attached the receipt."
				onDownload={handleDownloadPDF}
				onPrint={handlePrint}
				onShare={handleSharePDF}>
				<ReceiptContent receipt={receipt} />
			</ReceiptWrapper>
		</div>
	);
}
