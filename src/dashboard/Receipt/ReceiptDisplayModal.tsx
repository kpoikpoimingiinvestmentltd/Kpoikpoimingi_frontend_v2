import React from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import ReceiptWrapper from "@/components/common/ReceiptWrapper";
import ReceiptContent from "@/components/common/ReceiptContent";
import { modalContentStyle } from "@/components/common/commonStyles";
import type { ReceiptDetail } from "@/types/receipt";
import { handleDownloadPDF as downloadPDF, handleSharePDF as sharePDF } from "@/utils/pdfUtils";

interface ReceiptDisplayModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	receipt: ReceiptDetail | null;
}

export default function ReceiptDisplayModal({ open, onOpenChange, receipt }: ReceiptDisplayModalProps) {
	const receiptRef = React.useRef<HTMLDivElement>(null);

	const handlePrint = () => {
		window.print();
	};

	const handleDownloadPDF = async () => {
		if (!receipt) return;
		await downloadPDF(receiptRef.current!, receipt.receiptNumber || receipt.id, receipt.id);
	};

	const handleSharePDF = async () => {
		if (!receipt) return;
		await sharePDF(receiptRef.current!, receipt.receiptNumber || receipt.id, receipt.id);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle("md:max-w-4xl md:max-h-[90vh] overflow-y-auto")}>
				<div className="absolute right-2 top-2 z-50">
					<DialogClose />
				</div>

				{receipt && (
					<ReceiptWrapper
						contentRef={receiptRef}
						emailSubject="Receipt from Kpoikpoimingi"
						emailBody="Please find attached the receipt."
						onDownload={handleDownloadPDF}
						onPrint={handlePrint}
						onShare={handleSharePDF}>
						<ReceiptContent receipt={receipt} />
					</ReceiptWrapper>
				)}
			</DialogContent>
		</Dialog>
	);
}
