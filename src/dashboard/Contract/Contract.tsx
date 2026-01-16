import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditIcon, FilePlusIcon, IconWrapper } from "@/assets/icons";
import { _router } from "@/routes/_router";
import Badge from "@/components/base/Badge";
import PageTitles from "@/components/common/PageTitles";
import CreateContractModal from "./CreateContractModal";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import { Link } from "react-router";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import EmptyData from "@/components/common/EmptyData";
import { useGetAllContracts, useExportAllContracts } from "@/api/contracts";
import { TableSkeleton } from "@/components/common/Skeleton";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import ExportConfirmModal from "@/components/common/ExportConfirmModal";
import ActionButton from "@/components/base/ActionButton";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import { useSearchParams } from "react-router";
import { useCanPerformAction } from "@/hooks/usePermissions";

export default function Contract() {
	const [searchParams, setSearchParams] = useSearchParams();
	const canExport = useCanPerformAction("export");

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
		const statusId = searchParams.get("statusId");
		if (sortBy) urlFilters.sortBy = sortBy;
		if (sortOrder) urlFilters.sortOrder = sortOrder;
		if (statusId) urlFilters.statusId = statusId;
		return urlFilters;
	});

	const [createOpen, setCreateOpen] = React.useState(false);
	const [exportConfirmOpen, setExportConfirmOpen] = React.useState(false);

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
		const sortBy = searchParams.get("sortBy");
		const sortOrder = searchParams.get("sortOrder");
		const statusId = searchParams.get("statusId");
		if (sortBy) urlFilters.sortBy = sortBy;
		if (sortOrder) urlFilters.sortOrder = sortOrder;
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
			searchParams.has("statusId");
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
		if (filters.sortBy) params.set("sortBy", filters.sortBy);
		else params.delete("sortBy");
		if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
		else params.delete("sortOrder");
		if (filters.statusId) params.set("statusId", filters.statusId);
		else params.delete("statusId");
		setSearchParams(params, { replace: true });
	}, [page, search, filters, setSearchParams]);

	const sortBy = (filters.sortBy as string) || "createdAt";
	const sortOrder = (filters.sortOrder as string) || "desc";

	const { data = {}, isLoading, isFetching } = useGetAllContracts(page, 10, debouncedSearch, sortBy, sortOrder, filters);
	const dataTyped = data as Record<string, unknown>;
	const contracts = Array.isArray(dataTyped?.data) ? (dataTyped?.data as unknown[]) : [];
	const paginationData = dataTyped?.pagination as Record<string, unknown> | undefined;
	const pages = (paginationData?.totalPages as number) || 1;

	const exportMutation = useExportAllContracts();

	const statusMap: Record<string, string> = {
		"1": "Pending",
		"2": "Paused",
		"3": "Active",
		"4": "Completed",
		"5": "Terminated",
		"6": "Cancelled",
		"7": "Pending Down Payment",
	};

	const hasActiveFilters = Boolean(debouncedSearch || filters.statusId);

	const getFilterLabels = () => {
		const labels: Record<string, string> = {};
		if (filters.statusId) {
			labels["Status"] = statusMap[filters.statusId] || filters.statusId;
		}
		return labels;
	};

	const handleExportClick = async () => {
		if (!hasActiveFilters) {
			// No active filters, export all directly
			try {
				const blob = await exportMutation.mutateAsync({
					search: undefined,
					statusId: undefined,
				});
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = `contracts-${new Date().toISOString().slice(0, 10)}.csv`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
				toast.success("CSV exported successfully");
			} catch (err) {
				console.error("Failed to export contracts:", err);
				toast.error(extractErrorMessage(err, "Failed to export contracts"));
			}
		} else {
			// Show confirmation dialog
			setExportConfirmOpen(true);
		}
	};

	const handleExportFiltered = async () => {
		try {
			const blob = await exportMutation.mutateAsync({
				search: debouncedSearch || undefined,
				statusId: filters.statusId || undefined,
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `contracts-filtered-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("CSV exported with filters");
		} catch (err) {
			console.error("Failed to export contracts:", err);
			toast.error(extractErrorMessage(err, "Failed to export contracts"));
		}
	};

	const handleExportAll = async () => {
		try {
			const blob = await exportMutation.mutateAsync({
				search: undefined,
				statusId: undefined,
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `contracts-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("CSV exported successfully");
		} catch (err) {
			console.error("Failed to export contracts:", err);
			toast.error(extractErrorMessage(err, "Failed to export contracts"));
		}
	};
	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Contract" description="The contracts transaction between Kpo kpoi mingi investment and it customers" />
				<div className="flex items-center gap-3">
					{canExport && (
						<ActionButton
							type="button"
							className="bg-primary/10 text-primary hover:bg-primary/20"
							onClick={handleExportClick}
							disabled={exportMutation.isPending}>
							<span className="text-sm">{exportMutation.isPending ? "Exporting..." : "Export CSV"}</span>
						</ActionButton>
					)}
					<button
						type="button"
						onClick={() => setCreateOpen(true)}
						className="flex items-center gap-2 bg-primary rounded-sm px-4 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<FilePlusIcon />
						</IconWrapper>
						<span className="text-sm">Create Contract</span>
					</button>
				</div>
			</div>
			<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
				<div className="flex items-center justify-between flex-wrap gap-6">
					<h2 className="font-semibold">All Contracts </h2>
					<div className="flex items-center gap-2">
						<SearchWithFilters
							search={search}
							onSearchChange={(v) => setSearch(v)}
							placeholder="Search by name, property or contract code"
							showFilter={true}
							fields={[
								{
									key: "sortBy",
									label: "Sort by field",
									type: "sortBy",
									options: [
										{ value: "name", label: "name" },
										{ value: "price", label: "price" },
										{ value: "createdAt", label: "createdAt" },
										{ value: "updatedAt", label: "updatedAt" },
									],
								},
								{ key: "sortOrder", label: "Sort order", type: "sortOrder" },
								{
									key: "statusId",
									label: "Status",
									type: "select",
									options: [
										{ value: "1", label: "Pending" },
										{ value: "2", label: "Paused" },
										{ value: "3", label: "Active" },
										{ value: "4", label: "Completed" },
										{ value: "5", label: "Terminated" },
										{ value: "6", label: "Cancelled" },
										{ value: "7", label: "Pending Down Payment" },
									],
								},
							]}
							initialValues={filters}
							onApply={(f) => {
								setFilters(f);
								setPage(1);
							}}
							onReset={() => {
								setSearch("");
								setFilters({});
								setPage(1);
							}}
						/>
					</div>
				</div>
				<div className="min-h-80 flex">
					{isLoading || isFetching ? (
						<TableSkeleton rows={10} cols={8} />
					) : contracts.length === 0 ? (
						<div className="flex-grow flex items-center justify-center">
							<EmptyData text="No Contracts at the moment" />
						</div>
					) : (
						<div className="flex-grow w-full flex flex-col gap-y-8 rounded-lg mt-8">
							<div className="w-full">
								<div className="overflow-x-auto w-full">
									<Table>
										<TableHeader className="[&_tr]:border-0">
											<TableRow className="bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
												<TableHead>Customer ID</TableHead>
												<TableHead>Name</TableHead>
												<TableHead>Property Name</TableHead>
												<TableHead>Payment Type</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Outstanding Balance</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Action</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{contracts.map((contract: unknown, idx: number) => {
												const c = contract as Record<string, unknown>;
												return (
													<TableRow key={idx} className="hover:bg-[#F6FBFF]">
														<TableCell>{((c.customer as Record<string, unknown>)?.customerCode as string) || "N/A"}</TableCell>
														<TableCell>{((c.customer as Record<string, unknown>)?.fullName as string) || "N/A"}</TableCell>
														<TableCell>{((c.property as Record<string, unknown>)?.name as string) || "N/A"}</TableCell>
														<TableCell>{((c.paymentType as Record<string, unknown>)?.type as string) || "N/A"}</TableCell>
														<TableCell>
															<Badge
																value={statusMap[String(c.statusId)] || ((c.status as Record<string, unknown>)?.status as string) || "N/A"}
																size="sm"
																status={String(c.statusId) === "7" ? "pending" : undefined}
															/>
														</TableCell>
														<TableCell>₦{parseInt((c.outStandingBalance as string) || "0").toLocaleString()}</TableCell>
														<TableCell>{new Date(c.createdAt as string).toLocaleDateString()}</TableCell>
														<TableCell>
															<div className="flex items-center">
																<Link to={_router.dashboard.contractDetails.replace(":id", c.id as string)} className=" p-2 flex items-center">
																	<IconWrapper>
																		<EditIcon />
																	</IconWrapper>
																</Link>
															</div>
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
							</div>

							<CompactPagination page={page} pages={pages} showRange onPageChange={setPage} />
						</div>
					)}
				</div>
			</CustomCard>

			<CreateContractModal open={createOpen} onOpenChange={setCreateOpen} />

			<ExportConfirmModal
				open={exportConfirmOpen}
				onOpenChange={setExportConfirmOpen}
				searchTerm={debouncedSearch}
				filterLabels={getFilterLabels()}
				onExportFiltered={handleExportFiltered}
				onExportAll={handleExportAll}
				isLoading={exportMutation.isPending}
			/>
		</div>
	);
}
