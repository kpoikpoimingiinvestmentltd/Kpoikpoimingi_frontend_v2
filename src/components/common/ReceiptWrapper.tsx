// icons are provided by ReceiptActions
import CustomCard from "@/components/base/CustomCard";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import ReceiptActions from "@/components/common/ReceiptActions";
import React from "react";

// Add print styles to center receipt on A4
const printStyles = `
	@media print {
		body, html {
			margin: 0;
			padding: 0;
			background: white;
		}
		* {
			border: none !important;
			outline: none !important;
			box-shadow: none !important;
		}
		#receipt-container {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;
			width: 100%;
			margin: 0;
			padding: 0;
		}
		.receipt-wrapper-outer {
			display: none;
		}
		main.receipt-main {
			display: block !important;
			width: 100%;
			margin: 0;
			padding: 0;
		}
		.receipt-content {
			border: none !important;
			box-shadow: none !important;
			width: 210mm;
			min-height: 297mm;
			padding: 5mm !important;
			page-break-after: always;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		.receipt-actions {
			display: none;
		}
		.receipt-header {
			display: none;
		}
	}
	.hide-for-pdf * {
		border: none !important;
		outline: none !important;
		box-shadow: none !important;
	}
`;

export default function ReceiptWrapper({
	children,
	emailSubject,
	emailBody,
	shouldPrint = true,
	shouldShare = true,
	shouldDownload = true,
	onDownload,
	onPrint,
	onShare,
	contentRef,
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
}) {
	const handlePrint = () => {
		if (onPrint) {
			onPrint();
		} else {
			window.print();
		}
	};

	const shareItems = [
		{
			label: "Email",
			src: media.images.gmail,
			onSelect: () => {
				const subject = encodeURIComponent(emailSubject ?? "Receipt from Kpoikpoimingi");
				const body = encodeURIComponent(emailBody ?? "Please find attached the receipt.");
				window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
			},
		},
		{
			label: "Whatsapp",
			src: media.images.whatsapp,
			onSelect: () => {
				if (onShare && typeof navigator !== "undefined" && (navigator as any).share) {
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
		// Share PDF action will call the provided onShare handler if available
		...(onShare
			? [
					{
						label: "Share PDF",
						src: media.images.pdfImage,
						onSelect: () => {
							try {
								onShare();
							} catch (e) {
								// swallow
							}
						},
					},
			  ]
			: []),
	];

	return (
		<>
			<style>{printStyles}</style>
			<div id="receipt-container">
				<CustomCard className="receipt-wrapper-outer py-4 print:py-0 print:bg-white">
					<div className="max-w-4xl mx-auto flex flex-col gap-y-6">
						<header className="receipt-header flex justify-between items-center gap-x-4 gap-y-3 flex-wrap">
							<h2 className="text-lg font-medium">Receipt</h2>
							<div className="receipt-actions flex items-center gap-2">
								<ReceiptActions
									showPrint={shouldPrint}
									onPrint={handlePrint}
									showShare={shouldShare}
									showDownload={shouldDownload}
									onDownload={() => onDownload && onDownload()}
									shareItems={shareItems}
								/>
							</div>
						</header>
						<main className="receipt-main flex">
							<CustomCard
								ref={contentRef}
								className="receipt-content relative flex-grow shadow-lg isolate py-6 px-4 md:px-8 print:shadow-none print:border-0">
								<Image src={media.images.verticalCuts} className="w-11/12 mx-auto absolute right-0 left-0 top-0 print:hidden" />
								<Image src={media.images.verticalCuts} className="w-11/12 mx-auto absolute right-0 left-0 bottom-0 -rotate-x-180 print:hidden" />
								{children}
							</CustomCard>
						</main>
					</div>
				</CustomCard>
			</div>
		</>
	);
}
