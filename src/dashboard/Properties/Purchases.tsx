import CustomCard from "@/components/base/CustomCard";
import StatCard from "@/components/base/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageTitles from "@/components/common/PageTitles";
import { inputStyle, tableHeaderRowStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import { useGetPurchaseBatches } from "@/api/purchase";
import EmptyData from "@/components/common/EmptyData";
import { TableSkeleton } from "@/components/common/Skeleton";
import { twMerge } from "tailwind-merge";
import { Link, useSearchParams } from "react-router";
import { _router } from "@/routes/_router";
import { SearchIcon } from "@/assets/icons";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";

function formatMoneyValue(value: string | number | undefined | null) {
	if (value == null || value === "") return "0";
	const n = Number(value);
	if (Number.isNaN(n)) return String(value);
	return n.toLocaleString();
}

function formatMoney(value: string | number | undefined | null) {
	if (value == null || value === "") return "₦0";
	const n = Number(value);
	if (Number.isNaN(n)) return `₦${value}`;
	return `₦${n.toLocaleString()}`;
}

function formatDate(value: string | Date | undefined | null) {
	if (!value) return "—";
	return new Date(value).toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}

export default function Purchases() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [page, setPage] = React.useState(() => {
		const p = searchParams.get("page");
		return p ? parseInt(p, 10) : 1;
	});
	const [query, setQuery] = React.useState(() => searchParams.get("search") || "");
	const limit = 10;
	const debouncedQuery = useDebounceSearch(query, 400);

	const { data, isLoading, isFetching, isError } = useGetPurchaseBatches(
		page,
		limit,
		debouncedQuery || undefined,
	);
	const response = data as {
		data?: Array<Record<string, unknown>>;
		pagination?: { totalPages?: number; total?: number };
		summary?: {
			batchCount?: number;
			totalPurchasePrice?: string;
			totalTransportation?: string;
			totalMiscellaneous?: string;
			totalAcquisitionCost?: string;
		};
	};
	const batches = response?.data || [];
	const summary = response?.summary;
	const totalPages = response?.pagination?.totalPages || 1;
	const totalItems = response?.pagination?.total ?? batches.length;
	const isEmpty = !isLoading && !isFetching && !isError && batches.length === 0;
	const statsLoading = isLoading || (isFetching && !summary);

	const stats = [
		{
			id: "purchase",
			title: "Total Purchase Price",
			value: formatMoneyValue(summary?.totalPurchasePrice),
		},
		{
			id: "transport",
			title: "Total Transportation",
			value: formatMoneyValue(summary?.totalTransportation),
		},
		{
			id: "misc",
			title: "Total Miscellaneous",
			value: formatMoneyValue(summary?.totalMiscellaneous),
		},
		{
			id: "acquisition",
			title: "Total Acquisition Cost",
			value: formatMoneyValue(summary?.totalAcquisitionCost),
		},
	];

	React.useEffect(() => {
		const params = new URLSearchParams();
		params.set("page", String(page));
		params.set("limit", String(limit));
		if (debouncedQuery) params.set("search", debouncedQuery);
		setSearchParams(params, { replace: true });
	}, [page, debouncedQuery, setSearchParams]);

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Purchases" description="View purchase batches and procurement costs" />
			</div>

			<CustomCard className="flex min-h-96 flex-col gap-y-6 md:p-8">
				{isError ? (
					<EmptyData text="Failed to load purchases" />
				) : (
					<div className="flex flex-col gap-y-6">
						<CustomCard className="p-0 border-0 bg-card">
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
								{stats.map((s) => (
									<StatCard
										key={s.id}
										title={s.title}
										value={s.value}
										currency="NGN"
										variant="income"
										loading={statsLoading}
									/>
								))}
							</div>
						</CustomCard>

						<div className="flex items-center justify-end">
							<div className="relative md:w-80">
								<CustomInput
									placeholder="Search by reference or supplier"
									aria-label="Search purchases"
									className={twMerge(inputStyle, "max-w-[320px] h-10 pl-9")}
									iconLeft={<SearchIcon />}
									value={query}
									onChange={(e) => {
										setQuery(e.target.value);
										setPage(1);
									}}
								/>
							</div>
						</div>

						{isLoading || isFetching ? (
							<CustomCard className="mt-4 bg-card p-3">
								<TableSkeleton rows={10} cols={8} />
							</CustomCard>
						) : isEmpty ? (
							<div className="py-8">
								<EmptyData text={query ? "No purchases match your search" : "No purchases at the moment"} />
							</div>
						) : (
							<CustomCard className="mt-4 bg-card p-3">
								<div className="w-full overflow-x-auto">
									<Table>
										<TableHeader className={tableHeaderRowStyle}>
											<TableRow className="bg-[#EAF6FF] dark:bg-neutral-900/80 h-12 overflow-hidden py-4 rounded-lg">
												<TableHead>Batch Reference</TableHead>
												<TableHead>Supplier</TableHead>
												<TableHead>Purchase Date</TableHead>
												<TableHead>Properties</TableHead>
												<TableHead>Purchase Amount</TableHead>
												<TableHead>Transportation Fee</TableHead>
												<TableHead>Miscellaneous Fee</TableHead>
												<TableHead>Total Acquisition</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{batches.map((batch) => {
												const supplier = batch.supplier as { name?: string } | undefined;
												return (
													<TableRow
														key={batch.id as string}
														className="hover:bg-[#F6FBFF] dark:hover:bg-neutral-900/50">
														<TableCell className="py-4">
															<Link
																to={_router.dashboard.purchaseBatchDetails(batch.id as string)}
																className="text-primary underline underline-offset-2 font-medium">
																{batch.reference as string}
															</Link>
														</TableCell>
														<TableCell className="py-4">{supplier?.name || "—"}</TableCell>
														<TableCell className="py-4">
															{formatDate(batch.purchaseDate as string)}
														</TableCell>
														<TableCell className="py-4">{String(batch.propertyCount ?? 0)}</TableCell>
														<TableCell className="py-4">
															{formatMoney(batch.purchaseAmount as string)}
														</TableCell>
														<TableCell className="py-4">
															{formatMoney(batch.transportationCost as string)}
														</TableCell>
														<TableCell className="py-4">
															{formatMoney(batch.miscellaneousCost as string)}
														</TableCell>
														<TableCell className="py-4">
															{formatMoney(batch.totalAcquisitionCost as string)}
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
								<div className="mt-4">
									<CompactPagination
										page={page}
										pages={totalPages}
										onPageChange={setPage}
										showRange
										total={totalItems}
										perPage={limit}
									/>
								</div>
							</CustomCard>
						)}
					</div>
				)}
			</CustomCard>
		</div>
	);
}
