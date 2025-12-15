import { useParams } from "react-router";
import { useGetContractDebtDetails } from "@/api/contracts";
import PageTitles from "@/components/common/PageTitles";
import KeyValueRow from "@/components/common/KeyValueRow";
import CustomCard from "@/components/base/CustomCard";
import Image from "@/components/base/Image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { tableHeaderRowStyle } from "@/components/common/commonStyles";
import { CardSkeleton } from "@/components/common/Skeleton";
import EmptyData from "@/components/common/EmptyData";
import Badge from "@/components/base/Badge";
import PageWrapper from "@/components/common/PageWrapper";

export default function DebtDetails() {
	const { id } = useParams<{ id: string }>();
	const { data: debtDetails, isLoading, error } = useGetContractDebtDetails(id || "");

	if (isLoading) {
		return (
			<PageWrapper>
				<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
					<PageTitles title="Debt Details" description="View detailed debt and payment information" />
				</div>
				<CustomCard className="bg-white flex-grow w-full rounded-lg p-6 border border-gray-100">
					<div className="flex flex-col gap-y-4">
						<CardSkeleton lines={3} />
						<CardSkeleton lines={3} />
						<CardSkeleton lines={3} />
					</div>
				</CustomCard>
			</PageWrapper>
		);
	}

	if (error || !debtDetails) {
		return (
			<PageWrapper>
				<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
					<PageTitles title="Debt Details" description="View detailed debt and payment information" />
				</div>
				<EmptyData text="Unable to load debt details" />
			</PageWrapper>
		);
	}

	const contractInfo = debtDetails.contractInfo;
	const paymentSummary = debtDetails.paymentSummary;
	const nextPayment = debtDetails.nextPayment;
	const paymentSchedule = debtDetails.paymentSchedule || [];

	return (
		<PageWrapper>
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Debt Details" description={`Contract ${contractInfo.contractCode} - ${contractInfo.customerName}`} />
			</div>
			{/* Contract Information Card */}
			<CustomCard className="bg-white w-full rounded-lg p-6 border border-gray-100 mb-6">
				<div className="flex flex-col md:flex-row gap-6">
					{/* Property Image */}
					<div className="flex-shrink-0 flex items-center justify-center">
						<Image src={contractInfo.propertyImage} alt={contractInfo.propertyName} className="w-40 h-40 object-cover rounded-lg" />
					</div>

					{/* Contract Info */}
					<div className="flex-grow">
						<h2 className="text-xl font-semibold mb-4">{contractInfo.propertyName}</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="text-sm text-gray-600">Contract Code</label>
								<p className="font-medium">{contractInfo.contractCode}</p>
							</div>
							<div>
								<label className="text-sm text-gray-600">Customer Name</label>
								<p className="font-medium">{contractInfo.customerName}</p>
							</div>
							<div>
								<label className="text-sm text-gray-600">Email</label>
								<p className="font-medium">{contractInfo.customerEmail}</p>
							</div>
							<div>
								<label className="text-sm text-gray-600">Phone Number</label>
								<p className="font-medium">{contractInfo.phoneNumber}</p>
							</div>
							<div>
								<label className="text-sm text-gray-600">Property Amount</label>
								<p className="font-medium">₦{parseFloat(contractInfo.propertyAmount).toLocaleString()}</p>
							</div>
							<div>
								<label className="text-sm text-gray-600">Quantity</label>
								<p className="font-medium">{contractInfo.productQuantity}</p>
							</div>
						</div>
					</div>
				</div>
			</CustomCard>
			{/* Payment Summary Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
				{/* Total Amount Paid Card */}
				<CustomCard className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
					<div className="text-sm text-gray-700 mb-2">Total Amount Paid</div>
					<div className="text-3xl font-bold text-green-700">₦{paymentSummary.totalAmountPaid.toLocaleString()}</div>
					<div className="text-xs text-gray-600 mt-2">
						{paymentSummary.paidPayments} of {paymentSummary.totalInstallments} installments paid
					</div>
				</CustomCard>

				{/* Outstanding Balance Card */}
				<CustomCard className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
					<div className="text-sm text-gray-700 mb-2">Outstanding Balance</div>
					<div className="text-3xl font-bold text-orange-700">₦{paymentSummary.outstandingBalance.toLocaleString()}</div>
					<div className="text-xs text-gray-600 mt-2">{paymentSummary.unpaidPayments} unpaid installments</div>
				</CustomCard>

				{/* Progress Card */}
				<CustomCard className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
					<div className="text-sm text-gray-700 mb-2">Payment Progress</div>
					<div className="text-3xl font-bold text-blue-700">{paymentSummary.progressPercentage}%</div>
					<div className="text-xs text-gray-600 mt-2">{paymentSummary.installmentProgress}</div>
					<div className="mt-4 bg-white rounded-full h-2 overflow-hidden">
						<div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${paymentSummary.progressPercentage}%` }} />
					</div>
				</CustomCard>
			</div>
			{/* Next Payment Card */}
			{nextPayment && (
				<CustomCard className="bg-white w-full rounded-lg p-6 border border-gray-100 mb-6">
					<h3 className="text-lg font-semibold mb-4">Next Payment Due</h3>
					<div className="space-y-4">
						<KeyValueRow
							label="Payment Number"
							value={nextPayment.paymentNumber}
							leftClassName="text-sm text-gray-600"
							rightClassName="text-xl font-bold"
						/>
						<KeyValueRow
							label="Amount Due"
							value={`₦${nextPayment.amount.toLocaleString()}`}
							leftClassName="text-sm text-gray-600"
							rightClassName="text-xl font-bold"
						/>
						<KeyValueRow
							label="Due Date"
							value={new Date(nextPayment.dueDate).toLocaleDateString()}
							leftClassName="text-sm text-gray-600"
							rightClassName="text-xl font-bold"
						/>
						<KeyValueRow
							label="Status"
							value={<Badge value={nextPayment.isOverdue ? "Overdue" : "Pending"} size="sm" />}
							leftClassName="text-sm text-gray-600"
						/>
					</div>
				</CustomCard>
			)}{" "}
			{/* Payment Schedule Table */}
			<CustomCard className="bg-white w-full rounded-lg p-6 border border-gray-100">
				<h3 className="text-lg font-semibold mb-4">Payment Schedule</h3>
				<div className="overflow-x-auto">
					<Table>
						<TableHeader className={tableHeaderRowStyle}>
							<TableRow className="bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
								<TableHead>Payment #</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Due Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Paid Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paymentSchedule.map((payment, idx) => (
								<TableRow key={idx} className="hover:bg-[#F6FBFF]">
									<TableCell className="text-[#13121266] py-4">{payment.paymentNumber}</TableCell>
									<TableCell className="text-[#13121266] py-4">₦{payment.amount.toLocaleString()}</TableCell>
									<TableCell className="text-[#13121266] py-4">{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
									<TableCell className="text-[#13121266] py-4">
										<Badge value={payment.status} status={payment.isOverdue ? "banned" : undefined} size="sm" />
									</TableCell>
									<TableCell className="text-[#13121266] py-4">₦{payment.paidAmount.toLocaleString()}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CustomCard>
		</PageWrapper>
	);
}
