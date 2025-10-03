import CustomCard from "@/components/base/CustomCard";
import Image from "@/components/base/Image";
import KeyValueRow from "@/components/common/KeyValueRow";
import ReceiptWrapper from "@/components/common/ReceiptWrapper";
import { media } from "@/resources/images";

export default function CustomerReceipt() {
	return (
		<ReceiptWrapper shouldPrint={false} emailSubject="Receipt from Kpoikpoimingi" emailBody="Please find attached the receipt.">
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
						<h5 className="text-start text-base">Payment Details</h5>
						<span className="text-sm text-end text-slate-700">Payment duration (6 months)</span>
					</header>
					<CustomCard className="grid grid-cols-1 gap-y-3 px-4 md:px-6 py-5 bg-card border-0">
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
						Next payment is due on the 15th of July 2025,Endeavour to make payment. Failure to make payment attracts an increase in accrued interest
					</p>
				</section>

				<footer className="border-t-2 border-dashed pb-8 pt-4 text-center">
					<p className="text-stone-700 text-[.9rem]">
						Receipt granted by: <span className="font-medium text-black">Staff Mr Joel Edet</span>
					</p>
				</footer>
			</main>
		</ReceiptWrapper>
	);
}
