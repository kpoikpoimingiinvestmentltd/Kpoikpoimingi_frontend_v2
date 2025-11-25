import CustomCard from "@/components/base/CustomCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tabListStyle, tabStyle } from "../../components/common/commonStyles";
import TabCustomerDetails from "./TabCustomerDetails";
import TabPaymentHistory from "./TabPaymentHistory";
import TabReceipt from "./TabReceipt";
import TabDocument from "./TabDocument";
import TabContractInfo from "./TabContractInfo";
import PageWrapper from "../../components/common/PageWrapper";
import { useParams } from "react-router";
import { useState } from "react";
import {
	useGetCustomer,
	useGetCustomerContracts,
	useGetCustomerPayments,
	useGetCustomerDocuments,
	useGetCustomerReceipts,
	useGetCustomerApprovedRegistrations,
} from "@/api/customer";
import { EditIcon, IconWrapper } from "@/assets/icons";
import EditCustomerModal from "./EditCustomerModal";

export default function CustomerDetails() {
	const { id } = useParams();
	const { data: customer } = useGetCustomer(id, true);
	const { data: approvedRegistrations } = useGetCustomerApprovedRegistrations(id, true);
	const { data: contracts, isLoading: isLoadingContracts } = useGetCustomerContracts(id, true);
	const { data: payments } = useGetCustomerPayments(id, true);
	const { data: documents } = useGetCustomerDocuments(id, true);
	const { data: receipts } = useGetCustomerReceipts(id, true);
	const [isEditOpen, setIsEditOpen] = useState(false);

	// Use the first approved registration if available, otherwise use customer data
	const registrationForEdit = Array.isArray(approvedRegistrations) ? approvedRegistrations[0] : approvedRegistrations || customer;

	const customerAny = customer as any;
	const paymentsAny = payments as any;
	const receiptsAny = receipts as any;
	const documentsAny = documents as any;
	const contractsAny = contracts as any;

	return (
		<PageWrapper className="flex flex-col gap-6">
			<div className="flex items-center justify-between flex-wrap gap-4">
				<div>
					<h1 className="text-xl font-medium">Customers Details</h1>
					<p className="text-sm text-muted-foreground mt-1">{(customer as any)?.fullName ?? (customer as any)?.name}</p>
				</div>
				<div className="flex items-center gap-3">
					<button
						onClick={() => setIsEditOpen(true)}
						className="flex items-center gap-0.5 px-4 py-2 text-sm text-black underline hover:bg-slate-50 rounded-md transition">
						<IconWrapper className="text-xl">
							<EditIcon />
						</IconWrapper>
						<span>Edit</span>
					</button>
				</div>
			</div>

			<CustomCard className="p-4 sm:p-6 border-0">
				<Tabs defaultValue="details">
					<TabsList className={tabListStyle}>
						<TabsTrigger value="details" className={tabStyle}>
							Customer details
						</TabsTrigger>
						<TabsTrigger value="contract" className={tabStyle}>
							Contracts
						</TabsTrigger>
						<TabsTrigger value="payments" className={tabStyle}>
							Payment History
						</TabsTrigger>
						<TabsTrigger value="receipt" className={tabStyle}>
							Receipt
						</TabsTrigger>
						<TabsTrigger value="document" className={tabStyle}>
							Document
						</TabsTrigger>
					</TabsList>

					<div className="mt-6">
						<TabsContent value="details">
							<TabCustomerDetails customer={customerAny} />
						</TabsContent>
						<TabsContent value="payments">
							<TabPaymentHistory payments={paymentsAny} />
						</TabsContent>
						<TabsContent value="receipt">
							<TabReceipt receipts={receiptsAny} />
						</TabsContent>
						<TabsContent value="document">
							<TabDocument documents={documentsAny} />
						</TabsContent>
						<TabsContent value="contract">
							<TabContractInfo contracts={contractsAny} isLoading={isLoadingContracts} />
						</TabsContent>
					</div>
				</Tabs>
			</CustomCard>

			<EditCustomerModal open={isEditOpen} onOpenChange={setIsEditOpen} initial={registrationForEdit} />
		</PageWrapper>
	);
}
