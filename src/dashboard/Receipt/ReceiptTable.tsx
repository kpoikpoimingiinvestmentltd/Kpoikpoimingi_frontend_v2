import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import CustomCard from "@/components/base/CustomCard";
import { EyeIcon, IconWrapper, ShareIcon } from "@/assets/icons";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import { Link } from "react-router";
import { useGetReceipts, useGetReceiptById } from "@/api/receipt";
import { tableHeaderRowStyle } from "../../components/common/commonStyles";
import { _router } from "../../routes/_router";
import { TableSkeleton } from "@/components/common/Skeleton";
import type { ReceiptListItem, ReceiptDetail } from "@/types/receipt";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import type { FilterField } from "@/components/common/SearchWithFilters";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { useSearchParams } from "react-router";
import ReceiptDisplayModal from "./ReceiptDisplayModal";
import EmptyData from "../../components/common/EmptyData";

export default function ReceiptTable() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [shareModalOpen, setShareModalOpen] = React.useState(false);
	const [selectedReceiptId, setSelectedReceiptId] = React.useState<string | null>(null);

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
		for (const key of [
			"limit",
			"sortBy",
			"sortOrder",
			"transactionType",
			"paymentMethodId",
			"statusId",
			"startDate",
			"endDate",
		]) {
			const v = searchParams.get(key);
			if (v) urlFilters[key] = v;
		}
		return urlFilters;
	});

	const debouncedSearch = useDebounceSearch(search);

	// Sync state with URL params on mount and when URL changes (back/forward navigation)
	React.useEffect(() => {
		const pageParam = searchParams.get("page");
		const newPage = pageParam ? parseInt(pageParam, 10) : 1;
		setPage(newPage);

		const searchParam = searchParams.get("search") || "";
		setSearch(searchParam);

		const urlFilters: Record<string, string> = {};
		for (const key of [
			"limit",
			"sortBy",
			"sortOrder",
			"transactionType",
			"paymentMethodId",
			"statusId",
			"startDate",
			"endDate",
		]) {
			const v = searchParams.get(key);
			if (v) urlFilters[key] = v;
		}
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
	}, []);

	// Update URL when state changes
	React.useEffect(() => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());
		params.set("search", search);
		for (const key of [
			"limit",
			"sortBy",
			"sortOrder",
			"transactionType",
			"paymentMethodId",
			"statusId",
			"startDate",
			"endDate",
		]) {
			if (filters[key]) params.set(key, filters[key]);
			else params.delete(key);
		}
		setSearchParams(params, { replace: true });
	}, [page, search, filters, setSearchParams]);

	const limit = Number((filters.limit as string) || "10");
	const sortBy = (filters.sortBy as string) || "createdAt";
	const sortOrder = (filters.sortOrder as string) || "desc";
	const listFilters = {
		paymentMethodId: filters.paymentMethodId || undefined,
		statusId: filters.statusId || undefined,
		transactionType: filters.transactionType || undefined,
		startDate: filters.startDate || undefined,
		endDate: filters.endDate || undefined,
	};

	const { data, isLoading, isFetching } = useGetReceipts(
		page,
		limit,
		debouncedSearch || undefined,
		sortBy,
		sortOrder,
		true,
		listFilters,
	);
	const { data: selectedReceipt } = useGetReceiptById(selectedReceiptId ?? undefined, selectedReceiptId !== null);

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

	const handleShareClick = (receiptId: string) => {
		setSelectedReceiptId(receiptId);
		setShareModalOpen(true);
	};

	const paginationData = (data?.pagination as Record<string, unknown>) || {};
	const pagination = {
		page: (paginationData.page as number) ?? 1,
		limit: (paginationData.limit as number) ?? limit,
		total: (paginationData.total as number) ?? 0,
		totalPages: (paginationData.totalPages as number) ?? 1,
	};
	const items: ReceiptListItem[] = Array.isArray(data?.data) ? data.data : [];
	const pages = pagination.totalPages ?? Math.max(1, Math.ceil(pagination.total / limit));

	const formatCurrency = (v?: string | number | null) => {
		if (v === undefined || v === null || v === "") return "-";
		const n = Number(v);
		if (Number.isNaN(n)) return String(v);
		return `₦${n.toLocaleString()}`;
	};

	const formatPaymentMethod = (pm?: string | { id?: number; method?: string } | null) => {
		if (!pm) return "-";
		if (typeof pm === "string") return pm;
		const method = (pm as Record<string, unknown>)?.method;
		if (!method) return "-";
		if (method === "PAYMENT_LINK") return "Payment Link";
		return String(method);
	};

	return (
		<CustomCard className="mt-4 p-6">
			<div className="flex items-center justify-between flex-wrap gap-4">
				<h3 className="text-base font-medium">All Receipt</h3>
				<div className="flex items-center gap-2">
					<SearchWithFilters
						search={search}
						onSearchChange={handleSearchChange}
						setPage={handlePageChange}
						placeholder="Search by receipt number, customer, or reference"
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
									key: "transactionType",
									label: "Transaction type",
									type: "select",
									options: [
										{ value: "hire_purchase", label: "Hire Purchase" },
										{ value: "outright_sale", label: "Outright Sale" },
									],
								},
								{
									key: "paymentMethodId",
									label: "Payment method",
									type: "select",
									options: [
										{ value: "1", label: "Cash" },
										{ value: "2", label: "POS" },
										{ value: "3", label: "Transfer" },
										{ value: "4", label: "Payment Link" },
									],
								},
								{
									key: "statusId",
									label: "Status",
									type: "select",
									options: [
										{ value: "1", label: "Issued" },
										{ value: "2", label: "Pending" },
										{ value: "3", label: "Paid" },
									],
								},
								{ key: "startDate", label: "From date", type: "date" },
								{ key: "endDate", label: "To date", type: "date" },
								{
									key: "sortBy",
									label: "Sort By",
									type: "sortBy",
									options: [
										{ value: "createdAt", label: "createdAt" },
										{ value: "paymentDate", label: "paymentDate" },
										{ value: "amountPaid", label: "amountPaid" },
										{ value: "receiptNumber", label: "receiptNumber" },
									],
								},
								{ key: "sortOrder", label: "Sort Order", type: "sortOrder" },
							] as FilterField[]
						}
						initialValues={{
							limit: filters.limit || "10",
							sortBy: filters.sortBy || "",
							sortOrder: filters.sortOrder || "",
							transactionType: filters.transactionType || "",
							paymentMethodId: filters.paymentMethodId || "",
							statusId: filters.statusId || "",
							startDate: filters.startDate || "",
							endDate: filters.endDate || "",
						}}
						onApply={handleFiltersApply}
						onReset={handleFiltersReset}
					/>
				</div>
			</div>

			<div className="overflow-x-auto min-h-96 flex items-start justify-center [&>*]:grow">
				{isLoading || isFetching ? (
					<TableSkeleton rows={6} cols={7} />
				) : items.length === 0 ? (
					<EmptyData text="No receipts found" />
				) : (
					<div className="w-full mt-5">
						<Table>
							<TableHeader>
								<TableRow className={tableHeaderRowStyle}>
									<TableHead>Receipt ID</TableHead>
									<TableHead>Customer Name</TableHead>
									<TableHead>Property Name</TableHead>
									<TableHead>Transaction</TableHead>
									<TableHead>Payment Method</TableHead>
									<TableHead>Amount Paid</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Date</TableHead>
									<TableHead className="text-center">Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{items.map((it, idx) => (
									<TableRow key={it.id ?? idx} className="hover:bg-card">
										<TableCell className="text-sm">{it.receiptNumber ?? it.id}</TableCell>
										<TableCell className="text-sm">
											{it.customer?.fullName ?? it.outrightSale?.customerName ?? "-"}
										</TableCell>
										<TableCell className="text-sm">{it.contract?.property?.name ?? it.propertyName ?? "-"}</TableCell>
										<TableCell className="text-sm">
											{it.transactionType === "outright_sale" || it.outrightSaleId
												? "Outright Sale"
												: "Hire Purchase"}
										</TableCell>
										<TableCell className="text-sm">{formatPaymentMethod(it.paymentMethod as string | { id?: number; method?: string })}</TableCell>
										<TableCell className="text-sm">{formatCurrency(it.amountPaid ?? it.totalAmount)}</TableCell>
										<TableCell className="text-sm">{it.status?.status ?? "-"}</TableCell>
										<TableCell className="text-sm">
											{it.paymentDate
												? new Date(it.paymentDate).toLocaleDateString()
												: it.createdAt
													? new Date(it.createdAt).toLocaleDateString()
													: "-"}
										</TableCell>
										<TableCell>
											<div className="flex items-center justify-center gap-1">
												<Link to={_router.dashboard.receiptDetails.replace(":id", it.id)} className="p-2 text-primary">
													<IconWrapper>
														<EyeIcon />
													</IconWrapper>
												</Link>
												<button onClick={() => handleShareClick(it.id)} className="p-2 text-primary hover:text-primary/80 transition-colors">
													<IconWrapper>
														<ShareIcon />
													</IconWrapper>
												</button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						<CompactPagination showRange page={page} pages={pages} onPageChange={handlePageChange} />
					</div>
				)}
			</div>

			<ReceiptDisplayModal open={shareModalOpen} onOpenChange={setShareModalOpen} receipt={(selectedReceipt as ReceiptDetail) ?? null} />
		</CustomCard>
	);
}
