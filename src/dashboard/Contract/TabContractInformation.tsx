import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import KeyValueRow from "@/components/common/KeyValueRow";
import Badge from "@/components/base/Badge";

export default function TabContractInformation({ contract }: { contract: any }) {
	const contractData = {
		customerName: contract?.customer?.fullName || "N/A",
		whatsapp: contract?.customer?.phoneNumber || "N/A",
		address: contract?.customer?.houseAddress || "N/A",
		businessAddress: contract?.customer?.businessAddress || "N/A",
		status: contract?.status?.status || "N/A",
		propertyName: contract?.property?.name || "N/A",
		paymentType: contract?.paymentType?.type || "N/A",
		downPayment: `₦${parseInt(contract?.downPayment || "0").toLocaleString()}` || "N/A",
		paymentDuration: `${contract?.durationValue || 0} ${contract?.durationUnit?.duration || ""}` || "N/A",
		totalPayable: `₦${parseInt(contract?.outStandingBalance || "0").toLocaleString()}` || "N/A",
		totalProductAmount: `₦${parseInt(contract?.property?.price || "0").toLocaleString()}` || "N/A",
		contractRange:
			contract?.startDate && contract?.endDate
				? `${new Date(contract.startDate).toLocaleDateString()} to ${new Date(contract.endDate).toLocaleDateString()}`
				: "N/A",
		assignedStaff: contract?.createdBy?.fullName || "N/A",
		interest: contract?.interestRate ? `${contract.interestRate}%` : "N/A",
		vat: contract?.vatPercentage ? `${contract.vatPercentage}%` : "N/A",
		startDate: contract?.startDate ? new Date(contract.startDate).toLocaleDateString() : "N/A",
	};
	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<SectionTitle title="Contract Information" />
			<CustomCard className="mt-6 grid grid-cols-1 gap-6 md:p-8 bg-card">
				<div>
					<div className="grid grid-cols-1 gap-y-4 gap-x-8 text-sm">
						<KeyValueRow
							label="Customer full name"
							value={contractData.customerName}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Whatsapp number"
							value={contractData.whatsapp}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow label="Address" value={contractData.address} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							label="Business address"
							value={contractData.businessAddress}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Customer status"
							value={<Badge value={contractData.status} />}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Property Name"
							value={contractData.propertyName}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Payment type"
							value={contractData.paymentType}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Down payment"
							value={contractData.downPayment}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Payment duration"
							value={contractData.paymentDuration}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Total payable"
							value={contractData.totalPayable}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Total product amount"
							value={contractData.totalProductAmount}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Contract start & End date"
							value={contractData.contractRange}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Assigned staff"
							value={contractData.assignedStaff}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Interest rate applied"
							value={contractData.interest}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow label="VAT breakdown" value={contractData.vat} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							label="Start date"
							value={contractData.startDate}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
					</div>
				</div>
			</CustomCard>
		</CustomCard>
	);
}
