// React import not required with new JSX runtime
import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tabListStyle, tabStyle } from "@/components/common/commonStyles";
import ActionButton from "@/components/base/ActionButton";
import ExportTrigger from "@/components/common/ExportTrigger";
import TabContractInformation from "./TabContractInformation";
import TabPaymentPlan from "./TabPaymentPlan";
import TabReceiptHistory from "./TabReceiptHistory";
import TabDocument from "./TabDocument";
import PageWrapper from "../../components/common/PageWrapper";
import { EditIcon, IconWrapper } from "../../assets/icons";

export default function ContractDetails() {
	return (
		<PageWrapper>
			<div className="flex items-center justify-between gap-4">
				<PageTitles title="Contract" description="The contracts transaction between Kpo kpoi mingi investment and it customers" />

				<div className="flex items-center gap-3">
					<ExportTrigger className="text-primary" />
					<ActionButton
						variant="ghost"
						className="underline px-1"
						leftIcon={
							<IconWrapper className="text-xl">
								<EditIcon />
							</IconWrapper>
						}>
						Edit
					</ActionButton>
					<ActionButton className="px-6 font-normal rounded-sm" variant="primary">
						Pause
					</ActionButton>
					<ActionButton className="px-6 font-normal rounded-sm" variant="danger">
						Terminate
					</ActionButton>
				</div>
			</div>

			<CustomCard className="p-4 sm:p-6 border-0">
				<Tabs defaultValue="information">
					<TabsList className={tabListStyle}>
						<TabsTrigger value="information" className={tabStyle}>
							Contract information
						</TabsTrigger>
						<TabsTrigger value="plan" className={tabStyle}>
							Payment Plan & Schedule
						</TabsTrigger>
						<TabsTrigger value="receipt" className={tabStyle}>
							Receipt & Payment History
						</TabsTrigger>
						<TabsTrigger value="document" className={tabStyle}>
							Document
						</TabsTrigger>
					</TabsList>

					<div className="mt-6">
						<TabsContent value="information">
							<TabContractInformation />
						</TabsContent>

						<TabsContent value="plan">
							<TabPaymentPlan />
						</TabsContent>

						<TabsContent value="receipt">
							<TabReceiptHistory />
						</TabsContent>

						<TabsContent value="document">
							<TabDocument />
						</TabsContent>
					</div>
				</Tabs>
			</CustomCard>
		</PageWrapper>
	);
}
