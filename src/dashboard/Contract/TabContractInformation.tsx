import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import KeyValueRow from "@/components/common/KeyValueRow";
import Badge from "@/components/base/Badge";
import ActionButton from "@/components/base/ActionButton";
import ContractSuccessModal from "./ContractSuccessModal";
import { useCreatePaymentLink } from "@/api/contracts";
import { toast } from "sonner";
import React from "react";

export default function TabContractInformation({ contract }: { contract: Record<string, unknown> }) {
	const [showSuccess, setShowSuccess] = React.useState(false);
	const [generatedLink, setGeneratedLink] = React.useState<string>("");

	const createPaymentLinkMutation = useCreatePaymentLink(
		(res) => {
			if (res?.paymentLink) {
				setGeneratedLink(res.paymentLink);
				setShowSuccess(true);
				toast.success("Payment link created successfully");
			}
		},
		(err) => {
			toast.error("Failed to create payment link");
			console.error(err);
		}
	);

	const handleCreatePaymentLink = async () => {
		const contractId = contract?.id as string;
		const customerId = contract?.customerId as string;
		const amount = contract?.outStandingBalance as string;
		const paymentTypeId = contract?.paymentTypeId as number;

		if (!contractId || !customerId || !amount) {
			toast.error("Invalid contract data");
			return;
		}

		const payload = {
			contractId,
			customerId,
			amount: String(amount),
			paymentMethodId: paymentTypeId,
			dueDate: new Date().toISOString(),
			remarks: "Payment for contract",
		};

		await createPaymentLinkMutation.mutateAsync(payload);
	};
	const contractData = {
		customerName: ((contract?.customer as Record<string, unknown>)?.fullName as string) || "N/A",
		whatsapp: ((contract?.customer as Record<string, unknown>)?.phoneNumber as string) || "N/A",
		address: ((contract?.customer as Record<string, unknown>)?.houseAddress as string) || "N/A",
		businessAddress: ((contract?.customer as Record<string, unknown>)?.businessAddress as string) || "N/A",
		status: ((contract?.status as Record<string, unknown>)?.status as string) || "N/A",
		propertyName: ((contract?.property as Record<string, unknown>)?.name as string) || "N/A",
		paymentType: ((contract?.paymentType as Record<string, unknown>)?.type as string) || "N/A",
		downPayment: `₦${parseInt((contract?.downPayment as string) || "0").toLocaleString()}` || "N/A",
		paymentDuration:
			`${(contract?.durationValue as number) || 0} ${((contract?.durationUnit as Record<string, unknown>)?.duration as string) || ""}` || "N/A",
		totalPayable: `₦${parseInt((contract?.outStandingBalance as string) || "0").toLocaleString()}` || "N/A",
		totalProductAmount: `₦${parseInt(((contract?.property as Record<string, unknown>)?.price as string) || "0").toLocaleString()}` || "N/A",
		contractRange:
			(contract?.startDate as string) && (contract?.endDate as string)
				? `${new Date(contract.startDate as string).toLocaleDateString()} to ${new Date(contract.endDate as string).toLocaleDateString()}`
				: "N/A",
		assignedStaff: ((contract?.createdBy as Record<string, unknown>)?.fullName as string) || "N/A",
		interest: (contract?.interestRate as number) ? `${contract.interestRate}%` : "N/A",
		vat: (contract?.vatPercentage as number) ? `${contract.vatPercentage}%` : "N/A",
		startDate: (contract?.startDate as string) ? new Date(contract.startDate as string).toLocaleDateString() : "N/A",
	};
	return (
		<>
			<CustomCard className="mt-4 border-none p-0 bg-white">
				<div className="flex items-center justify-between mb-4">
					<SectionTitle title="Contract Information" />
					<ActionButton
						onClick={handleCreatePaymentLink}
						isLoading={createPaymentLinkMutation.isPending}
						disabled={createPaymentLinkMutation.isPending}
						className="bg-primary text-white">
						Create Payment Link
					</ActionButton>
				</div>
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

			<ContractSuccessModal
				open={showSuccess}
				onOpenChange={setShowSuccess}
				link={generatedLink}
				onSend={(email) => console.log("send-email", email, generatedLink)}
			/>
		</>
	);
}
