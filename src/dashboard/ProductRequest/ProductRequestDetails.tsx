import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import PageWrapper from "@/components/common/PageWrapper";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tabListStyle, tabStyle } from "@/components/common/commonStyles";
import ActionButton from "@/components/base/ActionButton";
import { useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useDeleteRegistration, useGetProductRequestById, useApproveRegistration } from "@/api/productRequest";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router";
import { _router } from "@/routes/_router";
import ExportTrigger from "@/components/common/ExportTrigger";
import TabProductInformation from "./TabProductInformation";
import TabCustomerDetails from "./TabCustomerDetails";
import TabNextOfKin from "./TabNextOfKin";
import TabEmploymentDetails from "./TabEmploymentDetails";
import TabGuarantorDetails from "./TabGuarantorDetails";
import { EditIcon, IconWrapper } from "@/assets/icons";
import EditProductRequest from "./EditProductRequestModal";

export default function ProductRequestDetails() {
	const [editOpen, setEditOpen] = useState(false);

	const params = useParams();
	const id = params.id;
	const navigate = useNavigate();

	const { data: registrationData } = useGetProductRequestById(id || "");

	const queryClient = useQueryClient();
	const deleteMutation = useDeleteRegistration();
	const approveMutation = useApproveRegistration();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmAction, setConfirmAction] = useState<"delete" | "approve" | null>(null);

	const handleSave = (_data: unknown) => {
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
					<ActionButton
						className="px-6 font-normal rounded-sm"
						variant="success"
						onClick={() => {
							setConfirmAction("approve");
							setConfirmOpen(true);
						}}>
						Approve
					</ActionButton>
					<ActionButton className="px-6 font-normal rounded-sm" variant="primary">
						Send Contract
					</ActionButton>
					<ActionButton className="px-6 font-normal rounded-sm" variant="danger" onClick={() => setConfirmOpen(true)}>
						Decline
					</ActionButton>
					<ActionButton
						className="px-6 font-normal rounded-sm"
						variant="danger"
						onClick={() => {
							setConfirmAction("delete");
							setConfirmOpen(true);
						}}>
						Delete
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
							<TabProductInformation data={registrationData} />
						</TabsContent>

						<TabsContent value="customer">
							<TabCustomerDetails data={registrationData} />
						</TabsContent>

						<TabsContent value="kin">
							<TabNextOfKin data={registrationData} />
						</TabsContent>

						<TabsContent value="employment">
							<TabEmploymentDetails data={registrationData} />
						</TabsContent>

						<TabsContent value="guarantor">
							<TabGuarantorDetails data={registrationData} />
						</TabsContent>
					</div>
				</Tabs>
			</CustomCard>
			<ConfirmModal
				open={confirmOpen}
				onOpenChange={(o) => setConfirmOpen(o)}
				title={confirmAction === "approve" ? "Approve registration" : "Delete registration"}
				subtitle={
					confirmAction === "approve"
						? "Are you sure you want to approve this registration? A customer account will be created."
						: "Are you sure you want to delete this registration? This action cannot be undone."
				}
				actions={[
					{ label: "Cancel", onClick: () => true, variant: "ghost" },
					{
						label:
							confirmAction === "approve"
								? approveMutation.isPending
									? "Approving..."
									: "Approve"
								: deleteMutation.isPending
								? "Deleting..."
								: "Delete",
						onClick: async () => {
							if (!id) return false;
							try {
								if (confirmAction === "approve") {
									const result = await approveMutation.mutateAsync(id);
									toast.success(result.message || "Registration approved successfully");
									queryClient.invalidateQueries({ queryKey: ["product-requests"] });
									queryClient.invalidateQueries({ queryKey: ["product-request", id] });
								} else {
									await deleteMutation.mutateAsync(id);
									toast.success("Registration deleted");
									navigate(_router.dashboard.productRequest);
									queryClient.invalidateQueries({ queryKey: ["product-requests"] });
									return true;
								}
								return true;
							} catch (e: unknown) {
								const msg = (e as { message?: string })?.message ?? (confirmAction === "approve" ? "Approval failed" : "Delete failed");
								toast.error(msg);
								return false;
							}
						},
						loading: confirmAction === "approve" ? approveMutation.isPending : deleteMutation.isPending,
						variant: confirmAction === "approve" ? "success" : "destructive",
					},
				]}
			/>{" "}
			<EditProductRequest open={editOpen} onOpenChange={setEditOpen} onSave={handleSave} />
		</PageWrapper>
	);
}
