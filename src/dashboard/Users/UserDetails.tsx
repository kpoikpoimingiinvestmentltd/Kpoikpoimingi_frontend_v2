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
import { useResetPassword, useSuspendUser, useGetUser, useUpdateUser, deleteUserRequest, useUploadUserProfile } from "@/api/user";
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
import type { ResetPasswordResponse, SuspendUserResponse } from "@/types/user";

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
	const [avatarMediaKey, setAvatarMediaKey] = useState<string | null>(null);

	const params = useParams();
	const userId = params.id;

	const resetMutation = useResetPassword();

	const updateMutation = useUpdateUser();
	const uploadProfileMutation = useUploadUserProfile();

	async function openReset() {
		if (!userId) {
			toast.error("No user ID available");
			return;
		}

		resetMutation.mutate(userId, {
			onSuccess: (res: ResetPasswordResponse) => {
				setGeneratedPassword(res?.newPassword ?? null);
				setResetOpen(true);
			},
		});
	}
	const queryClient = useQueryClient();

	const suspendMutation = useSuspendUser();
	const navigate = useNavigate();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [userStatus, setUserStatus] = useState<string | null>(null);

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

		// Extract IDs from objects for form fields
		const stateOfOriginId = typeof currentUser?.stateOfOrigin === "object" ? currentUser?.stateOfOrigin?.id : currentUser?.stateOfOrigin;
		const roleId = typeof currentUser?.role === "object" ? currentUser?.role?.id : currentUser?.role;
		const accountTypeId = typeof currentUser?.accountType === "object" ? currentUser?.accountType?.id : currentUser?.accountType;
		const bankNameId = typeof currentUser?.bankName === "object" ? currentUser?.bankName?.id : currentUser?.bankName;

		// Get media URL for avatar display
		const avatarUrl = Array.isArray(currentUser?.media) && currentUser?.media?.length > 0 ? currentUser?.media[0]?.fileUrl : currentUser?.avatar;

		// Format date for HTML date input (YYYY-MM-DD)
		const dobRaw = currentUser?.dateOfBirth ?? currentUser?.dob ?? null;
		const dobFormatted = dobRaw ? new Date(dobRaw).toISOString().split("T")[0] : "";

		// Update user status
		const status = currentUser?.status?.status || currentUser?.statusId;
		setUserStatus(status);

		setFormValues({
			fullName: currentUser?.fullName ?? "",
			username: currentUser?.username ?? "",
			email: currentUser?.email ?? "",
			phone: currentUser?.phoneNumber ?? currentUser?.phone ?? "",
			houseAddress: currentUser?.houseAddress ?? "",
			stateOfOrigin: String(stateOfOriginId ?? ""),
			dob: dobFormatted,
			role: String(roleId ?? ""),
			salary: currentUser?.salaryAmount ?? currentUser?.salary ?? "",
			accountNumber: currentUser?.accountNumber ?? "",
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
			onSuccess: (res: SuspendUserResponse) => {
				try {
					// Update local status state immediately for UI responsiveness
					const statusObj = res.user?.status as unknown as Record<string, unknown> | undefined;
					const newStatus = (statusObj?.status as string) || null;
					setUserStatus(newStatus);
					queryClient.setQueryData(["user", userId], res.user);
					toast.success(res.message || "User status updated");
					// Refetch user data to update the UI
					queryClient.invalidateQueries({ queryKey: ["user", userId] });
				} catch (e) {
					console.warn("Failed to update user cache", e);
				}
			},
			onError: (err) => {
				console.error("Suspend user failed:", err);
				toast.error("Failed to update user status");
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
					{(() => {
						const isInactive = userStatus !== "ACTIVE";
						const buttonBg = isInactive ? "bg-green-600" : "bg-red-600";
						const buttonText = isInactive ? "Activate" : "Deactivate";
						return (
							<button
								type="button"
								onClick={openDeactivate}
								disabled={suspendMutation.isPending}
								className={`flex items-center text-sm md:text-base gap-2 ${buttonBg} rounded-sm px-8 py-2.5 active-scale transition text-white disabled:opacity-60`}>
								{suspendMutation.isPending ? (
									<>
										<Spinner className="size-4" />
										<span>Processing...</span>
									</>
								) : (
									<span>{buttonText}</span>
								)}
							</button>
						);
					})()}
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
									src={Array.isArray(currentUser?.media) && currentUser?.media?.length > 0 ? currentUser?.media[0]?.fileUrl : media.images.avatar}
									alt="avatar"
								/>
							</Avatar>
						</div>
					</div>

					{/* content grid */}
					<div className="mt-24 grid grid-cols-1 gap-4">
						<div className="space-y-4">
							<KeyValueRow
								label="Status"
								value={
									<Badge
										value={
											currentUser?.status?.status ??
											(refData?.statuses && Array.isArray(refData.statuses)
												? ((
														refData.statuses.find((s: unknown) => (s as Record<string, unknown>)?.id === currentUser?.statusId) as
															| Record<string, unknown>
															| undefined
												  )?.status as string) ?? "Unknown"
												: "Unknown")
										}
										status={
											(currentUser?.status?.status as string) ??
											(refData?.statuses && Array.isArray(refData.statuses)
												? ((
														refData.statuses.find((s: unknown) => (s as Record<string, unknown>)?.id === currentUser?.statusId) as
															| Record<string, unknown>
															| undefined
												  )?.status as string)
												: null) ??
											"unknown"
										}
										showDot
									/>
								}
							/>
							{(() => {
								const fullName = currentUser?.fullName ?? "-";
								const name = currentUser?.username ?? "-";
								const email = currentUser?.email ?? "-";
								const phone = currentUser?.phoneNumber ?? currentUser?.phone ?? "-";
								const address = currentUser?.houseAddress ?? "-";
								const stateObj = currentUser?.stateOfOrigin;
								const state = typeof stateObj === "string" ? stateObj : stateObj?.state ?? "-";
								const dobRaw = currentUser?.dateOfBirth ?? currentUser?.dob ?? null;
								const dob = dobRaw ? new Date(dobRaw).toLocaleDateString() : "-";
								const roleLabel =
									typeof currentUser?.role === "string"
										? currentUser.role
										: (currentUser?.role as unknown as Record<string, unknown> | undefined)?.role ?? "-";
								const assigned =
									(currentUser?._count as unknown as Record<string, unknown> | undefined)?.customers ??
									currentUser?.assignedCustomersCount ??
									currentUser?.assignedCount ??
									0;
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
								const salary = currentUser?.salaryAmount ?? currentUser?.salary ?? "-";
								const accountNumber = currentUser?.accountNumber ?? "-";

								// Extract account type - handle both string and object
								const accountTypeObj = currentUser?.accountType;
								const accountType = typeof accountTypeObj === "string" ? accountTypeObj : accountTypeObj?.type ?? "-";

								// Extract bank name - handle both string and object
								const bankNameObj = currentUser?.bankName;
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
						onChange={(k: string, v: unknown) => setFormValues((s: any) => ({ ...(s ?? {}), [k]: v }))}
						onAvatarUploaded={(key) => setAvatarMediaKey(key)}
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
										dateOfBirth: formValues.dob || undefined,
										roleId: Number(formValues.role) || undefined,
										salaryAmount: formValues.salary ? Number(formValues.salary) : undefined,
										accountNumber: formValues.accountNumber,
										accountType: formValues.accountType,
										bankName: formValues.bankName,
									},
								});

								// If avatar was uploaded, call the profile upload endpoint
								if (avatarMediaKey) {
									try {
										await uploadProfileMutation.mutateAsync({
											userId,
											key: avatarMediaKey,
										});
										setAvatarMediaKey(null);
									} catch (profileErr) {
										console.error("Profile upload failed", profileErr);
										toast.error("Profile picture upload failed");
									}
								}

								toast.success("User updated");
								setEditOpen(false);
							} catch (e) {
								let errorMsg = "Failed to update user";
								if (e instanceof Error) {
									errorMsg = e.message;
								} else if (typeof e === "object" && e !== null) {
									const err = e as Record<string, unknown>;
									if (Array.isArray(err?.message)) {
										errorMsg = (err.message as string[]).join(", ");
									} else if (typeof err?.message === "string") {
										errorMsg = err.message;
									} else if (typeof err?.error === "string") {
										errorMsg = err.error;
									}
								}

								toast.error(errorMsg);
							}
						}}
						submitLabel={updateMutation.isPending || uploadProfileMutation.isPending ? "Saving..." : "Save Changes"}
						isLoading={updateMutation.isPending || uploadProfileMutation.isPending}
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
