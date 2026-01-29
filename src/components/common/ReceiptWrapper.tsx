// icons are provided by ReceiptActions
import CustomCard from "@/components/base/CustomCard";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import ReceiptActions from "@/components/common/ReceiptActions";
import React, { useCallback, useRef } from "react";
import { handleSendPDFViaEmail } from "@/utils/pdfUtils";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";

export default function ReceiptWrapper({
	children,
	shouldPrint = true,
	shouldShare = true,
	shouldDownload = true,
	onDownload,
	onPrint,
	onShare,
	contentRef,
	receiptId,
}: {
	children: React.ReactNode;
	emailSubject?: string;
	emailBody?: string;
	shouldPrint?: boolean;
	shouldShare?: boolean;
	shouldDownload?: boolean;
	onDownload?: () => void;
	onPrint?: () => void;
	onShare?: () => void;
	contentRef?: React.Ref<HTMLDivElement>;
	receiptId?: string;
}) {
	const printRef = useRef<HTMLDivElement>(null);

	const handlePrint = useReactToPrint({
		contentRef: printRef,
		documentTitle: "Receipt",
		pageStyle: `
			@page {
				margin: 10mm;
				size: A4;
			}
			body {
				margin: 0;
				padding: 0;
				zoom: 1;
			}
		`,
		onAfterPrint: () => {
			if (onPrint) {
				onPrint();
			}
		},
	});

	const handleEmailSend = useCallback(async () => {
		if (!receiptId) {
			toast.error("Receipt ID not available");
			return;
		}

		const refContent = contentRef as React.RefObject<HTMLDivElement> | undefined;
		if (!refContent || !refContent.current) {
			toast.error("Receipt content not available");
			return;
		}

		// Generate PDF and send via API endpoint
		const success = await handleSendPDFViaEmail(refContent.current, receiptId);

		if (!success) {
			// Error toast is already handled in handleSendPDFViaEmail
			return;
		}
	}, [receiptId, contentRef]);

	const shareItems = [
		{
			label: "Email",
			src: media.images.gmail,
			onSelect: handleEmailSend,
		},
		{
			label: "Whatsapp",
			src: media.images.whatsapp,
			onSelect: () => {
				if (onShare && typeof navigator !== "undefined" && "share" in navigator) {
					try {
						onShare();
						return;
					} catch (e) {
						/* swallow */
					}
				}
				const text = encodeURIComponent("Please find the receipt attached.");
				window.open(`https://wa.me/?text=${text}`, "_blank");
			},
		},
	];

	return (
		<>
			<div id="receipt-container">
				<CustomCard className="receipt-wrapper-outer border-0 bg-transparent dark:bg-transparent py-4">
					<div className="max-w-4xl mx-auto flex flex-col gap-y-6">
						<header className="receipt-header flex justify-between items-center gap-x-4 gap-y-3 flex-wrap">
							<h2 className="text-lg font-medium">Receipt</h2>
							<div className="receipt-actions flex items-center gap-2">
								<ReceiptActions
									showPrint={shouldPrint}
									onPrint={() => handlePrint()}
									showShare={shouldShare}
									showDownload={shouldDownload}
									onDownload={() => onDownload && onDownload()}
									shareItems={shareItems}
								/>
							</div>
						</header>
						<main className="receipt-main flex">
							<CustomCard ref={printRef} className="receipt-content relative flex-grow shadow-lg isolate py-6 px-4 md:px-8">
								<Image src={media.images.verticalCuts} className="w-11/12 mx-auto absolute right-0 left-0 top-0 dark:opacity-10" />
								<Image src={media.images.verticalCuts} className="w-11/12 mx-auto absolute right-0 left-0 bottom-0 -rotate-x-180 dark:opacity-10" />
								<div ref={contentRef}>{children}</div>
							</CustomCard>
						</main>
					</div>
				</CustomCard>
			</div>
		</>
	);
}
