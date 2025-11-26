import React from "react";
import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CompactPagination from "@/components/ui/compact-pagination";
import { inputStyle, preTableButtonStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import { IconWrapper, SearchIcon, EditIcon, TrashIcon, FilterIcon /* CheckIcon, CloseIcon */ } from "@/assets/icons";
import { _router } from "@/routes/_router";
import { Link } from "react-router";
import { useGetProductRequests, /* useApproveRegistration, useDeclineRegistration, */ useDeleteRegistration } from "@/api/productRequest";
import type { ProductRequestItem, ProductRequestResponse } from "@/types/productRequest";
import ConfirmModal from "@/components/common/ConfirmModal";
import { TableSkeleton } from "@/components/common/Skeleton";
// import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import EmptyData from "@/components/common/EmptyData";

export default function ProductRequest() {
	const [page, setPage] = React.useState(1);
	const [limit] = React.useState(10);
	const [search, setSearch] = React.useState("");

	const query = useGetProductRequests(page, limit, search);
	const isLoading = query.isLoading || query.isFetching;

	const items = ((query.data as ProductRequestResponse | undefined)?.data ?? []) as ProductRequestItem[];
	const pagination = (query.data as ProductRequestResponse | undefined)?.pagination;

	// actions
	// const queryClient = useQueryClient();
	// const approveMutation = useApproveRegistration();
	// const declineMutation = useDeclineRegistration();
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
						<div className="relative md:w-80">
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
							<CustomInput
								placeholder="Search here"
								className={`${inputStyle} h-10 pl-9`}
								iconLeft={<SearchIcon />}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
						<button type="button" className={`${preTableButtonStyle} text-white bg-primary ml-auto`}>
							<IconWrapper className="text-base">
								<FilterIcon />
							</IconWrapper>
							<span className="hidden sm:inline">Filter</span>
						</button>
					</div>
				</div>

				<div className="overflow-x-auto w-full mt-8">
					{isLoading ? (
						<div className="p-6">
							<TableSkeleton rows={6} cols={7} />
						</div>
					) : items.length === 0 ? (
						<EmptyData text="No product requests found." />
					) : (
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
											<span
												className={`rounded-md capitalize px-3 py-1 text-sm ${
													item.status === "unapproved" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"
												}`}>
												{item.status}
											</span>
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
					)}
				</div>

				<div className="mt-8 flex flex-col md:flex-row text-center md:text-start justify-center items-center">
					<span className="text-sm text-nowrap">
						Showing <span className="font-medium">{pagination ? (pagination.page - 1) * (pagination.limit ?? limit) + 1 : 0}</span> of{" "}
						<span className="font-medium">{pagination?.total ?? 0}</span> results
					</span>
					<div className="ml-auto">
						<CompactPagination page={page} pages={pagination?.totalPages ?? 1} onPageChange={setPage} />
					</div>
				</div>
			</CustomCard>
		</div>
	);
}
