import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import PageWrapper from "@/components/common/PageWrapper";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tabListStyle, tabStyle } from "@/components/common/commonStyles";
import ActionButton from "@/components/base/ActionButton";
import { useState } from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useDeleteRegistration, useGetProductRequestById, useApproveRegistration } from "@/api/productRequest";
import { useSendContractDocument } from "@/api/contractDocument";
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

	const { data: registrationData, isLoading: registrationLoading } = useGetProductRequestById(id || "");

	const showApprove = registrationData
		? ((registrationData as Record<string, unknown>).isContractSent as boolean) &&
		  !((registrationData as Record<string, unknown>).approved as boolean)
		: false;
	const showSendContract = registrationData
		? !((registrationData as Record<string, unknown>).isContractSent as boolean) &&
		  !((registrationData as Record<string, unknown>).approved as boolean)
		: false;

	const queryClient = useQueryClient();

	const handlePropertyAdded = () => {
		if (!id) return;
		try {
			queryClient.invalidateQueries({ queryKey: ["product-request", id] });
		} catch {
			queryClient.invalidateQueries({ queryKey: ["product-requests"] });
		}
		queryClient.invalidateQueries({ queryKey: ["product-requests"] });
	};
	const deleteMutation = useDeleteRegistration();
	const approveMutation = useApproveRegistration();
	const sendMutation = useSendContractDocument();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [confirmAction, setConfirmAction] = useState<"delete" | "approve" | null>(null);

	const formatIsoDate = (iso?: string) => {
		if (!iso) return iso;
		try {
			const d = new Date(iso);
			if (Number.isNaN(d.getTime())) return iso;
			return d.toLocaleDateString("en-GB"); // dd/mm/yyyy
		} catch {
			return iso;
		}
	};

	const extractFilename = (fileUrl?: string) => {
		if (!fileUrl) return "";
		try {
			const withoutQuery = fileUrl.split("?")[0];
			const parts = withoutQuery.split("/");
			return decodeURIComponent(parts[parts.length - 1] || "");
		} catch {
			return "";
		}
	};

	const transformMediaFiles = (mediaFiles: Record<string, unknown> | undefined) => {
		if (!mediaFiles) return mediaFiles;
		const out: Record<string, unknown[]> = {};
		for (const key of Object.keys(mediaFiles)) {
			const arr = Array.isArray(mediaFiles[key]) ? (mediaFiles[key] as unknown[]) : [];
			out[key] = arr.map((m: unknown) => ({
				...((m as Record<string, unknown>) || {}),
				filename: extractFilename((m as Record<string, unknown>)?.fileUrl as string),
			}));
		}
		return out;
	};

	const handleSave = async (data: unknown) => {
		try {
			localStorage.removeItem("customer_registration_draft");
			localStorage.removeItem("customer_registration_uploaded_files");
		} catch {}
		setEditOpen(false);
		if (!id) return;
		try {
			try {
				await queryClient.invalidateQueries({ queryKey: ["product-request", id] });
			} catch {
				queryClient.invalidateQueries({ queryKey: ["product-requests"] });
			}
			queryClient.invalidateQueries({ queryKey: ["product-requests"] });
			try {
				const rawMsg = (data as { message?: string })?.message;
				const msg = typeof rawMsg === "string" ? rawMsg.trim() : "";
				if (msg && !["Registration saved successfully", "Registration created successfully"].includes(msg)) {
					toast.success(msg);
				} else if (!msg) {
					toast.success("Changes saved");
				}
			} catch {
				// toast.success("Changes saved");
			}
		} catch (e) {
			toast.error("Failed to update view");
		}
	};

	const displayedData = registrationData
		? (() => {
				const copy: Record<string, unknown> = { ...registrationData };
				if ((copy.customer as Record<string, unknown>) && (copy.customer as Record<string, unknown>).dateOfBirth) {
					copy.customer = {
						...(copy.customer as Record<string, unknown>),
						dateOfBirth: formatIsoDate((copy.customer as Record<string, unknown>).dateOfBirth as string),
					};
				} else if (copy.dateOfBirth) {
					copy.dateOfBirth = formatIsoDate(copy.dateOfBirth as string);
				}
				copy.mediaFiles = transformMediaFiles(copy.mediaFiles as Record<string, unknown> | undefined);
				return copy;
		  })()
		: undefined;

	const anyGuarantorMissingState = (() => {
		const gs =
			((registrationData as Record<string, unknown>)?.guarantors as unknown[]) ??
			(((registrationData as Record<string, unknown>)?.customer as Record<string, unknown>)?.guarantors as unknown[]) ??
			((registrationData as Record<string, unknown>)?.guarantor as unknown[]) ??
			[];
		if (!Array.isArray(gs) || gs.length === 0) return false;
		return gs.some((g: unknown) => !((g as Record<string, unknown>)?.stateOfOrigin as string));
	})();

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
					{showApprove && (
						<ActionButton
							className="px-6 font-normal rounded-sm"
							variant="success"
							onClick={() => {
								setConfirmAction("approve");
								setConfirmOpen(true);
							}}>
							Approve
						</ActionButton>
					)}
					{showSendContract && (
						<ActionButton
							className="px-6 font-normal rounded-sm"
							variant="primary"
							onClick={async () => {
								if (!id) return;
								try {
									const res = await sendMutation.mutateAsync(id);
									const resData = res as Record<string, unknown>;
									toast.success((resData?.message as string) ?? "Contract sent successfully");
									queryClient.invalidateQueries({ queryKey: ["product-requests"] });
									queryClient.invalidateQueries({ queryKey: ["product-request", id] });
								} catch (e: unknown) {
									const msg = (e as { message?: string })?.message ?? "Failed to send contract";
									toast.error(msg);
								}
							}}
							disabled={sendMutation.isPending}>
							{sendMutation.isPending ? "Sending..." : "Send Contract"}
						</ActionButton>
					)}
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
			{anyGuarantorMissingState && (
				<div className="mb-4 flex justify-center">
					<div className="w-full max-w-3xl bg-sky-300 text-white rounded-xl px-6 py-4 text-center">
						<div className="font-semibold">Complete required fields</div>
						<div className="text-sm mt-1">State of origin is required for all guarantors</div>
					</div>
				</div>
			)}
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
							<TabProductInformation
								data={displayedData as Record<string, unknown>}
								loading={registrationLoading}
								onPropertyAdded={handlePropertyAdded}
							/>
						</TabsContent>

						<TabsContent value="customer">
							<TabCustomerDetails data={displayedData as Record<string, unknown>} />
						</TabsContent>

						<TabsContent value="kin">
							<TabNextOfKin data={displayedData as Record<string, unknown>} />
						</TabsContent>

						<TabsContent value="employment">
							<TabEmploymentDetails data={displayedData as Record<string, unknown>} />
						</TabsContent>

						<TabsContent value="guarantor">
							<TabGuarantorDetails data={displayedData as Record<string, unknown>} />
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
									const resultData = result as Record<string, unknown>;
									toast.success((resultData?.message as string) || "Registration approved successfully");
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
			<EditProductRequest
				open={editOpen}
				onOpenChange={(open) => {
					if (!open) {
						try {
							localStorage.removeItem("customer_registration_draft");
							localStorage.removeItem("customer_registration_uploaded_files");
						} catch {}
					}
					setEditOpen(open);
				}}
				onSave={handleSave}
				initial={registrationData as Record<string, unknown>}
			/>
		</PageWrapper>
	);
}
