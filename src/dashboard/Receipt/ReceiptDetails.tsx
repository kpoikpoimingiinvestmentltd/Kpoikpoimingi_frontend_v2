// icons are provided by ReceiptActions
import CustomCard from "@/components/base/CustomCard";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import KeyValueRow from "@/components/common/KeyValueRow";
import ReceiptWrapper from "@/components/common/ReceiptWrapper";
import { useParams } from "react-router";
import { useGetReceiptById } from "@/api/receipt";
import { TableSkeleton } from "@/components/common/Skeleton";
import type { ReceiptDetail } from "@/types/receipt";

export default function ReceiptDetails() {
	const params = useParams();
	const id = params.id ?? undefined;
	const { data, isLoading } = useGetReceiptById(id);
	const receipt: ReceiptDetail | null = data ?? null;

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

	return (
		<ReceiptWrapper emailSubject="Receipt from Kpoikpoimingi" emailBody="Please find attached the receipt.">
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
					<p className="text-black">Receipt Number: {receipt.receiptNumber ?? receipt.id}</p>
				</aside>
			</header>
			<main className="flex-grow">
				<section className="flex flex-col gap-y-2 my-4">
					<KeyValueRow label="Phone" value={receipt.customer?.phoneNumber ?? "-"} />
					<KeyValueRow label="Property" value={receipt.contract?.property?.name ?? receipt.propertyName ?? "-"} />
					<KeyValueRow label="Total amount" value={receipt.totalAmount ? `₦${Number(receipt.totalAmount).toLocaleString()}` : "-"} />
					<KeyValueRow label="Amount paid" value={receipt.amountPaid ? `₦${Number(receipt.amountPaid).toLocaleString()}` : "-"} />
					<KeyValueRow
						label="Payment date"
						value={
							receipt.paymentDate
								? new Date(receipt.paymentDate).toLocaleString()
								: receipt.createdAt
								? new Date(receipt.createdAt).toLocaleString()
								: "-"
						}
					/>
				</section>

				<section className="mt-4 flex flex-col gap-y-6">
					<header className="flex items-center justify-between bg-[#03B4FA33] px-4 md:px-6 py-2.5 rounded-md">
						<h5 className="text-start">Payment Details</h5>
						<span className="text-sm text-end text-slate-700">Payment duration ({receipt.contract?.durationValue ?? "-"} months)</span>
					</header>
					<CustomCard className="grid grid-cols-1 gap-y-3 px-4 md:px-6 py-5 bg-card border-0">
						<KeyValueRow
							label="Property Price"
							value={receipt.contract?.property?.price ? `₦${Number(receipt.contract.property.price).toLocaleString()}` : "-"}
						/>
						<KeyValueRow label="Installment progress" value={receipt.installmentProgress ?? "-"} />
						<KeyValueRow label="Total installments" value={String(receipt.totalInstallments ?? "-")} />
					</CustomCard>
				</section>
				<section className="md:w-11/12 mx-auto mt-16 text-center py-4">
					<p className="text-sm sm:text-[.9rem]">
						Next payment date: {receipt.nextPaymentDate ? new Date(receipt.nextPaymentDate).toLocaleDateString() : "-"}
					</p>
				</section>

				<footer className="border-t-2 border-dashed pb-8 pt-4 text-center">
					<p className="text-stone-700 text-[.9rem]">
						Receipt issued by: <span className="font-medium text-black">{receipt.issuedById ?? "-"}</span>
					</p>
				</footer>
			</main>
		</ReceiptWrapper>
	);
}
