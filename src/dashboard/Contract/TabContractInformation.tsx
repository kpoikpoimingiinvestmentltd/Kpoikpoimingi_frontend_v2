import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import KeyValueRow from "@/components/common/KeyValueRow";
import Badge from "@/components/base/Badge";

export default function TabContractInformation() {
	const contract = {
		customerName: "Tom Deo James",
		whatsapp: "+2348134567890",
		address: "Dummy address 23 street",
		businessAddress: "Dummy address 23 street",
		status: "Active",
		propertyName: "12 inches HP laptop",
		paymentType: "Hire purchase",
		downPayment: "80,000",
		paymentDuration: "6 months",
		totalPayable: "30,000",
		totalProductAmount: "500,000",
		contractRange: "20/4/2025 to 20/12/2025",
		assignedStaff: "Tony Donald Jude",
		interest: "18% applied",
		vat: "7.5% per instalment",
		startDate: "20/4/2025",
	};
	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<SectionTitle title="Contract Information" />
			<CustomCard className="mt-6 grid grid-cols-1 gap-6 md:p-8 bg-card">
				<div>
					<div className="grid grid-cols-1 gap-y-4 gap-x-8 text-sm">
						<KeyValueRow
							label="Customer full name"
							value={contract.customerName}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Whatsapp number"
							value={contract.whatsapp}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow label="Address" value={contract.address} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							label="Business address"
							value={contract.businessAddress}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Customer status"
							value={<Badge value={contract.status} />}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Property Name"
							value={contract.propertyName}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Payment type"
							value={contract.paymentType}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Down payment"
							value={contract.downPayment}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Payment duration"
							value={contract.paymentDuration}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Total payable"
							value={contract.totalPayable}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Total product amount"
							value={contract.totalProductAmount}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Contract start & End date"
							value={contract.contractRange}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Assigned staff"
							value={contract.assignedStaff}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Interest rate applied"
							value={contract.interest}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow label="VAT breakdown" value={contract.vat} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Start date" value={contract.startDate} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					</div>
				</div>
			</CustomCard>
		</CustomCard>
	);
}
