import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconWrapper, PlusIcon, ThreeDotsIcon } from "@/assets/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PageTitles from "@/components/common/PageTitles";
import { tableHeaderRowStyle } from "@/components/common/commonStyles";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserForm from "./UserForm";
import { modalContentStyle } from "@/components/common/commonStyles";
import { formatPhoneNumber } from "@/lib/utils";
import { useGetAllUsers, useResetPassword, useSuspendUser, useUpdateUser, useUploadUserProfile } from "@/api/user";
import { TableSkeleton } from "@/components/common/Skeleton";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteUserRequest } from "@/api/user";
import type { ResetPasswordResponse, SuspendUserResponse, User } from "@/types/user";
import EmptyData from "@/components/common/EmptyData";
import { Link, useNavigate, useSearchParams } from "react-router";
import { _router } from "../../routes/_router";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import type { FilterField } from "@/components/common/SearchWithFilters";
import { media } from "@/resources/images";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import SuccessModal from "../../components/common/SuccessModal";

export default function Users() {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();

	// Initialize state from URL params
	const [page, setPage] = React.useState(() => {
		const pageParam = searchParams.get("page");
		return pageParam ? parseInt(pageParam, 10) : 1;
	});
	const [search, setSearch] = React.useState(() => {
		return searchParams.get("search") || "";
	});
	const [filters, setFilters] = React.useState<Record<string, string>>(() => {
		const urlFilters: Record<string, string> = {};
		const limit = searchParams.get("limit");
		const sortBy = searchParams.get("sortBy");
		const sortOrder = searchParams.get("sortOrder");
		if (limit) urlFilters.limit = limit;
		if (sortBy) urlFilters.sortBy = sortBy;
		if (sortOrder) urlFilters.sortOrder = sortOrder;
		return urlFilters;
	});

	const debouncedSearch = useDebounceSearch(search);
	const [, setIsMounted] = React.useState(false);

	// Sync state with URL params on mount and when URL changes (back/forward navigation)
	React.useEffect(() => {
		const pageParam = searchParams.get("page");
		const newPage = pageParam ? parseInt(pageParam, 10) : 1;
		setPage(newPage);

		const searchParam = searchParams.get("search") || "";
		setSearch(searchParam);

		const urlFilters: Record<string, string> = {};
		const limit = searchParams.get("limit");
		const sortBy = searchParams.get("sortBy");
		const sortOrder = searchParams.get("sortOrder");
		if (limit) urlFilters.limit = limit;
		if (sortBy) urlFilters.sortBy = sortBy;
		if (sortOrder) urlFilters.sortOrder = sortOrder;
		setFilters(urlFilters);
	}, [searchParams]);

	// Initialize URL params on mount if not present
	React.useEffect(() => {
		const hasParams =
			searchParams.has("page") ||
			searchParams.has("limit") ||
			searchParams.has("search") ||
			searchParams.has("sortBy") ||
			searchParams.has("sortOrder");
		if (!hasParams) {
			const params = new URLSearchParams();
			params.set("page", "1");
			params.set("sortBy", "createdAt");
			params.set("sortOrder", "desc");
			setSearchParams(params, { replace: true });
		}
		setIsMounted(true);
	}, []);

	// Update URL when state changes
	React.useEffect(() => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());
		params.set("search", search);
		if (filters.limit) params.set("limit", filters.limit);
		else params.delete("limit");
		if (filters.sortBy) params.set("sortBy", filters.sortBy);
		else params.delete("sortBy");
		if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
		else params.delete("sortOrder");
		setSearchParams(params, { replace: true });
	}, [page, search, filters, setSearchParams]);

	const limit = Number((filters.limit as string) || "10");
	const sortBy = (filters.sortBy as string) || "createdAt";
	const sortOrder = (filters.sortOrder as string) || "desc";

	// delete confirmation state
	const [toDelete, setToDelete] = React.useState<{ id?: string; title?: string } | null>(null);
	const [confirmOpen, setConfirmOpen] = React.useState(false);

	// deactivate confirmation state
	const [toDeactivate, setToDeactivate] = React.useState<{ id?: string; title?: string } | null>(null);
	const [deactivateConfirmOpen, setDeactivateConfirmOpen] = React.useState(false);

	// reset password confirmation state
	const [toResetPassword, setToResetPassword] = React.useState<{ id?: string; title?: string } | null>(null);
	const [resetPasswordConfirmOpen, setResetPasswordConfirmOpen] = React.useState(false);
	const [resetPasswordSuccessOpen, setResetPasswordSuccessOpen] = React.useState(false);
	const [generatedPassword, setGeneratedPassword] = React.useState<string | null>(null);

	// edit modal state
	const [editOpen, setEditOpen] = React.useState(false);
	const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
	const [formValues, setFormValues] = React.useState<any>({});
	const [avatarMediaKey, setAvatarMediaKey] = React.useState<string | null>(null);

	const queryClient = useQueryClient();

	const deleteMutation = useMutation<any, unknown, string>({
		mutationFn: (id: string) => deleteUserRequest(id),
		onError: (_err: unknown, _id: unknown, _context: unknown) => {
			toast.error("Failed to delete user");
		},
		onSuccess: () => {
			toast.success("User deleted");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const resetPasswordMutation = useResetPassword();
	const suspendUserMutation = useSuspendUser();
	const updateMutation = useUpdateUser();
	const uploadProfileMutation = useUploadUserProfile();

	const { data: usersData, isLoading, isFetching } = useGetAllUsers(page, limit, debouncedSearch || undefined, sortBy, sortOrder);

	const handleSearchChange = (value: string) => {
		setSearch(value);
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	const handleFiltersApply = (newFilters: Record<string, string>) => {
		setFilters(newFilters);
		setPage(1);
	};

	const handleFiltersReset = () => {
		setSearch("");
		setFilters({});
		setPage(1);
	};

	const users = React.useMemo((): User[] => {
		if (!usersData || typeof usersData !== "object") return [];
		const ud = usersData as { data?: unknown[] };
		const raw = Array.isArray(ud.data) ? ud.data : [];
		return raw.map((item) => item as User);
	}, [usersData]);

	const paginationData = (usersData as { pagination?: { total?: number; totalPages?: number } })?.pagination;
	const pages = paginationData?.totalPages || 1;

	React.useEffect(() => {
		if (!selectedUser) {
			setFormValues({});
			return;
		}

		const user = selectedUser as Record<string, unknown>;

		const stateOfOriginId = typeof user?.stateOfOrigin === "object" ? (user?.stateOfOrigin as Record<string, unknown>)?.id : user?.stateOfOrigin;
		const roleId = typeof user?.role === "object" ? (user?.role as Record<string, unknown>)?.id : user?.role;
		const accountTypeId =
			typeof user?.accountType === "object" ? (user?.accountType as Record<string, unknown>)?.id : user?.accountTypeId || user?.accountType;
		const bankNameId = typeof user?.bankName === "object" ? (user?.bankName as Record<string, unknown>)?.id : user?.bankName;

		let avatarUrl: string | null = null;
		if (Array.isArray(user?.media) && (user?.media as unknown[])?.length > 0) {
			const mediaItem = (user?.media as unknown[])[0] as Record<string, unknown>;
			avatarUrl = (mediaItem?.fileUrl as string) || (mediaItem?.url as string) || null;
			// If no direct URL, try to get URL from key
			if (!avatarUrl && mediaItem?.key) {
				// For now, we'll skip fetching the URL and use the key as is
				// In a real implementation, you'd fetch the URL here
				avatarUrl = null;
			}
		} else if (typeof user?.media === "string") {
			avatarUrl = user.media;
		}
		if (!avatarUrl) {
			avatarUrl = (user?.avatar as string) || null;
		}

		const dobRaw = (user?.dateOfBirth as string) ?? (user?.dob as string) ?? null;
		const dobFormatted = dobRaw ? new Date(dobRaw).toISOString().split("T")[0] : "";

		setFormValues({
			fullName: (user?.fullName as string) ?? "",
			username: (user?.username as string) ?? "",
			email: (user?.email as string) ?? "",
			phone: (user?.phoneNumber as string) ?? (user?.phone as string) ?? "",
			houseAddress: (user?.houseAddress as string) ?? "",
			stateOfOrigin: String(stateOfOriginId ?? ""),
			dob: dobFormatted,
			role: String(roleId ?? ""),
			salary: (user?.salaryAmount as string) ?? (user?.salary as string) ?? "",
			accountNumber: (user?.accountNumber as string) ?? "",
			accountType: String(accountTypeId ?? ""),
			bankName: String(bankNameId ?? ""),
			avatar: avatarUrl || media.images.avatar,
		});
	}, [selectedUser]);

	const renderField = (val: unknown): string => {
		if (val === null || val === undefined) return "-";
		if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") return String(val);
		if (typeof val === "object") {
			const obj = val as Record<string, unknown>;
			if (obj.name) return String(obj.name);
			if (obj.fullName) return String(obj.fullName);
			if (obj.phone) return String(obj.phone);
			if (obj.role) return typeof obj.role === "string" ? obj.role : String((obj.role as Record<string, unknown>).name ?? JSON.stringify(obj.role));
			return String(obj.id ?? JSON.stringify(val));
		}
		return String(val);
	};

	const isUser = (r: unknown): r is User => {
		if (typeof r !== "object" || r === null) return false;
		const obj = r as Record<string, unknown>;
		return !!(obj.fullName || obj.email || obj.username || obj.id);
	};

	const getName = (r: unknown) => (isUser(r) ? r.fullName ?? r.username ?? r.email ?? r.id : (r as Record<string, unknown>).name ?? "-");
	const getPhone = (r: unknown) => (isUser(r) ? r.phoneNumber ?? "-" : (r as Record<string, unknown>).phone ?? "-");
	const getRole = (r: unknown) =>
		isUser(r) ? (typeof r.role === "string" ? r.role : r.role?.role ?? "-") : (r as Record<string, unknown>).role ?? "-";
	const getAssigned = (r: unknown) =>
		isUser(r) ? r.numberOfAssignedCustomers ?? "-" : (r as Record<string, unknown>).numberOfAssignedCustomers ?? "-";
	const getSalary = (r: unknown) => (r as Record<string, unknown>).salaryAmount ?? "-";

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Employed Users" description="This are the list of all the employees / users working for Kpoi kpoi mingi investment" />
				<div className="flex items-center gap-3">
					<Link
						to={_router.dashboard.addUser}
						className="flex items-center gap-2 bg-primary rounded-sm px-8 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<PlusIcon />
						</IconWrapper>
						<span className="text-sm">Add User</span>
					</Link>
				</div>
			</div>

			<div className="min-h-96 flex">
				{isLoading || isFetching || users.length > 0 ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<div className="flex items-center justify-between flex-wrap gap-6">
							<h2 className="font-semibold">All Users</h2>
							<div className="flex items-center gap-2">
								<SearchWithFilters
									search={search}
									onSearchChange={handleSearchChange}
									setPage={handlePageChange}
									placeholder="Search by user full name or email"
									fields={
										[
											{
												key: "limit",
												label: "Items per page",
												type: "select",
												options: [
													{ value: "5", label: "5" },
													{ value: "10", label: "10" },
													{ value: "20", label: "20" },
													{ value: "50", label: "50" },
												],
											},
											{
												key: "sortBy",
												label: "Sort By",
												type: "sortBy",
												options: [
													{ value: "createdAt", label: "createdAt" },
													{ value: "fullName", label: "fullName" },
													{ value: "email", label: "email" },
												],
											},
											{ key: "sortOrder", label: "Sort Order", type: "sortOrder" },
										] as FilterField[]
									}
									initialValues={{ limit: filters.limit || "10", sortBy: filters.sortBy || "", sortOrder: filters.sortOrder || "" }}
									onApply={handleFiltersApply}
									onReset={handleFiltersReset}
								/>
							</div>
						</div>

						{isLoading || isFetching ? (
							<TableSkeleton rows={6} cols={6} />
						) : users.length === 0 ? (
							<EmptyData text="No Users at the moment" />
						) : (
							<>
								<div className="overflow-x-auto w-full mt-8">
									<Table>
										<TableHeader className={tableHeaderRowStyle}>
											<TableRow className="bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
												<TableHead>Name</TableHead>
												<TableHead>Phone Number</TableHead>
												<TableHead>User Role</TableHead>
												<TableHead>Assigned Customers</TableHead>
												<TableHead>Salary</TableHead>
												<TableHead>Action</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{users.map((row: unknown, idx: number) => (
												<TableRow key={idx} className="hover:bg-[#F6FBFF]">
													<TableCell className="text-[#13121266]">{renderField(getName(row))}</TableCell>
													<TableCell className="text-[#13121266]">{renderField(getPhone(row))}</TableCell>
													<TableCell className="text-[#13121266]">{renderField(getRole(row))}</TableCell>
													<TableCell className="text-[#13121266]">{renderField(getAssigned(row))}</TableCell>
													<TableCell className="text-[#13121266]">{renderField(getSalary(row))}</TableCell>
													<TableCell className="flex items-center gap-1">
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<button type="button" className="p-2 hover:bg-slate-50 rounded-full text-primary">
																	<IconWrapper className="text-lg">
																		<ThreeDotsIcon />
																	</IconWrapper>
																</button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end" sideOffset={6} className="w-48">
																{[
																	{
																		key: "view",
																		label: "View Profile",
																		danger: false,
																		action: () => navigate(_router.dashboard.userDetails((row as Record<string, unknown>).id as string)),
																	},
																	{
																		key: "edit",
																		label: "Edit Profile",
																		danger: false,
																		action: () => {
																			setSelectedUser(row as User);
																			setEditOpen(true);
																		},
																	},
																	{
																		key: "deactivate",
																		label: "Deactivate",
																		danger: false,
																		action: () => {
																			setToDeactivate({ id: (row as Record<string, unknown>).id as string, title: String(getName(row)) });
																			setDeactivateConfirmOpen(true);
																		},
																	},
																	{
																		key: "reset",
																		label: "Reset Password",
																		danger: false,
																		action: () => {
																			setToResetPassword({ id: (row as Record<string, unknown>).id as string, title: String(getName(row)) });
																			setResetPasswordConfirmOpen(true);
																		},
																	},
																	{
																		key: "delete",
																		label: "Delete",
																		danger: true,
																		action: () => {
																			setToDelete({ id: (row as Record<string, unknown>).id as string, title: String(getName(row)) });
																			setConfirmOpen(true);
																		},
																	},
																].map((it) => (
																	<DropdownMenuItem
																		key={it.key}
																		onSelect={() => {
																			if (it.action) it.action();
																		}}
																		className={`cursor-pointer ${it.danger ? "text-red-500" : ""}`}>
																		{it.label}
																	</DropdownMenuItem>
																))}
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>

								<CompactPagination page={page} pages={pages} showRange onPageChange={handlePageChange} />
							</>
						)}
					</CustomCard>
				) : (
					<EmptyData text="No Users at the moment" />
				)}
			</div>

			{/* Delete confirmation modal */}
			<ConfirmModal
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Delete User"
				subtitle={`Are you sure you want to delete "${toDelete?.title}"? This action cannot be undone.`}
				actions={[
					{ label: "Cancel", onClick: () => true, variant: "ghost" },
					{
						label: deleteMutation.isPending ? "Deleting..." : "Delete",
						onClick: async () => {
							if (!toDelete?.id) return false;
							await deleteMutation.mutateAsync(toDelete.id);
							setToDelete(null);
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
						onChange={(k: string, v: unknown) => setFormValues((s: Record<string, unknown>) => ({ ...(s ?? {}), [k]: v }))}
						onAvatarUploaded={(key) => setAvatarMediaKey(key)}
						onSubmit={async () => {
							if (!selectedUser?.id) {
								toast.error("No user selected");
								return;
							}
							try {
								await updateMutation.mutateAsync({
									id: selectedUser.id,
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
											userId: selectedUser.id,
											key: avatarMediaKey,
										});
										setAvatarMediaKey(null);
									} catch (profileErr) {
										console.error("Profile upload failed", profileErr);
										toast.error("Profile picture upload failed");
									}
								}

								toast.success("User updated successfully");
								setEditOpen(false);
								setSelectedUser(null);
								queryClient.invalidateQueries({ queryKey: ["users"] });
							} catch (e) {
								console.error("Update user failed:", e);
								const err = e as {
									status?: number;
									response?: { status?: number; data?: { message?: string } };
									data?: { message?: string };
									message?: string;
								};
								const status = err?.status ?? err?.response?.status;
								const serverMessage = err?.data?.message ?? err?.message ?? err?.response?.data?.message;
								if (status) {
									toast.error(`Failed to update user (status ${status}): ${serverMessage ?? "See console"}`);
								} else {
									toast.error(serverMessage ?? "Failed to update user");
								}
							}
						}}
						submitLabel={updateMutation.isPending || uploadProfileMutation.isPending ? "Saving..." : "Save Changes"}
						isLoading={updateMutation.isPending || uploadProfileMutation.isPending}
					/>
				</DialogContent>
			</Dialog>

			{/* Delete confirmation modal */}
			<ConfirmModal
				open={deactivateConfirmOpen}
				onOpenChange={setDeactivateConfirmOpen}
				title="Deactivate User"
				subtitle={`Are you sure you want to deactivate "${toDeactivate?.title}"?`}
				actions={[
					{ label: "Cancel", onClick: () => true, variant: "ghost" },
					{
						label: suspendUserMutation.isPending ? "Deactivating..." : "Deactivate",
						onClick: async () => {
							if (!toDeactivate?.id) return false;
							suspendUserMutation.mutate(toDeactivate.id, {
								onSuccess: (res: SuspendUserResponse) => {
									toast.success(res.message || "User deactivated successfully");
									queryClient.invalidateQueries({ queryKey: ["users"] });
									setToDeactivate(null);
								},
								onError: (err) => {
									console.error("Deactivate user failed:", err);
									toast.error("Failed to deactivate user");
								},
							});
							return true;
						},
						loading: suspendUserMutation.isPending,
						variant: "destructive",
					},
				]}
			/>

			{/* Reset password confirmation modal */}
			<ConfirmModal
				open={resetPasswordConfirmOpen}
				onOpenChange={setResetPasswordConfirmOpen}
				title="Reset Password"
				subtitle={`Are you sure you want to reset the password for "${toResetPassword?.title}"?`}
				actions={[
					{ label: "Cancel", onClick: () => true, variant: "ghost" },
					{
						label: resetPasswordMutation.isPending ? "Resetting..." : "Reset Password",
						onClick: async () => {
							if (!toResetPassword?.id) return false;
							resetPasswordMutation.mutate(toResetPassword.id, {
								onSuccess: (res: ResetPasswordResponse) => {
									setGeneratedPassword(res?.newPassword ?? null);
									setResetPasswordSuccessOpen(true);
									setToResetPassword(null);
								},
							});
							return true;
						},
						loading: resetPasswordMutation.isPending,
						variant: "primary",
					},
				]}
			/>

			{/* Reset password success modal */}
			<SuccessModal
				open={resetPasswordSuccessOpen}
				onOpenChange={setResetPasswordSuccessOpen}
				title="Password Reset Successful"
				subtitle="The user's password has been reset successfully"
				fields={
					generatedPassword
						? [
								{
									label: "New Password:",
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
						closeOnClick: false,
					},
				]}
			/>
		</div>
	);
}
