import CustomCard from "@/components/base/CustomCard";
import ReceiptWrapper from "@/components/common/ReceiptWrapper";
import ReceiptContent from "@/components/common/ReceiptContent";
import { useParams } from "react-router";
import { useGetReceiptById } from "@/api/receipt";
import { CardSkeleton, RectangleSkeleton } from "@/components/common/Skeleton";
import type { ReceiptDetail } from "@/types/receipt";
import { useRef } from "react";
import { handleDownloadPDF as downloadPDF, handleSharePDF as sharePDF } from "@/utils/pdfUtils";

export default function ReceiptDetails() {
	const params = useParams();
	const id = params.id ?? undefined;
	const { data, isLoading } = useGetReceiptById(id);
	const receipt: ReceiptDetail | null = data ?? null;
	const receiptRef = useRef<HTMLDivElement>(null);

	if (isLoading) {
		return (
			<div className="max-w-4xl mx-auto">
				<div className="flex items-center justify-between flex-wrap gap-4 mb-6">
					<div className="flex-1">
						<RectangleSkeleton className="h-8 w-32 bg-gray-200 rounded" />
					</div>
					<div className="flex gap-3">
						<RectangleSkeleton className="h-10 w-24 bg-gray-200 rounded" />
						<RectangleSkeleton className="h-10 w-24 bg-gray-200 rounded" />
						<RectangleSkeleton className="h-10 w-24 bg-gray-200 rounded" />
					</div>
				</div>

				<CustomCard className="bg-white w-full rounded-lg p-6 border border-gray-100">
					<CardSkeleton lines={8} />
				</CustomCard>
			</div>
		);
	}

	if (!receipt) {
		return (
			<CustomCard className="mt-4 p-6">
				<p className="text-sm text-muted-foreground">Receipt not found</p>
			</CustomCard>
		);
	}

	const handlePrint = () => {
		window.print();
	};

	const handleDownloadPDF = async () => {
		await downloadPDF(receiptRef.current!, receipt.receiptNumber, receipt.id);
	};

	const handleSharePDF = async () => {
		await sharePDF(receiptRef.current!, receipt.receiptNumber, receipt.id);
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
