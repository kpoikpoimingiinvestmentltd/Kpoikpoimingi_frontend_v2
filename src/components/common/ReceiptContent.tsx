import CustomCard from "@/components/base/CustomCard";
import KeyValueRow from "@/components/common/KeyValueRow";
import ReceiptHeader from "@/components/common/ReceiptHeader";
import type { ReceiptDetail } from "@/types/receipt";

interface ReceiptContentProps {
	receipt: ReceiptDetail;
}

export default function ReceiptContent({ receipt }: ReceiptContentProps) {
	return (
		<>
			<ReceiptHeader receiptNumber={receipt.receiptNumber ?? receipt.id} />
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
						<span className="text-sm text-end text-slate-700">
							Payment duration ({receipt.contract?.durationValue ?? receipt.totalInstallments ?? "-"}{" "}
							{receipt.contract?.durationUnit?.duration?.toLowerCase() === "weeks" ? "weeks" : "months"})
						</span>
					</header>
					<CustomCard className="grid grid-cols-1 gap-y-3 px-4 md:px-6 py-5 bg-card border-0">
						<KeyValueRow
							label="Property Price"
							value={receipt.contract?.property?.price ? `₦${Number(receipt.contract.property.price).toLocaleString()}` : "-"}
						/>
						<KeyValueRow label="Amount Paid" value={receipt.amountPaid ? `₦${Number(receipt.amountPaid).toLocaleString()}` : "-"} />
						<KeyValueRow label="VAT Amount" value={receipt.vatAmount ? `₦${Number(receipt.vatAmount).toLocaleString()}` : "-"} />
						<KeyValueRow
							label="VAT Rate"
							value={receipt.vatUsed !== null && receipt.vatUsed !== undefined ? `${(Number(receipt.vatUsed) * 100).toFixed(1)}%` : "-"}
						/>
						<KeyValueRow label="Interest" value={receipt.interest ? `₦${Number(receipt.interest).toLocaleString()}` : "-"} />
						<KeyValueRow label="Installment Progress" value={receipt.installmentProgress ?? "-"} />
						<KeyValueRow label="Total Installments" value={String(receipt.totalInstallments ?? "-")} />
					</CustomCard>
				</section>
				<section className="md:w-11/12 mx-auto mt-8 text-center py-2">
					<p className="text-sm sm:text-[.9rem]">
						Next payment date: {receipt.nextPaymentDate ? new Date(receipt.nextPaymentDate).toLocaleDateString() : "-"}
					</p>
				</section>

				<footer className="border-t-2 border-dashed pb-4 pt-3 text-center">
					<p className="text-stone-700 text-[.9rem]">
						Receipt issued by: <span className="font-medium text-black">{receipt.issuedBy?.fullName ?? receipt.issuedById ?? "-"}</span>
					</p>
				</footer>
			</main>
		</>
	);
}
