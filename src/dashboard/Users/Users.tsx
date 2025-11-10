import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconWrapper, PlusIcon, ThreeDotsIcon, SearchIcon, FilterIcon } from "@/assets/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import PageTitles from "@/components/common/PageTitles";
import { inputStyle, preTableButtonStyle, tableHeaderRowStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import { useGetAllUsers } from "@/api/user";
import { TableSkeleton } from "@/components/common/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setUsers } from "@/store/usersSlice";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteUserRequest } from "@/api/user";
import type { User } from "@/types/user";
import EmptyData from "@/components/common/EmptyData";
import { Link, useNavigate } from "react-router";
import { _router } from "../../routes/_router";

export default function Users() {
	const [isEmpty] = React.useState(false);
	const [page, setPage] = React.useState(1);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const storedUsers = useSelector((s: RootState) => s.users.list ?? []);
	const [total, setTotal] = React.useState(0);
	const pages = Math.max(1, Math.ceil(total / 10));
	const [query, setQuery] = React.useState("");
	const [roleFilter, setRoleFilter] = React.useState<string | null>(null);

	// delete confirmation state
	const [toDelete, setToDelete] = React.useState<{ id?: string; title?: string } | null>(null);
	const [confirmOpen, setConfirmOpen] = React.useState(false);

	const queryClient = useQueryClient();

	const deleteMutation = useMutation<any, unknown, string>({
		mutationFn: (id: string) => deleteUserRequest(id),
		onMutate: async (id: string) => {
			await queryClient.cancelQueries({ queryKey: ["users"] });
			const prev = storedUsers;
			setTimeout(() => {
				// optimistic UI: remove user from local store immediately
				const next = (storedUsers || []).filter((u: any) => u.id !== id);
				dispatch(setUsers(next));
			}, 0);
			return { prev };
		},
		onError: (_err: any, _id: any, context: any) => {
			if (context?.prev) {
				dispatch(setUsers(context.prev));
			}
			toast.error("Failed to delete user");
		},
		onSuccess: () => {
			toast.success("User deleted");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
	});

	const { data: rawData, isLoading } = useGetAllUsers(true as any);
	const data: any = rawData;

	React.useEffect(() => {
		if (data?.data && Array.isArray(data.data)) {
			dispatch(setUsers(data.data));
			setTotal(data.pagination?.total || data.data.length);
		}
	}, [data, dispatch]);

	const renderField = (val: any) => {
		if (val === null || val === undefined) return "-";
		if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") return val;
		if (typeof val === "object") {
			if (val.name) return val.name;
			if (val.fullName) return val.fullName;
			if (val.phone) return val.phone;
			if (val.role) return typeof val.role === "string" ? val.role : val.role.name ?? JSON.stringify(val.role);
			return val.id ?? JSON.stringify(val);
		}
		return String(val);
	};

	const isUser = (r: any): r is User => {
		return !!(r && (r.fullName || r.email || r.username || r.id));
	};

	const getName = (r: any) => (isUser(r) ? r.fullName ?? r.username ?? r.email ?? r.id : r.name ?? "-");
	const getPhone = (r: any) => (isUser(r) ? r.phoneNumber ?? "-" : r.phone ?? "-");
	const getRole = (r: any) => (isUser(r) ? (typeof r.role === "string" ? r.role : r.role?.role ?? "-") : r.role ?? "-");
	const getAssigned = (r: any) => (isUser(r) ? "-" : r.assigned ?? "-");
	const getSalary = (r: any) => r.salaryAmount ?? "-";

	const normalizedQuery = query.trim().toLowerCase();
	const visibleUsers = (storedUsers || []).filter((u: any) => {
		let matchesQuery = true;
		if (normalizedQuery) {
			const name = String(getName(u)).toLowerCase();
			const phone = String(getPhone(u)).toLowerCase();
			matchesQuery = name.includes(normalizedQuery) || phone.includes(normalizedQuery);
		}

		let matchesRole = true;
		if (roleFilter) {
			const role = (typeof u.role === "string" ? u.role : u.role?.role ?? "") as string;
			matchesRole = role === roleFilter;
		}

		return matchesQuery && matchesRole;
	});

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
				{!isEmpty ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						{isLoading ? (
							<TableSkeleton rows={6} cols={6} />
						) : storedUsers.length === 0 ? (
							<EmptyData text="No Users at the moment" />
						) : (
							<>
								<div className="w-full">
									<div className="flex items-center justify-between flex-wrap gap-6">
										<h2 className="font-semibold">All Users</h2>
										<div className="flex items-center gap-2">
											<div className="relative md:w-80">
												{/* Confirm delete modal for user */}
												<ConfirmModal
													open={confirmOpen}
													onOpenChange={(o: boolean) => {
														setConfirmOpen(o);
														if (!o) setToDelete(null);
													}}
													title={toDelete ? `Delete ${toDelete.title}?` : "Delete user"}
													subtitle={toDelete ? `Are you sure you want to delete ${toDelete.title}? This action cannot be undone.` : undefined}
													actions={[
														{
															label: "Cancel",
															onClick: () => true,
															variant: "ghost",
														},
														{
															label: deleteMutation.isPending ? "Deleting..." : "Delete",
															onClick: async () => {
																if (!toDelete?.id) return false;
																await deleteMutation.mutateAsync(toDelete.id as string);
																return true;
															},
															loading: deleteMutation.isPending,
															variant: "destructive",
														},
													]}
												/>
												<CustomInput
													type="search"
													placeholder="Search by name or phone"
													aria-label="Search by name or phone"
													className={`max-w-[320px] ${inputStyle} h-10 pl-9`}
													iconLeft={<SearchIcon />}
													onSearch={(v: string) => setQuery(v)}
													showClear
												/>
											</div>
											<div className="flex items-center gap-2">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<button type="button" className={`${preTableButtonStyle} text-white bg-primary ml-auto`}>
															<IconWrapper className="text-base">
																<FilterIcon />
															</IconWrapper>
															<span className="hidden sm:inline">Filter</span>
														</button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="start" sideOffset={6} className="w-64">
														<div className="px-3 py-2">
															<div className="text-sm text-muted-foreground mb-2">Filter by role</div>
															<Select value={roleFilter ?? "__all"} onValueChange={(v) => setRoleFilter(v === "__all" ? null : (v as string))}>
																<SelectTrigger size="sm" className="h-9 w-full">
																	<SelectValue placeholder="All roles" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="__all">All</SelectItem>
																	{Array.from(
																		new Set(
																			(storedUsers || [])
																				.map((u: any) => (typeof u.role === "string" ? u.role : u.role?.role || u.role?.role || ""))
																				.filter(Boolean)
																		)
																	).map((r: string) => (
																		<SelectItem key={r} value={r}>
																			{r}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
														</div>
													</DropdownMenuContent>
												</DropdownMenu>

												{/* Clear filter button shown when a role filter is active */}
												{roleFilter ? (
													<button
														type="button"
														onClick={() => setRoleFilter(null)}
														className="ml-2 text-sm text-muted-foreground hover:text-primary"
														aria-label="Clear role filter">
														Clear
													</button>
												) : null}
											</div>
										</div>
									</div>

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
												{visibleUsers.map((row: any, idx: number) => (
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
																			action: () => navigate(_router.dashboard.userDetails(row.id)),
																		},
																		{ key: "edit", label: "Edit Profile", danger: false },
																		{ key: "deactivate", label: "Deactivate", danger: false },
																		{ key: "reset", label: "Reset Password", danger: false },
																		{
																			key: "delete",
																			label: "Delete",
																			danger: true,
																			action: () => {
																				setToDelete({ id: row.id, title: String(getName(row)) });
																				setConfirmOpen(true);
																			},
																		},
																	].map((it) => (
																		<DropdownMenuItem
																			key={it.key}
																			onSelect={() => {
																				if (it.action) it.action();
																				// TODO: wire actions (navigate / open modal)
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
								</div>
							</>
						)}

						<div className="mt-8 flex flex-col md:flex-row text-center md:text-start justify-center items-center">
							<span className="text-sm text-nowrap">Total of ({total})</span>
							<div className="ml-auto">
								<CompactPagination page={page} pages={pages} onPageChange={setPage} />
							</div>
						</div>
					</CustomCard>
				) : (
					<EmptyData text="No Users at the moment" />
				)}
			</div>
		</div>
	);
}
