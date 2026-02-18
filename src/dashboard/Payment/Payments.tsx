import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/base/Badge";
import PageTitles from "@/components/common/PageTitles";
import { tableHeaderRowStyle } from "@/components/common/commonStyles";
import CompactPagination from "@/components/ui/compact-pagination";
import EmptyData from "@/components/common/EmptyData";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import type { FilterField } from "@/components/common/SearchWithFilters";
import { useGetAllDuePayments, useExportDuePayments } from "@/api/duePayment";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { TableSkeleton } from "@/components/common/Skeleton";
import { ExportFileIcon, IconWrapper } from "@/assets/icons";
import { useState } from "react";
import ActionButton from "@/components/base/ActionButton";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import ExportConfirmModal from "@/components/common/ExportConfirmModal";
import { useSearchParams } from "react-router";
import React from "react";
import { useCanExport } from "@/hooks/usePermissions";

export default function Payments() {
	const [searchParams, setSearchParams] = useSearchParams();

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
		const sortBy = searchParams.get("sortBy");
		const sortOrder = searchParams.get("sortOrder");
		const dueDateFrom = searchParams.get("dueDateFrom");
		const dueDateTo = searchParams.get("dueDateTo");
		const dateFrom = searchParams.get("dateFrom");
		const dateTo = searchParams.get("dateTo");
		const isOverdue = searchParams.get("isOverdue");
		const statusId = searchParams.get("statusId");
		if (sortBy) urlFilters.sortBy = sortBy;
		if (sortOrder) urlFilters.sortOrder = sortOrder;
		if (dueDateFrom) urlFilters.dueDateFrom = dueDateFrom;
		if (dueDateTo) urlFilters.dueDateTo = dueDateTo;
		if (dateFrom) urlFilters.dateFrom = dateFrom;
		if (dateTo) urlFilters.dateTo = dateTo;
		if (isOverdue) urlFilters.isOverdue = isOverdue;
		if (statusId) urlFilters.statusId = statusId;
		return urlFilters;
	});

	const [exportOpen, setExportOpen] = useState(false);

	const debouncedSearch = useDebounceSearch(search);
	const [, setIsMounted] = React.useState(false);
	const canExport = useCanExport();

	// Sync state when URL params change (e.g., browser back/forward, refresh)
	React.useEffect(() => {
		const pageParam = searchParams.get("page");
		const newPage = pageParam ? parseInt(pageParam, 10) : 1;
		setPage(newPage);
		setSearch(searchParams.get("search") || "");
		const urlFilters: Record<string, string> = {};
		const sortBy = searchParams.get("sortBy");
		const sortOrder = searchParams.get("sortOrder");
		const dueDateFrom = searchParams.get("dueDateFrom");
		const dueDateTo = searchParams.get("dueDateTo");
		const dateFrom = searchParams.get("dateFrom");
		const dateTo = searchParams.get("dateTo");
		const isOverdue = searchParams.get("isOverdue");
		const statusId = searchParams.get("statusId");
		if (sortBy) urlFilters.sortBy = sortBy;
		if (sortOrder) urlFilters.sortOrder = sortOrder;
		if (dueDateFrom) urlFilters.dueDateFrom = dueDateFrom;
		if (dueDateTo) urlFilters.dueDateTo = dueDateTo;
		if (dateFrom) urlFilters.dateFrom = dateFrom;
		if (dateTo) urlFilters.dateTo = dateTo;
		if (isOverdue) urlFilters.isOverdue = isOverdue;
		if (statusId) urlFilters.statusId = statusId;
		setFilters(urlFilters);
	}, [searchParams]);

	// Initialize URL params on mount if not present
	React.useEffect(() => {
		const hasParams =
			searchParams.has("page") ||
			searchParams.has("search") ||
			searchParams.has("sortBy") ||
			searchParams.has("sortOrder") ||
			searchParams.has("dueDateFrom") ||
			searchParams.has("dueDateTo") ||
			searchParams.has("dateFrom") ||
			searchParams.has("dateTo") ||
			searchParams.has("isOverdue") ||
			searchParams.has("statusId");
		if (!hasParams) {
			const params = new URLSearchParams();
			params.set("page", "1");
			params.set("sortBy", "dueDate");
			params.set("sortOrder", "asc");
			setSearchParams(params, { replace: true });
		}
		setIsMounted(true);
	}, []);

	// Update URL when state changes
	React.useEffect(() => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());
		params.set("search", search);
		if (filters.sortBy) params.set("sortBy", filters.sortBy);
		else params.delete("sortBy");
		if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
		else params.delete("sortOrder");
		if (filters.dueDateFrom) params.set("dueDateFrom", filters.dueDateFrom);
		else params.delete("dueDateFrom");
		if (filters.dueDateTo) params.set("dueDateTo", filters.dueDateTo);
		else params.delete("dueDateTo");
		if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
		else params.delete("dateFrom");
		if (filters.dateTo) params.set("dateTo", filters.dateTo);
		else params.delete("dateTo");
		if (filters.isOverdue) params.set("isOverdue", filters.isOverdue);
		else params.delete("isOverdue");
		if (filters.statusId) params.set("statusId", filters.statusId);
		else params.delete("statusId");
		setSearchParams(params, { replace: true });
	}, [page, search, filters, setSearchParams]);

	const sortBy = filters.sortBy || "dueDate";
	const sortOrder = filters.sortOrder || "asc";
	const dueDateFrom = filters.dueDateFrom || undefined;
	const dueDateTo = filters.dueDateTo || undefined;
	const dateFrom = filters.dateFrom || undefined;
	const dateTo = filters.dateTo || undefined;
	const isOverdue = filters.isOverdue ? filters.isOverdue === "true" : undefined;
	const statusId = filters.statusId ? Number(filters.statusId) : undefined;

	const {
		data: paymentsData = {},
		isLoading,
		isFetching,
	} = useGetAllDuePayments(
		page,
		10,
		sortBy,
		sortOrder,
		dueDateFrom || undefined,
		dueDateTo || undefined,
		dateFrom || undefined,
		dateTo || undefined,
		debouncedSearch || undefined,
		debouncedSearch || undefined,
		debouncedSearch || undefined,
		isOverdue,
		statusId,
	);

	const paymentsTyped = paymentsData as Record<string, unknown> | undefined;
	const paymentsList = Array.isArray(paymentsTyped?.data) ? (paymentsTyped?.data as unknown[]) : [];
	const paginationData = paymentsTyped?.pagination as Record<string, unknown> | undefined;
	const pages = Math.max(1, (paginationData?.totalPages as number) ?? 1);
	const isEmpty = !isLoading && !isFetching && paymentsList.length === 0;
	const exportMutation = useExportDuePayments();

	const filterFields: FilterField[] = [
		{
			key: "dueDateFrom",
			label: "Due Date From",
			type: "date",
		},
		{
			key: "dueDateTo",
			label: "Due Date To",
			type: "date",
		},
		{
			key: "dateFrom",
			label: "Reminder Date From",
			type: "date",
		},
		{
			key: "dateTo",
			label: "Reminder Date To",
			type: "date",
		},
		{
			key: "isOverdue",
			label: "Overdue Status",
			type: "boolean",
		},
		{
			key: "statusId",
			label: "Payment Status",
			type: "select",
			options: [
				{ value: "1", label: "Pending" },
				{ value: "2", label: "Paid" },
				{ value: "3", label: "Failed" },
			],
		},
		{
			key: "sortBy",
			label: "Sort By",
			type: "sortBy",
			options: [
				{ value: "sentAt", label: "Sent Date" },
				{ value: "dueDate", label: "Due Date" },
				{ value: "customerName", label: "Customer Name" },
				{ value: "contractCode", label: "Contract Code" },
				{ value: "totalDue", label: "Total Due" },
			],
		},
		{ key: "sortOrder", label: "Sort Order", type: "sortOrder" },
	];

	const handleFilterApply = (newFilters: Record<string, string>) => {
		setFilters(newFilters);
		setPage(1);
	};

	const handleFilterReset = () => {
		setFilters({});
		setPage(1);
	};

	// Smart Export Handlers
	const handleExportClick = async () => {
		const hasActiveFilters = !!(dueDateFrom || dueDateTo || dateFrom || dateTo || isOverdue !== undefined || statusId !== undefined || search);
		if (hasActiveFilters) {
			setExportOpen(true);
		} else {
			handleExportAll();
		}
	};

	const getFilterLabels = () => {
		const labels: Record<string, string> = {};
		if (dueDateFrom) labels["Due From"] = dueDateFrom;
		if (dueDateTo) labels["Due To"] = dueDateTo;
		if (dateFrom) labels["Reminder From"] = dateFrom;
		if (dateTo) labels["Reminder To"] = dateTo;
		if (isOverdue !== undefined) labels["Overdue"] = isOverdue ? "Yes" : "No";
		if (statusId !== undefined) labels["Status"] = statusId === 1 ? "Pending" : statusId === 2 ? "Paid" : "Failed";
		if (search) labels["Search"] = search;
		return labels;
	};

	const handleExportFiltered = async () => {
		try {
			const blob = await exportMutation.mutateAsync({
				dueDateFrom: dueDateFrom || undefined,
				dueDateTo: dueDateTo || undefined,
				dateFrom: dateFrom || undefined,
				dateTo: dateTo || undefined,
				contractCode: search || undefined,
				customerName: search || undefined,
				customerEmail: search || undefined,
				isOverdue: isOverdue !== undefined ? isOverdue : undefined,
				statusId: statusId !== undefined ? statusId : undefined,
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `due-payments-filtered-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("Due payments exported successfully");
			setExportOpen(false);
		} catch (err) {
			toast.error(extractErrorMessage(err, "Failed to export due payments"));
		}
	};

	const handleExportAll = async () => {
		try {
			const blob = await exportMutation.mutateAsync({});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `due-payments-all-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("All due payments exported successfully");
			setExportOpen(false);
		} catch (err) {
			toast.error(extractErrorMessage(err, "Failed to export due payments"));
		}
	};

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Due Payments" description="The list of all paid debt and pending payment" />
				<div className="flex items-center gap-3">
					{canExport && (
						<ActionButton
							type="button"
							className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-2"
							onClick={handleExportClick}
							disabled={exportMutation.isPending}>
							<IconWrapper className="text-base">
								<ExportFileIcon />
							</IconWrapper>
							<span className="text-sm">{exportMutation.isPending ? "Exporting..." : "Export"}</span>
						</ActionButton>
					)}
				</div>
			</div>

			<CustomCard>
				<div className="flex items-center justify-end">
					{paymentsList.length > 0 && (
						<SearchWithFilters
							search={search}
							onSearchChange={(v) => {
								setSearch(v);
								setPage(1);
							}}
							setPage={setPage}
							placeholder="Search by contract code, customer name, or email"
							showFilter={true}
							fields={filterFields}
							initialValues={{
								dueDateFrom: filters.dueDateFrom || "",
								dueDateTo: filters.dueDateTo || "",
								dateFrom: filters.dateFrom || "",
								dateTo: filters.dateTo || "",
								isOverdue: filters.isOverdue || "",
								statusId: filters.statusId || "",
								sortBy: filters.sortBy || "",
								sortOrder: filters.sortOrder || "",
							}}
							onApply={handleFilterApply}
							onReset={handleFilterReset}
						/>
					)}
				</div>
				<div className="min-h-96 flex flex-col">
					{isLoading || isFetching ? (
						<TableSkeleton rows={10} cols={9} />
					) : isEmpty ? (
						<EmptyData text="No due payments at the moment" />
					) : (
						<CustomCard className="p-0 mt-5 border-0 h-full flex-grow w-full flex flex-col  gap-y-8">
							<div className="w-full">
								<div className="overflow-x-auto w-full">
									<Table>
										<TableHeader className={tableHeaderRowStyle}>
											<TableRow className="bg-[#EAF6FF] dark:bg-neutral-900/80 h-12 overflow-hidden py-4 rounded-lg">
												<TableHead>Contract Code</TableHead>
												<TableHead>Customer Name</TableHead>
												<TableHead>Email</TableHead>
												<TableHead>Property</TableHead>
												<TableHead>Amount</TableHead>
												<TableHead>Late Fees</TableHead>
												<TableHead>Total Due</TableHead>
												<TableHead>Due Date</TableHead>
												<TableHead>Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{paymentsList.map((payment: unknown, idx: number) => {
												const p = payment as Record<string, unknown>;
												const dueDate = new Date(p.dueDate as string).toLocaleDateString();
												const isOverdueStatus = p.isOverdue as boolean;
												const statusObj = p.status as Record<string, unknown> | undefined;
												const statusStr = statusObj?.status as string | undefined;

												return (
													<TableRow key={(p.id as string) || idx} className="hover:bg-[#F6FBFF] dark:hover:bg-neutral-900/50">
														<TableCell className="py-4">{p.contractCode as string}</TableCell>
														<TableCell className="py-4">{p.customerName as string}</TableCell>
														<TableCell className="py-4">{p.customerEmail as string}</TableCell>
														<TableCell className="py-4">{p.propertyName as string}</TableCell>
														<TableCell className="py-4">₦{p.amount as string}</TableCell>
														<TableCell className="py-4">₦{p.lateFees as string}</TableCell>
														<TableCell className="py-4 font-medium">₦{p.totalDue as string}</TableCell>
														<TableCell className="py-4">{dueDate}</TableCell>
														<TableCell className="py-4">
															<Badge
																value={isOverdueStatus ? "Overdue" : statusStr || "Unknown"}
																status={isOverdueStatus ? "banned" : undefined}
																size="sm"
															/>
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
							</div>

							<div className="mt-auto flex flex-col md:flex-row text-center md:text-start justify-center items-center">
								<span className="text-sm text-nowrap">
									Showing <span className="font-medium">{(page - 1) * 10 + 1}</span>-
									<span className="font-medium">{Math.min(page * 10, (paginationData?.totalCount as number) || 0)}</span> of{" "}
									<span className="font-medium">{(paginationData?.totalCount as number) || 0}</span> results
								</span>
								<div className="ml-auto">
									<CompactPagination page={page} pages={pages} onPageChange={setPage} />
								</div>
							</div>
						</CustomCard>
					)}
				</div>
			</CustomCard>

			{/* Export Modal */}
			<ExportConfirmModal
				open={exportOpen}
				onOpenChange={setExportOpen}
				filterLabels={getFilterLabels()}
				onExportFiltered={handleExportFiltered}
				onExportAll={handleExportAll}
				isLoading={exportMutation.isPending}
			/>
		</div>
	);
}
