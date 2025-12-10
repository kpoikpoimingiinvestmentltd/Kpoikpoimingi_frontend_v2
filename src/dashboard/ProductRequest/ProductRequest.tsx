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
import { Link } from "react-router";
import { useGetProductRequests, useDeleteRegistration } from "@/api/productRequest";
import type { ProductRequestItem, ProductRequestResponse } from "@/types/productRequest";
import ConfirmModal from "@/components/common/ConfirmModal";
import { TableSkeleton } from "@/components/common/Skeleton";
import { IconWrapper, EditIcon, TrashIcon } from "@/assets/icons";
import { toast } from "sonner";
import EmptyData from "@/components/common/EmptyData";

export default function ProductRequest() {
	const [page, setPage] = React.useState(1);
	const [limit, setLimit] = React.useState(10);
	const [search, setSearch] = React.useState("");
	const debouncedSearch = useDebounceSearch(search, 400);
	const [sortBy, setSortBy] = React.useState<string | undefined>(undefined);
	const [sortOrder, setSortOrder] = React.useState<string | undefined>(undefined);

	const query = useGetProductRequests(page, limit, debouncedSearch || "", sortBy, sortOrder);
	const isLoading = query.isLoading || query.isFetching;

	const items = ((query.data as ProductRequestResponse | undefined)?.data ?? []) as ProductRequestItem[];
	const pagination = (query.data as ProductRequestResponse | undefined)?.pagination;

	const deleteMutation = useDeleteRegistration();

	const [toDelete, setToDelete] = React.useState<{ id?: string; title?: string } | null>(null);
	const [confirmOpen, setConfirmOpen] = React.useState(false);

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Product Request" description="This is all the product request from customers" />
			</div>

			<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
				<div className="flex items-center justify-between flex-wrap gap-6">
					<h2 className="font-semibold">All Request</h2>
					<div className="flex items-center gap-2">
						<SearchWithFilters
							search={search}
							onSearchChange={(v) => {
								setSearch(v);
								setPage(1);
							}}
							setPage={setPage}
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
											<TableRow className="bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
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
												<TableRow key={item.id} className="hover:bg-[#F6FBFF]">
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
															<Link to={_router.dashboard.productRequestDetails.replace(":id", item.id)} className="p-2 flex items-center">
																<IconWrapper className="text-xl">
																	<EditIcon />
																</IconWrapper>
															</Link>
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
									<CompactPagination page={page} pages={pagination?.totalPages ?? 1} onPageChange={setPage} />
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
			</CustomCard>
		</div>
	);
}
