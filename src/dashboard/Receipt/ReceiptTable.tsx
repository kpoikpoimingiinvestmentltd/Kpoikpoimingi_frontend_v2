import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import CustomCard from "@/components/base/CustomCard";
import { EyeIcon, IconWrapper, ShareIcon } from "@/assets/icons";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import { Link } from "react-router";
import { useGetReceipts } from "@/api/receipt";
import { tableHeaderRowStyle } from "../../components/common/commonStyles";
import { _router } from "../../routes/_router";
import { TableSkeleton } from "@/components/common/Skeleton";
import type { ReceiptListItem } from "@/types/receipt";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import type { FilterField } from "@/components/common/SearchWithFilters";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { useSearchParams } from "react-router";

export default function ReceiptTable() {
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

	const debouncedSearch = useDebounceSearch(search);

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

	const { data, isLoading, isFetching } = useGetReceipts(page, limit, debouncedSearch || undefined, sortBy, sortOrder);

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
			<div className="flex items-center justify-between gap-4 flex-wrap mb-4">
				<h3 className="text-base font-medium">All Receipt</h3>
				<div className="flex items-center gap-2">
					<SearchWithFilters
						search={search}
						onSearchChange={handleSearchChange}
						setPage={handlePageChange}
						placeholder="Search by receipt number or customer name"
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
										{ value: "paymentDate", label: "paymentDate" },
										{ value: "amountPaid", label: "amountPaid" },
										{ value: "receiptNumber", label: "receiptNumber" },
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

			<div className="overflow-x-auto">
				{isLoading || isFetching ? (
					<TableSkeleton rows={6} cols={7} />
				) : items.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">No receipts found</div>
				) : (
					<>
						<Table>
							<TableHeader>
								<TableRow className={tableHeaderRowStyle}>
									<TableHead>Receipt ID</TableHead>
									<TableHead>Customer Name</TableHead>
									<TableHead>Property Name</TableHead>
									<TableHead>Payment Type</TableHead>
									<TableHead>Amount Paid</TableHead>
									<TableHead>Date</TableHead>
									<TableHead className="text-center">Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{items.map((it, idx) => (
									<TableRow key={it.id ?? idx} className="hover:bg-card">
										<TableCell className="text-sm text-muted-foreground">{it.receiptNumber ?? it.id}</TableCell>
										<TableCell className="text-sm text-[#667085]">{it.customer?.fullName ?? "-"}</TableCell>
										<TableCell className="text-sm text-[#667085]">{it.contract?.property?.name ?? it.propertyName ?? "-"}</TableCell>
										<TableCell className="text-sm text-[#667085]">
											{formatPaymentMethod(it.paymentMethod as string | { id?: number; method?: string })}
										</TableCell>
										<TableCell className="text-sm text-[#667085]">{formatCurrency(it.amountPaid ?? it.totalAmount)}</TableCell>
										<TableCell className="text-sm text-[#667085]">
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
												<button className="p-2 text-primary">
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
					</>
				)}
			</div>
		</CustomCard>
	);
}
