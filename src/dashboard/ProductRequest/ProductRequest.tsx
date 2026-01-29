import React from "react";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import Badge from "@/components/base/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CompactPagination from "@/components/ui/compact-pagination";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import type { FilterField } from "@/components/common/SearchWithFilters";
import { _router } from "@/routes/_router";
import { Link, useSearchParams } from "react-router";
import { useGetProductRequests, useDeleteRegistration, useExportProductRequests } from "@/api/productRequest";
import type { ProductRequestItem, ProductRequestResponse } from "@/types/productRequest";
import ConfirmModal from "@/components/common/ConfirmModal";
import { TableSkeleton } from "@/components/common/Skeleton";
import { IconWrapper, EditIcon, TrashIcon, ExportFileIcon } from "@/assets/icons";
import { toast } from "sonner";
import EmptyData from "@/components/common/EmptyData";
import ExportConfirmModal from "@/components/common/ExportConfirmModal";
import ActionButton from "@/components/base/ActionButton";
import { extractErrorMessage } from "@/lib/utils";
import { useCanDelete, useCanExport } from "@/hooks/usePermissions";

export default function ProductRequest() {
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
		const limit = searchParams.get("limit");
		const sortBy = searchParams.get("sortBy");
		const sortOrder = searchParams.get("sortOrder");
		if (limit) urlFilters.limit = limit;
		if (sortBy) urlFilters.sortBy = sortBy;
		if (sortOrder) urlFilters.sortOrder = sortOrder;
		return urlFilters;
	});

	const debouncedSearch = useDebounceSearch(search, 400);
	const [, setIsMounted] = React.useState(false);

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
			params.set("limit", "10");
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

	const [exportConfirmOpen, setExportConfirmOpen] = React.useState(false);

	const query = useGetProductRequests(page, limit, debouncedSearch || "", sortBy, sortOrder);
	const isLoading = query.isLoading || query.isFetching;

	const items = ((query.data as ProductRequestResponse | undefined)?.data ?? []) as ProductRequestItem[];
	const pagination = (query.data as ProductRequestResponse | undefined)?.pagination;

	const deleteMutation = useDeleteRegistration();
	const exportMutation = useExportProductRequests();

	const canDelete = useCanDelete();
	const canExport = useCanExport();

	const [toDelete, setToDelete] = React.useState<{ id?: string; title?: string } | null>(null);
	const [confirmOpen, setConfirmOpen] = React.useState(false);

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

	const handleExportClick = async () => {
		if (!debouncedSearch) {
			// No active search, export all directly
			try {
				const blob = await exportMutation.mutateAsync({ search: undefined });
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = `product-requests-${new Date().toISOString().slice(0, 10)}.csv`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url);
				toast.success("CSV exported successfully");
			} catch (err) {
				console.error("Failed to export product requests:", err);
				toast.error(extractErrorMessage(err, "Failed to export product requests"));
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
			link.download = `product-requests-${debouncedSearch}-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success(`CSV exported for "${debouncedSearch}"`);
		} catch (err) {
			console.error("Failed to export product requests:", err);
			toast.error(extractErrorMessage(err, "Failed to export product requests"));
		}
	};

	const handleExportAll = async () => {
		try {
			const blob = await exportMutation.mutateAsync({ search: undefined });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `product-requests-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("CSV exported successfully");
		} catch (err) {
			console.error("Failed to export product requests:", err);
			toast.error(extractErrorMessage(err, "Failed to export product requests"));
		}
	};

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Product Request" description="This is all the product request from customers" />
				<div className="flex items-center gap-3">
					{canExport && (
						<ActionButton
							type="button"
							className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20"
							onClick={handleExportClick}
							disabled={exportMutation.isPending}>
							<IconWrapper>
								<ExportFileIcon />
							</IconWrapper>
							<span>{exportMutation.isPending ? "Exporting..." : "Export"}</span>
						</ActionButton>
					)}
				</div>
			</div>

			<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
				<div className="flex items-center justify-between flex-wrap gap-6">
					<h2 className="font-semibold">All Request</h2>
					<div className="flex items-center gap-2">
						<SearchWithFilters
							search={search}
							onSearchChange={handleSearchChange}
							setPage={handlePageChange}
							placeholder="Search here"
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
							initialValues={{ limit: filters.limit || "10", sortBy: filters.sortBy || "", sortOrder: filters.sortOrder || "" }}
							onApply={handleFiltersApply}
							onReset={handleFiltersReset}
						/>
					</div>
				</div>

				<div className="min-h-80 flex">
					{isLoading ? (
						<TableSkeleton rows={6} cols={7} />
					) : items.length === 0 ? (
						<div className="flex-grow flex items-center justify-center">
							<EmptyData text="No product requests found." />
						</div>
					) : (
						<div className="flex-grow w-full flex flex-col gap-y-8 rounded-lg mt-8">
							<div className="w-full">
								<div className="overflow-x-auto w-full">
									<Table>
										<TableHeader className="[&_tr]:border-0">
											<TableRow className="bg-[#EAF6FF] dark:bg-neutral-900/80 h-12 overflow-hidden py-4 rounded-lg">
												<TableHead>Request From</TableHead>
												<TableHead>Property Type</TableHead>
												<TableHead>Payment Method</TableHead>
												<TableHead>Total amount</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Action</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{items.map((item) => (
												<TableRow key={item.id} className="hover:bg-[#F6FBFF] dark:hover:bg-neutral-900/50">
													<TableCell>{item.name}</TableCell>
													<TableCell>{item.propertyType}</TableCell>
													<TableCell>{item.paymentMethod}</TableCell>
													<TableCell>{item.totalAmount.toLocaleString()}</TableCell>
													<TableCell>
														<Badge value={item.status} status={item.status === "unapproved" ? "pending" : "success"} size="sm" />
													</TableCell>
													<TableCell>{new Date(item.dateCreated).toLocaleDateString()}</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<Link
																to={`${_router.dashboard.productRequestDetails.replace(":id", item.id)}?tab=information`}
																className="p-2 flex items-center">
																<IconWrapper className="text-xl">
																	<EditIcon />
																</IconWrapper>
															</Link>
															{canDelete && (
																<button
																	type="button"
																	title="Delete"
																	onClick={() => {
																		setToDelete({ id: item.id, title: item.name });
																		setConfirmOpen(true);
																	}}
																	className="text-red-500 p-2">
																	<IconWrapper className="text-xl">
																		<TrashIcon />
																	</IconWrapper>
																</button>
															)}
														</div>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</div>

							<div className="mt-auto flex flex-col md:flex-row text-center md:text-start justify-center items-center">
								<span className="text-sm text-nowrap">
									Showing <span className="font-medium">{pagination ? (pagination.page - 1) * (pagination.limit ?? limit) + 1 : 0}</span> of{" "}
									<span className="font-medium">{pagination?.total ?? 0}</span> results
								</span>
								<div className="ml-auto">
									<CompactPagination page={page} pages={pagination?.totalPages ?? 1} onPageChange={handlePageChange} />
								</div>
							</div>
						</div>
					)}
				</div>
				<ConfirmModal
					open={confirmOpen}
					onOpenChange={(o: boolean) => {
						setConfirmOpen(o);
						if (!o) setToDelete(null);
					}}
					title={toDelete ? `Delete ${toDelete.title}?` : "Delete registration"}
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
								toast.success("Registration deleted");
								return true;
							},
							loading: deleteMutation.isPending,
							variant: "destructive",
						},
					]}
				/>

				<ExportConfirmModal
					open={exportConfirmOpen}
					onOpenChange={setExportConfirmOpen}
					searchTerm={debouncedSearch}
					onExportFiltered={handleExportFiltered}
					onExportAll={handleExportAll}
					isLoading={exportMutation.isPending}
				/>
			</CustomCard>
		</div>
	);
}
