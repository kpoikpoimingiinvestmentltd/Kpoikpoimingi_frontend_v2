// icons are provided by ReceiptActions
import CustomCard from "@/components/base/CustomCard";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import ReceiptActions from "@/components/common/ReceiptActions";

export default function ReceiptWrapper({
	children,
	emailSubject,
	emailBody,
	shouldPrint = true,
	shouldShare = true,
	shouldDownload = true,
}: {
	children: React.ReactNode;
	emailSubject?: string;
	emailBody?: string;
	shouldPrint?: boolean;
	shouldShare?: boolean;
	shouldDownload?: boolean;
}) {
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
				const text = encodeURIComponent("Please find the receipt attached.");
				window.open(`https://wa.me/?text=${text}`, "_blank");
			},
		},
	];

	return (
		<div>
			<CustomCard className="py-10">
				<div className="max-w-4xl mx-auto flex flex-col gap-y-8">
					<header className="flex justify-between items-center gap-x-4 gap-y-3 flex-wrap">
						<h2 className="text-lg font-medium">Receipt</h2>
						<div className="flex items-center gap-2">
							<ReceiptActions
								showPrint={shouldPrint}
								onPrint={() => window.print()}
								showShare={shouldShare}
								showDownload={shouldDownload}
								onDownload={() => {
									/* implement download */
								}}
								shareItems={shareItems}
							/>
						</div>
					</header>
					<main className="min-h-screen flex">
						<CustomCard className="relative flex-grow shadow-lg isolate py-8 px-4 md:px-8">
							<Image src={media.images.verticalCuts} className="w-11/12 mx-auto absolute right-0 left-0 top-0" />
							<Image src={media.images.verticalCuts} className="w-11/12 mx-auto absolute right-0 left-0 bottom-0 -rotate-x-180" />
							{children}
						</CustomCard>
					</main>
				</div>
			</CustomCard>
		</div>
	);
}
