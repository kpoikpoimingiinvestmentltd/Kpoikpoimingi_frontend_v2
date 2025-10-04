import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tabListStyle, tabStyle } from "../../components/common/commonStyles";
import TabCustomerDetails from "./TabCustomerDetails";
import TabPaymentHistory from "./TabPaymentHistory";
import TabReceipt from "./TabReceipt";
import TabDocument from "./TabDocument";
import TabContractInfo from "./TabContractInfo";

export default function CustomerDetails() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<PageTitles title="Customer details" description="" />
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
							<TabCustomerDetails />
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
		</div>
	);
}
