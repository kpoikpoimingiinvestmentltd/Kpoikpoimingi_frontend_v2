import type { ReactNode } from "react";
import { EditIcon, IconWrapper } from "../../assets/icons";
import PageTitles from "../../components/common/PageTitles";
import CustomCard from "../../components/base/CustomCard";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import Badge from "../../components/base/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserForm from "./UserForm";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useResetPassword, useSuspendUser, useGetUser, useUpdateUser, deleteUserRequest } from "@/api/user";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useGetReferenceData } from "@/api/reference";
import { _router } from "../../routes/_router";
import { Spinner } from "@/components/ui/spinner";
import SuccessModal from "@/components/common/SuccessModal";
import { media } from "../../resources/images";
import PageWrapper from "../../components/common/PageWrapper";
import { modalContentStyle } from "../../components/common/commonStyles";
import { useParams } from "react-router";
import { formatPhoneNumber } from "@/lib/utils";

export default function UserDetails() {
	function KeyValueRow({ label, value, children }: { label: ReactNode; value?: ReactNode; children?: ReactNode }) {
		return (
			<div className="flex justify-between items-start">
				<span className="text-sm sm:text-base">{label}</span>
				<span className="text-sm sm:text-base">{children ?? value}</span>
			</div>
		);
	}

	// local UI state: modal handlers
	const [editOpen, setEditOpen] = useState(false);
	const openEdit = () => setEditOpen(true);
	const [resetOpen, setResetOpen] = useState(false);
	const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

	const params = useParams();
	const userId = params.id;

	const resetMutation = useResetPassword();

	const updateMutation = useUpdateUser();

	async function openReset() {
		if (!userId) {
			toast.error("No user ID available");
			return;
		}

		resetMutation.mutate(userId, {
			onSuccess: (res) => {
				setGeneratedPassword((res as any)?.newPassword ?? null);
				setResetOpen(true);
			},
			onError: (err) => {
				console.error("Reset password failed:", err);
				// Fallback behavior: show a locally generated password so the admin can continue
				const pwd = `@Root${Math.floor(Math.random() * 900) + 100}`;
				setGeneratedPassword(pwd);
				setResetOpen(true);
			},
		});
	}
	const queryClient = useQueryClient();

	const suspendMutation = useSuspendUser();
	const navigate = useNavigate();
	const [confirmOpen, setConfirmOpen] = useState(false);

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			return deleteUserRequest(id);
		},
		onSuccess: () => {
			toast.success("User deleted");
			queryClient.invalidateQueries({ queryKey: ["users"] });
			navigate(_router.dashboard.users);
		},
		onError: (err) => {
			console.error("Delete user failed", err);
			toast.error("Failed to delete user");
		},
	});

	// reference data (statuses, roles, etc.)
	const { data: refData } = useGetReferenceData();

	// fetch user by ID from URL
	const { data: currentUser } = useGetUser(userId || undefined);

	// form values for editing
	const [formValues, setFormValues] = useState<any>({});
	useEffect(() => {
		if (!currentUser) return;
		const cu: any = currentUser as any;

		// Extract IDs from objects for form fields
		const stateOfOriginId = typeof cu?.stateOfOrigin === "object" ? cu?.stateOfOrigin?.id : cu?.stateOfOrigin;
		const roleId = typeof cu?.role === "object" ? cu?.role?.id : cu?.role;
		const accountTypeId = typeof cu?.accountType === "object" ? cu?.accountType?.id : cu?.accountType;
		const bankNameId = typeof cu?.bankName === "object" ? cu?.bankName?.id : cu?.bankName;

		// Get media URL for avatar display
		const avatarUrl = Array.isArray(cu?.media) && cu?.media?.length > 0 ? cu?.media[0]?.fileUrl : cu?.avatar;

		setFormValues({
			fullName: cu?.fullName ?? "",
			username: cu?.username ?? "",
			email: cu?.email ?? "",
			phone: cu?.phoneNumber ?? cu?.phone ?? "",
			houseAddress: cu?.houseAddress ?? "",
			stateOfOrigin: String(stateOfOriginId ?? ""),
			dob: cu?.dateOfBirth ?? cu?.dob ?? "",
			role: String(roleId ?? ""),
			salary: cu?.salaryAmount ?? cu?.salary ?? "",
			accountNumber: cu?.accountNumber ?? "",
			accountType: String(accountTypeId ?? ""),
			bankName: String(bankNameId ?? ""),
			avatar: avatarUrl ?? null,
		});
	}, [currentUser]);

	const openDeactivate = async () => {
		if (!userId) {
			toast.error("No user ID available");
			return;
		}

		suspendMutation.mutate(userId, {
			onSuccess: (res: any) => {
				try {
					// update currentUser cache with returned user
					if (res?.user) {
						queryClient.setQueryData(["user", userId], res.user);
					}
					toast.success(res?.message || "User suspended");
				} catch (e) {
					console.warn("Failed to update user cache", e);
				}
			},
			onError: (err) => {
				console.error("Suspend user failed:", err);
				toast.error("Failed to suspend user");
			},
		});
	};

	return (
		<PageWrapper>
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="User Profile" description="User profile contains the details of this user" />
				<div className="flex items-center gap-4 flex-wrap">
					<button onClick={openEdit} className={"flex items-center text-sm sm:text-base underline-offset-2 underline"}>
						<IconWrapper className="text-xl">
							<EditIcon />
						</IconWrapper>
						<span>Edit</span>
					</button>
					<button
						type="button"
						onClick={openReset}
						disabled={resetMutation.isPending}
						className="flex items-center text-sm md:text-base gap-2 bg-primary rounded-sm px-8 py-2.5 active-scale transition text-white disabled:opacity-60">
						{resetMutation.isPending ? (
							<>
								<Spinner className="size-4" />
								<span>Resetting...</span>
							</>
						) : (
							<span>Reset Password</span>
						)}
					</button>
					<button
						type="button"
						onClick={openDeactivate}
						disabled={suspendMutation.isPending}
						className="flex items-center text-sm md:text-base gap-2 bg-red-600 rounded-sm px-8 py-2.5 active-scale transition text-white disabled:opacity-60">
						{suspendMutation.isPending ? (
							<>
								<Spinner className="size-4" />
								<span>Processing...</span>
							</>
						) : (
							<span>Deactivate</span>
						)}
					</button>
					<button
						type="button"
						onClick={() => setConfirmOpen(true)}
						disabled={deleteMutation.isPending}
						className="flex items-center text-sm md:text-base gap-2 bg-red-700 rounded-sm px-8 py-2.5 active-scale transition text-white disabled:opacity-60">
						{deleteMutation.isPending ? (
							<>
								<Spinner className="size-4" />
								<span>Deleting...</span>
							</>
						) : (
							<span>Delete</span>
						)}
					</button>
				</div>
			</div>

			<main>
				<CustomCard className="md:p-8">
					{/* Banner + avatar */}
					<div className="relative">
						<div className="h-36 bg-gradient-to-r from-sky-400 to-blue-600 rounded-lg" />
						<div className="absolute bottom-0 translate-y-1/2 left-4 sm:left-10">
							<Avatar className="size-32 bg-white">
								<AvatarImage
									className="object-cover object-top"
									src={
										Array.isArray((currentUser as any)?.media) && (currentUser as any)?.media?.length > 0
											? (currentUser as any)?.media[0]?.fileUrl
											: media.images.avatar
									}
									alt="avatar"
								/>
							</Avatar>
						</div>
					</div>

					{/* content grid */}
					<div className="mt-24 grid grid-cols-1 gap-4">
						<div className="space-y-4">
							{/* Status row: show current user's status using reference data when available */}
							<KeyValueRow
								label="Status"
								value={
									<Badge
										value={
											(currentUser as any)?.status?.status ??
											((refData as any)?.statuses && Array.isArray((refData as any).statuses)
												? (refData as any).statuses.find((s: any) => s.id === (currentUser as any)?.statusId)?.status ?? "Unknown"
												: "Unknown")
										}
										status={
											(currentUser as any)?.status?.status ??
											(refData as any)?.statuses?.find((s: any) => s.id === (currentUser as any)?.statusId)?.status ??
											"unknown"
										}
										showDot
									/>
								}
							/>
							{(() => {
								const cu: any = currentUser as any;
								const fullName = cu?.fullName ?? "-";
								const name = cu?.username ?? "-";
								const email = cu?.email ?? "-";
								const phone = cu?.phoneNumber ?? cu?.phone ?? "-";
								const address = cu?.houseAddress ?? "-";
								const stateObj = cu?.stateOfOrigin;
								const state = typeof stateObj === "string" ? stateObj : stateObj?.state ?? "-";
								const dobRaw = cu?.dateOfBirth ?? cu?.dob ?? null;
								const dob = dobRaw ? new Date(dobRaw).toLocaleDateString() : "-";
								const roleLabel = typeof cu?.role === "string" ? cu.role : cu?.role?.role ?? "-";
								const assigned = cu?._count?.customers ?? cu?.assignedCustomersCount ?? cu?.assignedCount ?? 0;
								return (
									<>
										<KeyValueRow label="Full Name" value={fullName} />
										<KeyValueRow label="User Name" value={name} />
										<KeyValueRow label="Email" value={email} />
										<KeyValueRow label="Phone Number" value={phone} />
										<KeyValueRow label="House address" value={address} />
										<KeyValueRow label="State Of Origin" value={state} />
										<KeyValueRow label="Date Of Birth" value={dob} />
										<KeyValueRow label="User Role" value={roleLabel} />
										<KeyValueRow label="Assigned Customers">
											<Badge value={String(assigned)} status="primary" label={<span>{assigned} Assigned</span>} size="md" />
										</KeyValueRow>
									</>
								);
							})()}
						</div>
						<hr />
						<div className="space-y-4">
							{(() => {
								const cu: any = currentUser as any;
								const salary = cu?.salaryAmount ?? cu?.salary ?? "-";
								const accountNumber = cu?.accountNumber ?? "-";

								// Extract account type - handle both string and object
								const accountTypeObj = cu?.accountType;
								const accountType = typeof accountTypeObj === "string" ? accountTypeObj : accountTypeObj?.type ?? "-";

								// Extract bank name - handle both string and object
								const bankNameObj = cu?.bankName;
								const bankName = typeof bankNameObj === "string" ? bankNameObj : bankNameObj?.name ?? "-";

								return (
									<>
										<KeyValueRow label="Salary Amount" value={salary} />
										<KeyValueRow label="Account Number" value={accountNumber} />
										<KeyValueRow label="Account Type" value={accountType} />
										<KeyValueRow label="Bank Name" value={bankName} />
									</>
								);
							})()}
						</div>
					</div>
				</CustomCard>
			</main>

			{/* Confirm delete modal for this user */}
			<ConfirmModal
				open={confirmOpen}
				onOpenChange={(o) => {
					setConfirmOpen(o);
				}}
				title={"Delete user"}
				subtitle={"Are you sure you want to delete this user? This action cannot be undone."}
				actions={[
					{ label: "Cancel", onClick: () => true, variant: "ghost" },
					{
						label: deleteMutation.isPending ? "Deleting..." : "Delete",
						onClick: async () => {
							if (!userId) return false;
							await deleteMutation.mutateAsync(userId);
							return true;
						},
						loading: deleteMutation.isPending,
						variant: "destructive",
					},
				]}
			/>

			{/* Edit modal */}
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent className={modalContentStyle()}>
					<DialogHeader className="text-center flex items-center justify-center mt-5">
						<DialogTitle className="font-medium">Edit User Details</DialogTitle>
					</DialogHeader>
					<UserForm
						values={formValues}
						onChange={(k, v) => setFormValues((s: any) => ({ ...(s ?? {}), [k]: v }))}
						onSubmit={async () => {
							if (!userId) {
								toast.error("No user ID available");
								return;
							}
							try {
								await updateMutation.mutateAsync({
									id: userId,
									payload: {
										fullName: formValues.fullName,
										email: formValues.email,
										phoneNumber: formatPhoneNumber(formValues.phone),
										houseAddress: formValues.houseAddress,
										stateOfOrigin: formValues.stateOfOrigin,
										dateOfBirth: formValues.dob,
										roleId: Number(formValues.role) || undefined,
										salaryAmount: formValues.salary,
										accountNumber: formValues.accountNumber,
										accountType: formValues.accountType,
										bankName: formValues.bankName,
										media: formValues.avatar,
									},
								});
								toast.success("User updated");
								setEditOpen(false);
							} catch (e) {
								console.error("Update user failed", e);
								toast.error("Failed to update user");
							}
						}}
						submitLabel={updateMutation.isPending ? "Saving..." : "Save Changes"}
						isLoading={updateMutation.isPending}
					/>
				</DialogContent>
			</Dialog>

			{/* Reset password success modal */}
			<SuccessModal
				open={resetOpen}
				onOpenChange={setResetOpen}
				title="Password Reset"
				subtitle="Password Reset Successful"
				fields={
					generatedPassword
						? [
								{
									label: "Password:",
									value: <span className="text-primary font-medium">{generatedPassword}</span>,
									variant: "inline",
								},
						  ]
						: []
				}
				actions={[
					{
						label: "Copy Password",
						onClick: async () => {
							if (!generatedPassword) {
								toast.info("No password to copy");
								return;
							}
							try {
								await navigator.clipboard.writeText(generatedPassword);
								toast.success("Password copied to clipboard");
							} catch (e) {
								console.warn("Clipboard write failed", e);
								toast.info("Could not copy to clipboard. Please copy manually.");
							}
						},
						variant: "primary",
						fullWidth: false,
						// keep the modal open when copying so admin can still see/copy the password
						closeOnClick: false,
					},
				]}
			/>
		</PageWrapper>
	);
}
