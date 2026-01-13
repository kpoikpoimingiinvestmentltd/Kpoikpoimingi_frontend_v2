import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditIcon, IconWrapper, PlusIcon, SendEmailIcon, TrashIcon } from "@/assets/icons";
import { _router } from "@/routes/_router";
import Badge from "@/components/base/Badge";
import PageTitles from "@/components/common/PageTitles";
import { tableHeaderRowStyle } from "@/components/common/commonStyles";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import type { FilterField } from "@/components/common/SearchWithFilters";
import { Link } from "react-router";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import type { CustomerRow } from "@/types/customer";
import DeleteModal from "@/dashboard/Customers/DeleteModal";
import SendEmailModal from "@/dashboard/Customers/SendEmailModal";
import EmptyData from "../../components/common/EmptyData";
import ActionButton from "../../components/base/ActionButton";
import { useGetAllCustomers, useDeleteCustomer, useExportCustomersAsCSV } from "@/api/customer";
import { TableSkeleton } from "@/components/common/Skeleton";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import ExportConfirmModal from "@/components/common/ExportConfirmModal";

export default function Customers() {
	const [page, setPage] = React.useState(1);
	const [limit, setLimit] = React.useState<number>(10);
	const [search, setSearch] = React.useState<string>("");
	const debouncedSearch = useDebounceSearch(search, 400);
	const [sortBy, setSortBy] = React.useState<string>("createdAt");
	const [sortOrder, setSortOrder] = React.useState<string>("desc");

	const { data: customersData, isLoading, refetch } = useGetAllCustomers(page, limit, debouncedSearch || undefined, sortBy, sortOrder);
	const [deleteOpen, setDeleteOpen] = React.useState(false);
	const [isSendEmailOpen, setIsSendEmailOpen] = React.useState(false);
	const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(null);
	const [exportConfirmOpen, setExportConfirmOpen] = React.useState(false);
	const exportMutation = useExportCustomersAsCSV();

	// Delete customer mutation
	const deleteCustomerMutation = useDeleteCustomer(
		() => {
			toast.success("Customer deleted successfully");
			setSelectedCustomerId(null);
			setDeleteOpen(false); // Close modal after successful deletion
			refetch(); // Refresh the customer list
		},
		(err: unknown) => {
			console.error("Error deleting customer:", err);
			toast.error(extractErrorMessage(err, "Failed to delete customer"));
		}
	);

	const handleExportClick = async () => {
		if (!debouncedSearch) {
			// No active search, export all directly
			try {
				const blob = await exportMutation.mutateAsync({ search: undefined });
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
				toast.success("CSV exported successfully");
			} catch (err) {
				console.error("Failed to export customers:", err);
				toast.error(extractErrorMessage(err, "Failed to export customers"));
			}
		} else {
			// Show confirmation dialog
			setExportConfirmOpen(true);
		}
	};

	const handleExportFiltered = async () => {
		try {
			const blob = await exportMutation.mutateAsync({ search: debouncedSearch });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `customers-${debouncedSearch}-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success(`CSV exported for "${debouncedSearch}"`);
		} catch (err) {
			console.error("Failed to export customers:", err);
			toast.error(extractErrorMessage(err, "Failed to export customers"));
		}
	};

	const handleExportAll = async () => {
		try {
			const blob = await exportMutation.mutateAsync({ search: undefined });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("CSV exported successfully");
		} catch (err) {
			console.error("Failed to export customers:", err);
			toast.error(extractErrorMessage(err, "Failed to export customers"));
		}
	};

	// Transform API data to typed table format with runtime guards
	const customersList = React.useMemo((): CustomerRow[] => {
		if (!customersData || typeof customersData !== "object") return [];
		const cd = customersData as { data?: unknown[]; pagination?: { total?: number } };
		const raw = Array.isArray(cd.data) ? cd.data : [];
		return raw.map((item, idx) => {
			if (item && typeof item === "object") {
				const it = item as Record<string, unknown>;
				return {
					id: String(it.id ?? `cust-${idx}`),
					fullName: String(it.fullName ?? it.name ?? ""),
					email: String(it.email ?? ""),
					phoneNumber: it.phoneNumber ? String(it.phoneNumber) : undefined,
					status: typeof it.status === "string" ? it.status : undefined,
					createdAt: typeof it.createdAt === "string" ? it.createdAt : undefined,
					registrations: it.registrations as CustomerRow["registrations"],
				} as CustomerRow;
			}
			return { id: `cust-${idx}`, fullName: "", email: "" } as CustomerRow;
		});
	}, [customersData]);

	const pages = React.useMemo(() => {
		if (!customersData || typeof customersData !== "object") return 1;
		const cd = customersData as { pagination?: { total?: number } };
		const total = (cd.pagination && typeof cd.pagination.total === "number" ? cd.pagination.total : 0) || 0;
		return Math.max(1, Math.ceil(total / limit));
	}, [customersData, limit]);

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Customers" description="List of people who patronize Kpo kpoi mingi investment" />
				<div className="flex items-center gap-3">
					<ActionButton
						type="button"
						className="bg-primary/10 text-primary gap-2 hover:bg-primary/20"
						onClick={handleExportClick}
						disabled={exportMutation.isPending}>
						<span className="text-sm">{exportMutation.isPending ? "Exporting..." : "Export CSV"}</span>
					</ActionButton>
					<ActionButton type="button" className="bg-primary/10 text-primary gap-2 hover:bg-primary/20" onClick={() => setIsSendEmailOpen(true)}>
						<span className="text-sm">Send Email</span>
						<IconWrapper className="opacity-50">
							<SendEmailIcon />
						</IconWrapper>
					</ActionButton>
					<Link
						to={_router.dashboard.selectCustomerPaymentMethod}
						className="flex items-center gap-2 bg-primary rounded-sm px-4 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<PlusIcon />
						</IconWrapper>
						<span className="text-sm">Add Customer</span>
					</Link>
				</div>
			</div>
			<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
				<div className="flex items-center justify-between flex-wrap gap-6">
					<h2 className="font-semibold">All Customers</h2>
					<div className="flex items-center gap-2">
						<SearchWithFilters
							search={search}
							onSearchChange={(v) => {
								setSearch(v);
								setPage(1);
							}}
							setPage={setPage}
							placeholder="Search by name or email"
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
											{ value: "name", label: "name" },
											{ value: "price", label: "price" },
											{ value: "createdAt", label: "createdAt" },
											{ value: "updatedAt", label: "updatedAt" },
										],
									},
									{ key: "sortOrder", label: "Sort Order", type: "sortOrder" },
								] as FilterField[]
							}
							initialValues={{ limit: String(limit), sortBy: sortBy || "", sortOrder: sortOrder || "" }}
							onApply={(filters) => {
								setLimit(filters.limit ? Number(filters.limit) : 10);
								setSortBy(filters.sortBy || "createdAt");
								setSortOrder(filters.sortOrder || "desc");
								setPage(1);
							}}
							onReset={() => setSearch("")}
						/>
					</div>
				</div>
				<div className="min-h-96 flex">
					{isLoading ? (
						<TableSkeleton rows={10} cols={7} />
					) : customersList.length === 0 ? (
						<div className="flex-grow flex items-center justify-center">
							<EmptyData text="No Customers at the moment" />
						</div>
					) : (
						<div className="flex-grow w-full flex flex-col gap-y-8 rounded-lg mt-8">
							<div className="w-full">
								<div className="overflow-x-auto w-full">
									<Table>
										<TableHeader className={tableHeaderRowStyle}>
											<TableRow className="bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
												<TableHead>Customer ID</TableHead>
												<TableHead>Name</TableHead>
												<TableHead>Email</TableHead>
												<TableHead>Phone</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Current Status</TableHead>
												<TableHead>Action</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{customersList.map((row, idx: number) => (
												<TableRow key={row.id || idx} className="hover:bg-[#F6FBFF]">
													<TableCell className="text-[#13121266]" title={row.id}>
														<span className="max-w-40 block truncate">{row.id}</span>
													</TableCell>
													<TableCell className="text-[#13121266]">{row.fullName}</TableCell>
													<TableCell className="text-[#13121266]">{row.email}</TableCell>
													<TableCell className="text-[#13121266]">{row.phoneNumber ?? "-"}</TableCell>
													<TableCell className="text-[#13121266]">
														<Badge value={row.status || "Active"} size="sm" />
													</TableCell>
													<TableCell className="text-[#13121266]">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}</TableCell>
													<TableCell className="text-[#13121266]">
														<Badge
															value={row.registrations?.some((reg) => reg.isCurrent) ? "Current" : "Not Current"}
															size="sm"
															status={row.registrations?.some((reg) => reg.isCurrent) ? "active" : "inactive"}
														/>
													</TableCell>
													<TableCell className="flex items-center gap-1">
														{row.registrations?.some((reg) => reg.isCurrent) && (
															<Link to={_router.dashboard.customerDetails.replace(":id", row.id)} className="p-2 flex items-center">
																<IconWrapper className="text-xl">
																	<EditIcon />
																</IconWrapper>
															</Link>
														)}
														<button
															type="button"
															className="text-red-500"
															onClick={() => {
																setSelectedCustomerId(row.id);
																setDeleteOpen(true);
															}}>
															<IconWrapper className="text-xl py-1.5">
																<TrashIcon />
															</IconWrapper>
														</button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</div>

							<CompactPagination page={page} pages={pages} showRange onPageChange={setPage} />
						</div>
					)}
				</div>
				<DeleteModal
					open={deleteOpen}
					onOpenChange={setDeleteOpen}
					title="Delete customer"
					description="Are you sure you want to delete this customer? This action cannot be undone."
					onConfirm={async () => {
						if (selectedCustomerId) {
							await deleteCustomerMutation.mutateAsync(selectedCustomerId);
						}
					}}
					isLoading={deleteCustomerMutation.isPending}
				/>
			</CustomCard>

			<SendEmailModal
				open={isSendEmailOpen}
				onOpenChange={setIsSendEmailOpen}
				customers={customersList.map((c) => ({ id: c.id, email: c.email, name: c.fullName }))}
			/>

			<ExportConfirmModal
				open={exportConfirmOpen}
				onOpenChange={setExportConfirmOpen}
				searchTerm={debouncedSearch}
				onExportFiltered={handleExportFiltered}
				onExportAll={handleExportAll}
				isLoading={exportMutation.isPending}
			/>
		</div>
	);
}
