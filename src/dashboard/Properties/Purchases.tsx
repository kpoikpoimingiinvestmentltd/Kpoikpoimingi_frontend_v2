import CustomCard from "@/components/base/CustomCard";
import StatCard from "@/components/base/StatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PageTitles from "@/components/common/PageTitles";
import { inputStyle, tableHeaderRowStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import { useGetPurchases } from "@/api/purchase";
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

type PurchaseRow = {
	id: string;
	reference?: string;
	purchaseDate?: string;
	purchasePrice?: string | number;
	quantity?: number;
	allocatedTransportation?: string | number;
	allocatedMiscellaneous?: string | number;
	totalAcquisitionCost?: string | number;
	supplier?: { name?: string } | null;
	batch?: { id?: string; reference?: string } | null;
	property?: { id?: string; name?: string; propertyCode?: string } | null;
};

export default function Purchases() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [page, setPage] = React.useState(() => {
		const p = searchParams.get("page");
		return p ? parseInt(p, 10) : 1;
	});
	const [query, setQuery] = React.useState(() => searchParams.get("search") || "");
	const limit = 10;
	const debouncedQuery = useDebounceSearch(query, 400);

	const { data, isLoading, isFetching, isError } = useGetPurchases(
		page,
		limit,
		debouncedQuery || undefined,
	);
	const response = data as {
		data?: PurchaseRow[];
		pagination?: { totalPages?: number; total?: number };
		summary?: {
			purchaseCount?: number;
			totalPurchasePrice?: string;
			totalTransportation?: string;
			totalMiscellaneous?: string;
			totalAcquisitionCost?: string;
		};
	};
	const purchases = response?.data || [];
	const summary = response?.summary;
	const totalPages = response?.pagination?.totalPages || 1;
	const totalItems = response?.pagination?.total ?? purchases.length;
	const isEmpty = !isLoading && !isFetching && !isError && purchases.length === 0;
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
		<div className="flex min-w-0 flex-col gap-y-6">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-4">
				<PageTitles
					title="Purchases"
					description="Individual and batch procurement costs for all properties"
				/>
			</div>

			{isError ? (
				<CustomCard className="flex min-h-96 flex-col">
					<EmptyData text="Failed to load purchases" />
				</CustomCard>
			) : (
				<div className="flex min-w-0 flex-col gap-y-6">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{stats.map((s) => (
							<StatCard
								key={s.id}
								title={s.title}
								value={s.value}
								currency="NGN"
								variant="income"
								loading={statsLoading}
								className="min-w-0"
							/>
						))}
					</div>

					<CustomCard className="min-w-0 p-3 md:p-4">
						<div className="mb-4 flex justify-end">
							<div className="relative w-full max-w-80">
								<CustomInput
									placeholder="Search by reference, supplier, or property"
									aria-label="Search purchases"
									className={twMerge(inputStyle, "h-10 w-full pl-9")}
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
							<TableSkeleton rows={10} cols={7} />
						) : isEmpty ? (
							<div className="py-8">
								<EmptyData text={query ? "No purchases match your search" : "No purchases at the moment"} />
							</div>
						) : (
							<>
								<div className="w-full min-w-0 overflow-x-auto">
									<Table className="min-w-[720px]">
										<TableHeader className={tableHeaderRowStyle}>
											<TableRow className="h-12 overflow-hidden rounded-lg bg-[#EAF6FF] py-4 dark:bg-neutral-900/80">
												<TableHead>Reference</TableHead>
												<TableHead>Type</TableHead>
												<TableHead>Property</TableHead>
												<TableHead>Supplier</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Purchase</TableHead>
												<TableHead>Transport</TableHead>
												<TableHead>Misc</TableHead>
												<TableHead>Total</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{purchases.map((purchase) => {
												const lineAmount =
													Number(purchase.purchasePrice ?? 0) * Number(purchase.quantity ?? 1);
												const isBatch = Boolean(purchase.batch?.id);
												const propertyLink = purchase.property?.id
													? _router.dashboard.propertiesDetails(purchase.property.id)
													: null;
												const batchLink = purchase.batch?.id
													? _router.dashboard.purchaseBatchDetails(purchase.batch.id)
													: null;
												const propertyLabel =
													purchase.property?.name || purchase.property?.propertyCode || "—";

												return (
													<TableRow
														key={purchase.id}
														className="hover:bg-[#F6FBFF] dark:hover:bg-neutral-900/50">
														<TableCell className="max-w-none py-3 font-medium">
															{batchLink || propertyLink ? (
																<Link
																	to={(batchLink || propertyLink)!}
																	className="text-primary underline underline-offset-2">
																	{purchase.reference}
																</Link>
															) : (
																purchase.reference
															)}
														</TableCell>
														<TableCell className="max-w-none py-3 text-sm">
															{isBatch ? (
																<span>
																	Batch
																	{purchase.batch?.reference ? (
																		<>
																			{" "}
																			(
																			{batchLink ? (
																				<Link
																					to={batchLink}
																					className="text-primary underline underline-offset-2">
																					{purchase.batch.reference}
																				</Link>
																			) : (
																				purchase.batch.reference
																			)}
																			)
																		</>
																	) : null}
																</span>
															) : (
																"Individual"
															)}
														</TableCell>
														<TableCell className="max-w-40 py-3" title={propertyLabel}>
															{propertyLink ? (
																<Link
																	to={propertyLink}
																	className="text-primary underline underline-offset-2">
																	{propertyLabel}
																</Link>
															) : (
																propertyLabel
															)}
														</TableCell>
														<TableCell
															className="max-w-36 py-3"
															title={purchase.supplier?.name || undefined}>
															{purchase.supplier?.name || "—"}
														</TableCell>
														<TableCell className="max-w-none py-3 whitespace-nowrap">
															{formatDate(purchase.purchaseDate)}
														</TableCell>
														<TableCell className="max-w-none py-3 whitespace-nowrap">
															{formatMoney(lineAmount)}
														</TableCell>
														<TableCell className="max-w-none py-3 whitespace-nowrap">
															{formatMoney(purchase.allocatedTransportation)}
														</TableCell>
														<TableCell className="max-w-none py-3 whitespace-nowrap">
															{formatMoney(purchase.allocatedMiscellaneous)}
														</TableCell>
														<TableCell className="max-w-none py-3 font-medium whitespace-nowrap">
															{formatMoney(purchase.totalAcquisitionCost)}
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
							</>
						)}
					</CustomCard>
				</div>
			)}
		</div>
	);
}
