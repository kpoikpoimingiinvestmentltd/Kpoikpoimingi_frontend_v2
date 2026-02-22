import CustomCard from "@/components/base/CustomCard";
import KeyValueRow from "@/components/common/KeyValueRow";
import ReceiptHeader from "@/components/common/ReceiptHeader";
import type { ReceiptDetail } from "@/types/receipt";

interface ReceiptContentProps {
	receipt: ReceiptDetail;
}

export default function ReceiptContent({ receipt }: ReceiptContentProps) {
	const isFullPayment = !receipt.totalInstallments || receipt.totalInstallments === 1;
	const isMigrated = receipt.customer?.isMigrated ?? false;

	const parseInstallmentProgress = (progress?: string) => {
		if (!progress) return { covered: 0, total: 0 };
		const match = progress.match(/(\d+)\/(\d+)/);
		if (match) return { covered: Number(match[1]), total: Number(match[2]) };
		return { covered: 0, total: 0 };
	};

	const installmentParsed = parseInstallmentProgress(receipt.installmentProgress);
	const remainingBalanceRaw =
		receipt.contract && (receipt.contract as any).outStandingBalance != null ? (receipt.contract as any).outStandingBalance : null;

	const receiptFooter = (
		<footer className="border-t-2 border-dashed dark:border-t-neutral-700 pb-4 pt-6 text-center">
			{receipt.issuedBy?.fullName && (
				<p className="text-gray-700 dark:text-gray-50 font-normal text-xs sm:text-[.9rem]">
					Receipt granted by: <span className="font-medium dark:text-gray-300 text-black">{receipt.issuedBy.fullName}</span>
				</p>
			)}
		</footer>
	);

	if (isFullPayment) {
		return (
			<>
				<ReceiptHeader receiptNumber={receipt.receiptNumber ?? receipt.id} />
				<main className="flex-grow">
					<section className="flex flex-col gap-y-1 mb-6 mt-4">
						<h3 className="text-center text-lg font-medium text-primary mb-4">Invoice With Full Payment</h3>
						<KeyValueRow label="Name" value={receipt.customer?.fullName ?? receipt.id ?? "-"} />
						<KeyValueRow label="Email" value={receipt.customer?.email ?? "-"} />
						<KeyValueRow label="Whatsapp number" value={receipt.customer?.phoneNumber ?? "-"} />
						<KeyValueRow label="Home Address" value={receipt.customer?.registrations?.[0]?.employmentDetails?.homeAddress ?? "-"} />
						<KeyValueRow
							label="Date"
							value={
								receipt.paymentDate
									? new Date(receipt.paymentDate).toLocaleDateString("en-GB")
									: receipt.createdAt
										? new Date(receipt.createdAt).toLocaleDateString("en-GB")
										: "-"
							}
						/>
					</section>

					{/* Payment Breakdown Section */}
					<section className="mt-4 flex flex-col gap-y-4">
						<header className="flex items-center justify-between gap-1 text-gray-800 dark:text-gray-100 bg-primary/10 dark:bg-primary/50 px-4 md:px-6 py-2.5 rounded-md">
							<h5 className="font-medium">Payment Breakdown</h5>
							<span className="text-sm font-medium text-center">Payment duration (One time)</span>
						</header>
						<CustomCard className="grid grid-cols-1 gap-y-1 px-4 py-5 bg-card border-0 dark:border">
							<KeyValueRow
								label="Property Name"
								value={receipt.contract?.property?.name ?? receipt.propertyName ?? "-"}
								leftClassName="text-gray-600"
								rightClassName="text-right font-medium"
							/>
							<KeyValueRow
								label="Total amount"
								value={receipt.totalAmount ? `₦${Number(receipt.totalAmount).toLocaleString()}` : "-"}
								leftClassName="text-gray-600"
								rightClassName="text-right font-medium"
							/>
							<KeyValueRow
								label="Amount paid"
								value={receipt.amountPaid ? `₦${Number(receipt.amountPaid).toLocaleString()}` : "-"}
								leftClassName="text-gray-600"
								rightClassName="text-right font-medium"
							/>
							<KeyValueRow
								label="VAT Amount"
								value={receipt.vatAmount ? `₦${Number(receipt.vatAmount).toLocaleString()}` : "-"}
								leftClassName="text-gray-600"
								rightClassName="text-right font-medium"
							/>
							<KeyValueRow
								label="Amount paid plus VAT"
								value={
									receipt.amountPaid && receipt.vatAmount ? `₦${(Number(receipt.amountPaid) + Number(receipt.vatAmount)).toLocaleString()}` : "-"
								}
								leftClassName="text-gray-600"
								rightClassName="text-right font-medium"
							/>
						</CustomCard>
					</section>

					<section className="md:w-11/12 mx-auto mt-8 font-normal text-center py-4">
						<p className="text-sm sm:text-[.9rem] dark:text-gray-200 text-gray-700">Thank you for completing your payment</p>
					</section>

					{receiptFooter}
				</main>
			</>
		);
	}

	return (
		<>
			<ReceiptHeader receiptNumber={receipt.receiptNumber ?? receipt.id} />
			<main className="flex-grow">
				<section className="flex flex-col gap-y-3 mb-4 mt-3">
					<h3 className="text-center text-sm sm:text-lg font-medium text-primary ">Invoice With Partial Payment</h3>
					<div className="gap-4">
						<KeyValueRow label="Name" value={receipt.customer?.fullName ?? receipt.id ?? "-"} />
						<KeyValueRow label="Email" value={receipt.customer?.email ?? "-"} />
						<KeyValueRow label="Whatsapp number" value={receipt.customer?.phoneNumber ?? "-"} />
						<KeyValueRow label="Home Address" value={receipt.customer?.registrations?.[0]?.employmentDetails?.homeAddress ?? "-"} />
						<KeyValueRow
							label="Date"
							value={
								receipt.paymentDate
									? new Date(receipt.paymentDate).toLocaleDateString("en-GB")
									: receipt.createdAt
										? new Date(receipt.createdAt).toLocaleDateString("en-GB")
										: "-"
							}
						/>
					</div>
				</section>

				{/* Payment Breakdown Section */}
				<section className="mt-4 flex flex-col gap-y-4">
					<header className="flex items-center justify-between gap-1 text-gray-800 dark:text-gray-100 bg-primary/10 dark:bg-primary/50 px-4 md:px-6 py-2.5 rounded-md">
						<h5 className="text-xs sm:text-sm font-medium">Payment Breakdown</h5>
						{!isMigrated && (
							<span className="text-xs sm:text-sm font-medium text-center">
								Payment duration ({receipt.contract?.durationValue ?? receipt.totalInstallments ?? "-"}{" "}
								{receipt.contract?.durationUnit?.duration?.toLowerCase() === "weeks" ? "weeks" : "months"})
							</span>
						)}
					</header>
					<CustomCard className="grid grid-cols-1 gap-y-1 px-4 py-5 bg-card border-0 dark:border">
						<KeyValueRow
							label="Property Name"
							value={receipt.contract?.property?.name ?? receipt.propertyName ?? "-"}
							leftClassName="text-gray-600"
							rightClassName="text-right font-medium"
						/>
						<KeyValueRow
							label="Total amount"
							value={receipt.contract?.property?.price ? `₦${Number(receipt.contract.property.price).toLocaleString()}` : "-"}
							leftClassName="text-gray-600"
							rightClassName="text-right font-medium"
						/>
						<KeyValueRow
							label="Starting amount"
							value={receipt.contract?.downPayment ? `₦${Number(receipt.contract.downPayment).toLocaleString()}` : "-"}
							leftClassName="text-gray-600"
							rightClassName="text-right font-medium"
						/>
						<KeyValueRow
							label="Amount paid plus VAT"
							value={receipt.amountPaid && receipt.vatAmount ? `₦${(Number(receipt.amountPaid) + Number(receipt.vatAmount)).toLocaleString()}` : "-"}
							leftClassName="text-gray-600"
							rightClassName="text-right font-medium"
						/>
						<KeyValueRow
							label="Total Amount Paid"
							value={receipt.amountPaid ? `₦${Number(receipt.amountPaid).toLocaleString()}` : "-"}
							leftClassName="text-gray-600"
							rightClassName="text-right font-medium"
						/>
						{!isMigrated && (
							<KeyValueRow
								label="Installment covered"
								value={`${installmentParsed.covered}/${installmentParsed.total}`}
								leftClassName="text-gray-600"
								rightClassName="text-right font-medium"
							/>
						)}
						<KeyValueRow
							label="Remaining balance"
							value={remainingBalanceRaw != null ? `₦${Number(remainingBalanceRaw).toLocaleString()}` : "-"}
							leftClassName="text-gray-600"
							rightClassName="text-right font-medium"
						/>
					</CustomCard>
				</section>

				{/* Next Payment Information */}
				{!isMigrated ? (
					<section className="md:w-11/12 mx-auto mt-4 text-center py-4 px-4">
						{installmentParsed.covered === installmentParsed.total && installmentParsed.total > 0 ? (
							<p className="text-xs font-normal sm:text-[.9rem] dark:text-gray-100 text-gray-700">
								Thank you for completing all your installment payments. We appreciate your timely payment and look forward to serving you again in the
								future.
							</p>
						) : (
							<p className="text-xs font-normal sm:text-[.9rem] dark:text-gray-100 text-gray-700">
								Next payment is due on the{" "}
								<span className="font-semibold">{receipt.nextPaymentDate ? new Date(receipt.nextPaymentDate).toLocaleDateString("en-GB") : "-"}</span>
								. Endeavour to make payment. Failure to make payment attracts an increase in accrued interest
							</p>
						)}
					</section>
				) : (
					<section className="md:w-11/12 mx-auto mt-4 text-center py-4 px-4">
						<p className="text-xs font-normal sm:text-[.9rem] dark:text-gray-100 text-gray-700">
							Thank you for your payment. We appreciate your business and look forward to serving you again in the future.
						</p>
					</section>
				)}
				{/* Footer */}
				{receiptFooter}
			</main>
		</>
	);
}
