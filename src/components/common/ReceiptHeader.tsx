import Image from "@/components/base/Image";
import { media } from "@/resources/images";

interface ReceiptHeaderProps {
	receiptNumber?: string | number;
}

export default function ReceiptHeader({ receiptNumber }: ReceiptHeaderProps) {
	return (
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
			<aside className="order-1 md:order-2 text-start md:text-end flex justify-start md:justify-end h-full">
				<p className="text-black">Receipt Number: {receiptNumber ?? "-"}</p>
			</aside>
		</header>
	);
}
