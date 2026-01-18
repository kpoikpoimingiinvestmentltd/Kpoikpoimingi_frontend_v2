import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { selectTriggerStyle, tabListStyle, tabStyle } from "@/components/common/commonStyles";
import ActionButton from "@/components/base/ActionButton";
import TabContractInformation from "./TabContractInformation";
import TabPaymentPlan from "./TabPaymentPlan";
import TabPaymentLinks from "./TabPaymentLinks";
import TabReceiptHistory from "./TabReceiptHistory";
import PageWrapper from "../../components/common/PageWrapper";
// import { EditIcon, IconWrapper } from "../../assets/icons";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import CustomInput from "@/components/base/CustomInput";
import TabDocument from "./TabDocument";
import { useParams } from "react-router";
import { useGetContractById, usePauseContract, useResumeContract, useTerminateContract } from "@/api/contracts";
import { extractErrorMessage } from "@/lib/utils";
import { Skeleton } from "@/components/common/Skeleton";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { useCanPerformAction } from "@/hooks/usePermissions";
import { EditIcon, IconWrapper } from "../../assets/icons";
import EditContractModal from "@/components/common/EditContractModal";

export default function ContractDetails() {
	const { id } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const { data: contract, isLoading } = useGetContractById(id || "", !!id);
	const queryClient = useQueryClient();
	const canTerminateContract = useCanPerformAction("contractTerminate");

	const [editOpen, setEditOpen] = useState(false);
	const [pauseOpen, setPauseOpen] = useState(false);
	const [terminateOpen, setTerminateOpen] = useState(false);
	const [pauseReason, setPauseReason] = useState("Health Crises");
	const [otherPauseReason, setOtherPauseReason] = useState("");

	// Initialize active tab from URL params
	const [activeTab, setActiveTab] = useState(() => {
		return searchParams.get("tab") || "information";
	});

	// Update URL when active tab changes
	React.useEffect(() => {
		const params = new URLSearchParams(searchParams);
		params.set("tab", activeTab);
		setSearchParams(params, { replace: true });
	}, [activeTab, setSearchParams]);

	const pauseMutation = usePauseContract(
		(response) => {
			const message = (response as { message?: string })?.message ?? "Contract paused successfully";
			toast.success(message);
			setPauseOpen(false);
			setPauseReason("Health Crises");
			setOtherPauseReason("");
			queryClient.invalidateQueries({ queryKey: ["contract", id] });
		},
		(err) => {
			const message = (err as { message?: string })?.message ?? "Failed to pause contract";
			toast.error(message);
		}
	);

	const resumeMutation = useResumeContract(
		(response) => {
			const message = (response as { message?: string })?.message ?? "Contract resumed successfully";
			toast.success(message);
			queryClient.invalidateQueries({ queryKey: ["contract", id] });
		},
		(err) => {
			const message = (err as { message?: string })?.message ?? "Failed to resume contract";
			toast.error(message);
		}
	);

	const terminateMutation = useTerminateContract(
		(response) => {
			const message = (response as { message?: string })?.message ?? "Contract terminated successfully";
			toast.success(message);
			setTerminateOpen(false);
			setOtherPauseReason("");
			queryClient.invalidateQueries({ queryKey: ["contract", id] });
		},
		(err) => {
			const message = extractErrorMessage(err, "Failed to terminate contract");
			toast.error(message);
		}
	);

	const handlePauseContract = () => {
		if (!id) return;
		const reason = pauseReason === "Other Reasons" ? otherPauseReason : pauseReason;
		if (!reason.trim()) return;
		pauseMutation.mutate({ id, reason });
	};

	const handleResumeContract = () => {
		if (!id) return;
		resumeMutation.mutate(id);
	};

	const handleTerminateContract = () => {
		if (!id) return;
		const reason = otherPauseReason || "";
		if (!reason.trim()) {
			toast.error("Please provide a reason for terminating the contract");
			return;
		}
		terminateMutation.mutate({ id, reason });
	};

	if (isLoading) {
		return (
			<PageWrapper>
				<div className="flex items-center justify-center min-h-96">
					<Skeleton className="w-full h-96">
						<div className="space-y-4">
							<div className="h-8 w-1/3 bg-gray-200 rounded" />
							<div className="h-4 w-full bg-gray-200 rounded" />
							<div className="h-4 w-full bg-gray-200 rounded" />
						</div>
					</Skeleton>
				</div>
			</PageWrapper>
		);
	}

	if (!contract) {
		return (
			<PageWrapper>
				<div className="flex items-center justify-center min-h-96">
					<p>Contract not found</p>
				</div>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<div className="flex items-center justify-between flex-wrap gap-4">
				<PageTitles title="Contract" description="The contracts transaction between Kpo kpoi mingi investment and it customers" />

				<div className="flex items-center gap-3">
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
					{!contract?.isPaused ? (
						<ActionButton className="px-6 font-normal rounded-sm" variant="danger" onClick={() => setPauseOpen(true)}>
							Pause
						</ActionButton>
					) : (
						<ActionButton
							className="px-6 font-normal rounded-sm"
							variant="success"
							onClick={handleResumeContract}
							disabled={resumeMutation.status === "pending"}>
							{resumeMutation.status === "pending" ? "Resuming..." : "Resume"}
						</ActionButton>
					)}
					{canTerminateContract && (
						<ActionButton className="px-6 font-normal rounded-sm" variant="danger" onClick={() => setTerminateOpen(true)}>
							Terminate
						</ActionButton>
					)}{" "}
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
								<ActionButton
									className="w-full bg-primary text-white py-3"
									onClick={handlePauseContract}
									disabled={pauseMutation.status === "pending"}>
									{pauseMutation.status === "pending" ? "Pausing..." : "Pause Contract"}
								</ActionButton>
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
								<ActionButton
									className="w-full bg-primary text-white py-3"
									onClick={handleTerminateContract}
									disabled={terminateMutation.status === "pending"}>
									{terminateMutation.status === "pending" ? "Terminating..." : "Terminate Now"}
								</ActionButton>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<CustomCard className="p-4 sm:p-6 border-0">
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className={tabListStyle}>
						<TabsTrigger value="information" className={tabStyle}>
							Contract information
						</TabsTrigger>
						<TabsTrigger value="plan" className={tabStyle}>
							Payment Plan & Schedule
						</TabsTrigger>
						<TabsTrigger value="payment-links" className={tabStyle}>
							Payment Links
						</TabsTrigger>
						<TabsTrigger value="receipt" className={tabStyle}>
							Receipt & Payment History
						</TabsTrigger>
						<TabsTrigger value="document" className={tabStyle}>
							Document
						</TabsTrigger>
					</TabsList>

					<div className="mt-4">
						<TabsContent value="information">
							<TabContractInformation contract={contract} />
						</TabsContent>

						<TabsContent value="plan">
							<TabPaymentPlan contract={contract} />
						</TabsContent>

						<TabsContent value="payment-links">
							<TabPaymentLinks contract={contract} />
						</TabsContent>

						<TabsContent value="receipt">
							<TabReceiptHistory contract={contract} />
						</TabsContent>

						<TabsContent value="document">
							<TabDocument contract={contract} />
						</TabsContent>
					</div>
				</Tabs>
			</CustomCard>

			{/* Edit Contract Modal */}
			<EditContractModal isOpen={editOpen} onClose={() => setEditOpen(false)} contract={contract} />
		</PageWrapper>
	);
}
