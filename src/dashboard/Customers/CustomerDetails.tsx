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
import { useEffect, useState } from "react";
import { useGetCustomer } from "@/api/customer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, EditIcon, IconWrapper } from "@/assets/icons";
import EditCustomerModal from "./EditCustomerModal";

export default function CustomerDetails() {
	const { id } = useParams();
	const { data: customer } = useGetCustomer(id as any, true);
	const [isEditOpen, setIsEditOpen] = useState(false);

	useEffect(() => {
		if (customer) {
			console.log("Fetched customer details:", customer);
		}
	}, [customer]);

	return (
		<PageWrapper className="flex flex-col gap-6">
			<div className="flex items-center justify-between flex-wrap gap-4">
				<div>
					<h1 className="text-2xl font-semibold">Customers Details</h1>
					<p className="text-sm text-muted-foreground mt-1">{(customer as any)?.fullName}</p>
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
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-slate-50 transition">
								<span>Active Contract</span>
								<IconWrapper>
									<ChevronDownIcon />
								</IconWrapper>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuItem>Active Contract</DropdownMenuItem>
							<DropdownMenuItem>Inactive Contract</DropdownMenuItem>
							<DropdownMenuItem>All Contracts</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
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
							<TabCustomerDetails customer={customer} />
						</TabsContent>
						<TabsContent value="payments">
							<TabPaymentHistory />
						</TabsContent>
						<TabsContent value="receipt">
							<TabReceipt />
						</TabsContent>
						<TabsContent value="document">
							<TabDocument />
						</TabsContent>
						<TabsContent value="contract">
							<TabContractInfo />
						</TabsContent>
					</div>
				</Tabs>
			</CustomCard>

			<EditCustomerModal open={isEditOpen} onOpenChange={setIsEditOpen} initial={customer} />
		</PageWrapper>
	);
}
