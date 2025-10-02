import { DownloadCloudIcon, IconWrapper, PrinterIcon, ShareIcon } from "@/assets/icons";
import CustomCard from "@/components/base/CustomCard";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useCallback } from "react";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import KeyValueRow from "../../../components/common/KeyValueRow";

export default function ReceiptDetails() {
	const receiptActions = [
		{
			label: "Print",
			icon: <PrinterIcon />,
			action: () => {},
		},
		{
			label: "Share",
			icon: <ShareIcon />,
			action: () => {},
		},
		{
			label: "Download",
			icon: <DownloadCloudIcon />,
			action: () => {},
		},
	];
	const handleEmail = useCallback(() => {
		const subject = encodeURIComponent("Receipt from Kpoikpoimingi");
		const body = encodeURIComponent("Please find attached the receipt.");
		window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
	}, []);

	const handleWhatsApp = useCallback(() => {
		// opens WhatsApp web to share (no number supplied)
		const text = encodeURIComponent("Please find the receipt attached.");
		window.open(`https://wa.me/?text=${text}`, "_blank");
	}, []);

	const renderReceiptActions = () => {
		return receiptActions.map((action, index) => {
			if (action.label === "Share") {
				return (
					<DropdownMenu key={index}>
						<DropdownMenuTrigger asChild>
							<button className="flex active-scale items-center gap-2 p-2 px-3 bg-primary/10 rounded-sm hover:bg-primary/60 text-primary hover:text-white">
								<IconWrapper>{action.icon}</IconWrapper>
								<span className="hidden min-[450px]:text-sm min-[450px]:inline-block min-[600px]:text-sm">{action.label}</span>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="shadow-md px-2">
							<DropdownMenuLabel>Share to</DropdownMenuLabel>
							{[
								{ label: "Email", src: media.images.gmail, onSelect: handleEmail },
								{ label: "Whatsapp", src: media.images.whatsapp, onSelect: handleWhatsApp },
							].map((opt) => (
								<DropdownMenuItem key={opt.label} onSelect={opt.onSelect} className="cursor-pointer py-1.5 px-3">
									<Image src={opt.src} className="w-5" />
									<span>{opt.label}</span>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			}

			return (
				<button
					key={index}
					onClick={action.action}
					className="flex active-scale items-center gap-2 p-2 px-3 bg-primary/10 rounded-sm hover:bg-primary/60 text-primary hover:text-white">
					<IconWrapper>{action.icon}</IconWrapper>
					<span className="hidden min-[450px]:text-sm min-[450px]:inline-block min-[600px]:text-sm">{action.label}</span>
				</button>
			);
		});
	};

	return (
		<div>
			<CustomCard className="py-10">
				<div className="max-w-4xl mx-auto flex flex-col gap-y-8">
					<header className="flex justify-between">
						<h2 className="text-lg font-semibold">Receipt</h2>
						<div className="flex items-center gap-2">{renderReceiptActions()}</div>
					</header>
					<main>
						<CustomCard className="relative shadow-lg isolate py-8 px-4 md:px-8">
							<Image src={media.images.verticalCuts} className="w-11/12 mx-auto absolute right-0 left-0 top-0" />
							<Image src={media.images.verticalCuts} className="w-11/12 mx-auto absolute right-0 left-0 bottom-0 -rotate-x-180" />
							<header className="grid grid-cols-1 md:grid-cols-2 items-start border-b-2 border-dashed pb-8">
								<aside className="order-2 md:order-1 flex flex-col items-start gap-y-3">
									<Image src={media.logos.logo} className="w-40 sm:w-48" />
									<div className="text-start">
										<p className="text-[#13121299] text-sm">
											<span className="text-black">Office adress: </span>
											Block 1 Shop 6 Django House, After the communication Mast, Ndakwo Villa Abuja
										</p>
									</div>
									<div className="text-start">
										<p className="text-[#13121299] text-sm">
											<span className="text-black">Contact: </span>
											+2349017041023
										</p>
									</div>
								</aside>
								<aside className="order-1 md:order-2 text-start md:text-end">
									<p className="text-black">Invoice Number: 0468</p>
								</aside>
							</header>
							<main className="flex-grow">
								<section className="flex flex-col gap-y-2 my-4">
									<KeyValueRow label="Name" value="Tom Doe James" />
									<KeyValueRow label="Whatsapp number" value="+2348134567890" />
									<KeyValueRow label="Address" value="No. 9 mbora lane off etaagbor street" />
									<KeyValueRow label="Date" value="20/4/2025" />
								</section>

								<section className="mt-4 flex flex-col gap-y-6">
									<header className="flex items-center justify-between bg-[#03B4FA33] px-4 md:px-6 py-2.5 rounded-md">
										<h5>Payment Details</h5>
										<span className="text-sm text-slate-700">Payment duration (6 months)</span>
									</header>
									<CustomCard className="grid grid-cols-1 gap-y-3 px-4 md:px-6 py-5 bg-[#FBFBFB] border-0">
										<KeyValueRow label="Property Name" value="12 inches HP laptop" />
										<KeyValueRow label="Total amount" value="500,000" />
										<KeyValueRow label="Starting amount" value="60,000" />
										<KeyValueRow label="Amount paid plus VAT" value="43,89.25" />
										<KeyValueRow label="Total Amount Paid" value="300,000" />
										<KeyValueRow label="Instalment covered" value="3/6" />
										<KeyValueRow label="Remaining balance" value="200,000" />
									</CustomCard>
								</section>
								<section className="md:w-11/12 mx-auto mt-16 text-center py-4">
									<p className="text-sm sm:text-[.9rem]">
										Next payment is due on the 15th of July 2025,Endeavour to make payment. Failure to make payment attracts an increase in
										accrued interest
									</p>
								</section>
							</main>
							<footer className="border-t-2 border-dashed pb-8 pt-4 text-center">
								<p className="text-stone-700 text-[.9rem]">
									Receipt granted by: <span className="font-medium text-black">Staff Mr Joel Edet</span>
								</p>
							</footer>
						</CustomCard>
					</main>
				</div>
			</CustomCard>
		</div>
	);
}
