// React import not required with new JSX runtime
import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { selectTriggerStyle, tabListStyle, tabStyle } from "@/components/common/commonStyles";
import ActionButton from "@/components/base/ActionButton";
import ExportTrigger from "@/components/common/ExportTrigger";
import TabContractInformation from "./TabContractInformation";
import TabPaymentPlan from "./TabPaymentPlan";
import TabReceiptHistory from "./TabReceiptHistory";
import PageWrapper from "../../components/common/PageWrapper";
import { EditIcon, IconWrapper } from "../../assets/icons";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import CustomInput from "@/components/base/CustomInput";
import TabDocument from "./TabDocument";

export default function ContractDetails() {
	const [pauseOpen, setPauseOpen] = useState(false);
	const [terminateOpen, setTerminateOpen] = useState(false);
	const [pauseReason, setPauseReason] = useState("Health Crises");
	const [otherPauseReason, setOtherPauseReason] = useState("");

	return (
		<PageWrapper>
			<div className="flex items-center justify-between flex-wrap gap-4">
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
					<ActionButton className="px-6 font-normal rounded-sm" variant="primary" onClick={() => setPauseOpen(true)}>
						Pause
					</ActionButton>
					<ActionButton className="px-6 font-normal rounded-sm" variant="danger" onClick={() => setTerminateOpen(true)}>
						Terminate
					</ActionButton>

					{/* Pause dialog */}
					<Dialog open={pauseOpen} onOpenChange={setPauseOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Pause Contract</DialogTitle>
							</DialogHeader>
							<div className="mt-4">
								<label className="text-sm block mb-2">Reason For Pausing Contract*</label>
								<Select value={pauseReason} onValueChange={(v) => setPauseReason(v)}>
									<SelectTrigger className={selectTriggerStyle()}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Health Crises">Health Crises</SelectItem>
										<SelectItem value="Delayed Payment">Delayed Payment</SelectItem>
										<SelectItem value="Dispute Resolution">Dispute Resolution</SelectItem>
										<SelectItem value="Other Reasons">Other Reasons</SelectItem>
									</SelectContent>
								</Select>
							</div>
							{pauseReason === "Other Reasons" && (
								<div className="mt-2">
									<CustomInput
										label="Other Reasons"
										value={otherPauseReason}
										onChange={(e) => setOtherPauseReason(e.target.value)}
										placeholder="Enter Reason"
										className="w-full"
									/>
								</div>
							)}

							<DialogFooter className="mt-8">
								<ActionButton className="w-full bg-primary text-white py-3">Pause Contract</ActionButton>
							</DialogFooter>
						</DialogContent>
					</Dialog>

					{/* Terminate dialog */}
					<Dialog open={terminateOpen} onOpenChange={setTerminateOpen}>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Terminate Contract</DialogTitle>
							</DialogHeader>
							<div className="mt-4">
								<CustomInput
									label="Reason For Terminating Contract"
									required
									value={otherPauseReason}
									onChange={(e) => setOtherPauseReason(e.target.value)}
									placeholder="Enter reason"
									className="w-full"
								/>
							</div>
							<DialogFooter className="mt-8">
								<ActionButton className="w-full bg-primary text-white py-3">Terminate Now</ActionButton>
							</DialogFooter>
						</DialogContent>
					</Dialog>
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
