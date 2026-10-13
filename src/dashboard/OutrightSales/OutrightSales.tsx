import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EyeIcon, IconWrapper } from "@/assets/icons";
import { _router } from "@/routes/_router";
import PageTitles from "@/components/common/PageTitles";
import { Link } from "react-router";
import React from "react";
import EmptyData from "@/components/common/EmptyData";
import { TableSkeleton } from "@/components/common/Skeleton";
import { useGetOutrightSales, type OutrightSaleResponse } from "@/api/outrightSale";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import Badge from "@/components/base/Badge";
import CompactPagination from "@/components/ui/compact-pagination";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";

function formatMoney(value?: string | number | null) {
	const n = Number(value ?? 0);
	if (!Number.isFinite(n)) return "₦0";
	return `₦${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function formatDate(value?: string | null) {
	if (!value) return "-";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "-";
	return d.toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric" });
}

function propertySummary(sale: OutrightSaleResponse) {
	const items = sale.items || [];
	if (!items.length) return "-";
	return items
		.map((item) => {
			const name = item.property?.name || "Property";
			return item.quantity > 1 ? `${name} (x${item.quantity})` : name;
		})
		.join(", ");
}

export default function OutrightSales() {
	const [search, setSearch] = React.useState("");
	const [page, setPage] = React.useState(1);
	const debouncedSearch = useDebounceSearch(search);
	const { data, isLoading } = useGetOutrightSales(page, 10, debouncedSearch);
	const noopApply = React.useCallback((_filters: Record<string, string>) => undefined, []);

	React.useEffect(() => {
		setPage(1);
	}, [debouncedSearch]);

	const sales = Array.isArray(data?.data) ? data.data : [];
	const pages = data?.pagination?.totalPages || 1;
	const total = data?.pagination?.total ?? sales.length;

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles
					title="Outright Sales"
					description="In-shop full payment sales recorded from Properties"
				/>
			</div>

			<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
				<div className="flex items-center justify-between flex-wrap gap-6 mb-4">
					<h2 className="font-medium dark:text-gray-300">All Outright Sales</h2>
					<SearchWithFilters
						search={search}
						onSearchChange={setSearch}
						setPage={setPage}
						placeholder="Search by customer, property or payment method"
						showFilter={false}
						onApply={noopApply}
					/>
				</div>

				{isLoading ? (
					<TableSkeleton rows={6} cols={6} />
				) : sales.length === 0 ? (
					<EmptyData text="No outright sales yet. Sell a property from Properties to see records here." />
				) : (
					<>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader className="[&_tr]:border-0">
									<TableRow className="bg-[#EAF6FF] dark:bg-neutral-900/80 h-12 overflow-hidden py-4 rounded-lg">
										<TableHead>Customer</TableHead>
										<TableHead>Properties</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Payment</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Date</TableHead>
										<TableHead className="text-right">Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{sales.map((sale) => {
										const paid = Boolean(sale.paidAt) || !sale.paymentLink;
										return (
											<TableRow key={sale.id} className="hover:bg-[#F6FBFF] dark:hover:bg-neutral-900/50">
												<TableCell>
													<div className="flex flex-col">
														<span className="font-medium">{sale.customerName}</span>
														<span className="text-xs text-muted-foreground">
															{sale.customerEmail || sale.customerPhone || "-"}
														</span>
													</div>
												</TableCell>
												<TableCell className="max-w-[240px]">
													<span className="line-clamp-2 text-sm">{propertySummary(sale)}</span>
												</TableCell>
												<TableCell>
													<div className="flex flex-col">
														<span className="font-medium">{formatMoney(sale.salePriceWithVat)}</span>
														<span className="text-xs text-muted-foreground">
															ex-VAT {formatMoney(sale.salePrice)}
														</span>
													</div>
												</TableCell>
												<TableCell>{sale.paymentMethod?.method || "-"}</TableCell>
												<TableCell>
													<Badge
														value={paid ? "paid" : "pending"}
														label={paid ? "Paid" : "Awaiting payment"}
														status={paid ? "paid" : "pending"}
														size="sm"
													/>
												</TableCell>
												<TableCell>{formatDate(sale.createdAt)}</TableCell>
												<TableCell className="text-right">
													<Link
														to={_router.dashboard.outrightSaleDetails(sale.id)}
														className="inline-flex items-center gap-1.5 text-primary text-sm hover:underline">
														<IconWrapper>
															<EyeIcon />
														</IconWrapper>
														View
													</Link>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
						<CompactPagination
							page={page}
							pages={pages}
							total={total}
							perPage={10}
							showRange
							onPageChange={setPage}
						/>
					</>
				)}
			</CustomCard>
		</div>
	);
}
