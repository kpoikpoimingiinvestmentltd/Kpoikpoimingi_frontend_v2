import { DownloadCloudIcon, IconWrapper, PrinterIcon, ShareIcon } from "@/assets/icons";
import CustomCard from "@/components/base/CustomCard";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useCallback } from "react";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";

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
								<aside className="order-1 md:order-2 text-end md:text-start">
									<p className="text-black">Invoice Number: 0468</p>
								</aside>
							</header>
							<main className="flex-grow">
								<section></section>
								<section></section>
								<section className="mt-auto">
									<p>Thank you for completing your payment</p>
								</section>
							</main>
							<footer className="border-t-2 border-dashed pb-8 pt-4 text-center">
								<p className="text-sm">
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
