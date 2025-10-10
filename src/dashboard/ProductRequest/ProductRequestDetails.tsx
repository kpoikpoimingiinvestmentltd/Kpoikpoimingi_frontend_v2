import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import PageWrapper from "@/components/common/PageWrapper";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tabListStyle, tabStyle } from "@/components/common/commonStyles";
import ActionButton from "@/components/base/ActionButton";
import { useState } from "react";
import ExportTrigger from "@/components/common/ExportTrigger";
import TabProductInformation from "./TabProductInformation";
import TabCustomerDetails from "./TabCustomerDetails";
import TabNextOfKin from "./TabNextOfKin";
import TabEmploymentDetails from "./TabEmploymentDetails";
import TabGuarantorDetails from "./TabGuarantorDetails";
import { EditIcon, IconWrapper } from "@/assets/icons";
import EditProductRequest from "./EditProductRequestModal";
// no extra react hooks needed here

export default function ProductRequestDetails() {
	const [editOpen, setEditOpen] = useState(false);

	const handleSave = (_data: any) => {
		// TODO: persist changes
		setEditOpen(false);
	};

	return (
		<PageWrapper>
			<div className="flex items-center justify-between flex-wrap gap-4">
				<PageTitles title="Product Request (Hire purchase)" description="This is all the product request from customers" />

				<div className="flex items-center flex-wrap gap-3">
					<ExportTrigger className="text-primary" />
					<ActionButton
						variant="ghost"
						className="underline px-1"
						leftIcon={
							<IconWrapper className="text-xl">
								<EditIcon />
							</IconWrapper>
						}
						onClick={() => setEditOpen(true)}>
						Edit
					</ActionButton>
					<ActionButton className="px-6 font-normal rounded-sm" variant="primary">
						Send Contract
					</ActionButton>
					<ActionButton className="px-6 font-normal rounded-sm" variant="danger">
						Decline
					</ActionButton>
				</div>
			</div>

			<CustomCard className="p-4 sm:p-6 border-0">
				<Tabs defaultValue="information">
					<TabsList className={tabListStyle}>
						<TabsTrigger value="information" className={tabStyle}>
							Property Details
						</TabsTrigger>
						<TabsTrigger value="customer" className={tabStyle}>
							Customer Details
						</TabsTrigger>
						<TabsTrigger value="kin" className={tabStyle}>
							Next of Kin
						</TabsTrigger>
						<TabsTrigger value="employment" className={tabStyle}>
							Employment Details
						</TabsTrigger>
						<TabsTrigger value="guarantor" className={tabStyle}>
							Guarantor Details
						</TabsTrigger>
					</TabsList>

					<div className="mt-6">
						<TabsContent value="information">
							<TabProductInformation />
						</TabsContent>

						<TabsContent value="customer">
							<TabCustomerDetails />
						</TabsContent>

						<TabsContent value="kin">
							<TabNextOfKin />
						</TabsContent>

						<TabsContent value="employment">
							<TabEmploymentDetails />
						</TabsContent>

						<TabsContent value="guarantor">
							<TabGuarantorDetails />
						</TabsContent>
					</div>
				</Tabs>
			</CustomCard>
			<EditProductRequest open={editOpen} onOpenChange={setEditOpen} onSave={handleSave} />
		</PageWrapper>
	);
}
