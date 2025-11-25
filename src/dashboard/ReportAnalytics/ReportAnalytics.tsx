import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
	setTab,
	setPage,
	setSearch,
	setFromDate,
	setToDate,
	setIsFilterApplied,
	setSortBy,
	setSortOrder,
	setIncomePeriod,
	setVatPeriod,
	setPenaltyPeriod,
	clearFilters,
} from "@/store/reportAnalyticsSlice";
import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import StatCard from "@/components/base/StatCard";
import CustomInput from "@/components/base/CustomInput";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inputStyle, preTableButtonStyle, tabListStyle, tabStyle } from "@/components/common/commonStyles";
import { FilterIcon, IconWrapper, SearchIcon, CalendarIcon } from "@/assets/icons";
import ExportTrigger from "@/components/common/ExportTrigger";
import EmptyData from "@/components/common/EmptyData";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VATCollected from "./VATCollected";
import InterestPenalties from "./InterestPenalties";
import { useGetPenalties, useGetVATRecords, useGetIncomeEarned, useGetVatCollected, useGetInterestPenalties } from "@/api/analytics";
import type { PenaltyRecord, VATRecord } from "@/types/reports";
import { TableSkeleton } from "@/components/common/Skeleton";

export default function ReportAnalytics() {
	const dispatch = useDispatch();
	const { tab, page, search, fromDate, toDate, isFilterApplied, sortBy, sortOrder, incomePeriod, vatPeriod, penaltyPeriod } = useSelector(
		(state: RootState) => state.reportAnalytics
	);

	const isEmpty = false;

	const { data: incomeData, isLoading: isIncomeLoading } = useGetIncomeEarned(incomePeriod);

	const { data: vatCollectedData, isLoading: isVatCollectedLoading } = useGetVatCollected(vatPeriod);

	const { data: interestPenaltiesData, isLoading: isInterestPenaltiesLoading } = useGetInterestPenalties(penaltyPeriod);

	const { data: vatData, isLoading: isVATLoading } = useGetVATRecords(
		page,
		10,
		isFilterApplied ? fromDate || undefined : undefined,
		isFilterApplied ? toDate || undefined : undefined,
		sortBy,
		sortOrder,
		tab === "vat"
	);

	const vatRows: VATRecord[] = vatData?.data || [];
	const vatTotalPages = vatData?.pagination?.totalPages || 1;

	const { data: penaltiesData, isLoading: isPenaltiesLoading } = useGetPenalties(
		page,
		10,
		search || undefined,
		sortBy,
		sortOrder,
		tab === "interest"
	);

	const penaltyRows: PenaltyRecord[] = penaltiesData?.data || [];
	const totalPages = penaltiesData?.pagination?.totalPages || 1;

	const handleClearFilter = () => {
		dispatch(clearFilters());
	};

	// Dynamic stats data from API
	const stats = [
		{
			id: "income",
			title: "Total Income Earned",
			value: incomeData?.totalIncomeEarned || 0,
			currency: "NGN",
			variant: "income" as const,
			loading: isIncomeLoading,
			period: incomePeriod,
			setPeriod: (period: string) => dispatch(setIncomePeriod(period)),
		},
		{
			id: "vat",
			title: "Total VAT Collected",
			value: vatCollectedData?.totalVatCollected || 0,
			currency: "NGN",
			variant: "income" as const,
			loading: isVatCollectedLoading,
			period: vatPeriod,
			setPeriod: (period: string) => dispatch(setVatPeriod(period)),
		},
		{
			id: "interest",
			title: "Total Interest Penalties",
			value: interestPenaltiesData?.totalInterestPenalties || 0,
			currency: "NGN",
			variant: "income" as const,
			loading: isInterestPenaltiesLoading,
			period: penaltyPeriod,
			setPeriod: (period: string) => dispatch(setPenaltyPeriod(period)),
		},
	];

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Report Analytics" description="Overview of financial and operational reports" />
				<div className="flex items-center gap-3">
					<ExportTrigger title="Export" />
				</div>
			</div>

			<CustomCard className="flex min-h-96 flex-col gap-y-6 md:p-8">
				{!isEmpty ? (
					<div className="flex flex-col gap-y-6">
						<CustomCard className="p-4 border-0 bg-card">
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								{stats.map((s) => (
									<StatCard
										key={s.id}
										title={s.title}
										value={s.value}
										currency={s.currency}
										variant={s.variant}
										loading={s.loading}
										period={s.period.charAt(0).toUpperCase() + s.period.slice(1)}
										onPeriodChange={s.setPeriod}
									/>
								))}
							</div>
						</CustomCard>
						<CustomCard className="border-0 flex-grow w-full p-0">
							<div className="w-full">
								<div className="flex items-center justify-between flex-wrap gap-6">
									<div className="flex items-center gap-4">
										<Tabs defaultValue={tab} onValueChange={(v) => dispatch(setTab(v as "vat" | "interest"))}>
											<TabsList className={tabListStyle}>
												<TabsTrigger className={tabStyle} value="vat">
													VAT Collected
												</TabsTrigger>
												<TabsTrigger className={tabStyle} value="interest">
													Interest Penalties
												</TabsTrigger>
											</TabsList>
										</Tabs>
									</div>

									<div className="flex items-center gap-2">
										<div className="relative md:w-80">
											<CustomInput
												placeholder="Search reports by id, metric or source"
												aria-label="Search reports"
												value={search}
												onChange={(e) => {
													dispatch(setSearch((e.target as HTMLInputElement).value));
													dispatch(setPage(1));
												}}
												className={`max-w-[320px] ${inputStyle} h-10 pl-9`}
												iconLeft={<SearchIcon />}
											/>
										</div>

										<div className="flex items-center gap-2">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<button type="button" className={`${preTableButtonStyle} text-white bg-primary`}>
														<IconWrapper className="text-base">
															<FilterIcon />
														</IconWrapper>
														<span className="hidden sm:inline">Filter</span>
													</button>
												</DropdownMenuTrigger>

												<DropdownMenuContent className="w-80 p-4 mr-4">
													<div className="grid grid-cols-1 gap-4">
														<div>
															<label className="text-xs font-medium text-gray-700 mb-2 block">Sort By Field</label>
															<Select
																value={sortBy}
																onValueChange={(value) => {
																	dispatch(setSortBy(value));
																	dispatch(setPage(1));
																}}>
																<SelectTrigger className="w-full h-9">
																	<SelectValue />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="createdAt">Created At</SelectItem>
																	<SelectItem value="name">Name</SelectItem>
																	<SelectItem value="price">Price</SelectItem>
																	<SelectItem value="updatedAt">Updated At</SelectItem>
																</SelectContent>
															</Select>
														</div>

														<div>
															<label className="text-xs font-medium text-gray-700 mb-2 block">Sort Order</label>
															<Select
																value={sortOrder}
																onValueChange={(value) => {
																	dispatch(setSortOrder(value));
																	dispatch(setPage(1));
																}}>
																<SelectTrigger className="w-full h-9">
																	<SelectValue />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="asc">Ascending</SelectItem>
																	<SelectItem value="desc">Descending</SelectItem>
																</SelectContent>
															</Select>
														</div>

														<div>
															<CustomInput
																type="date"
																label="From"
																value={fromDate ?? ""}
																onChange={(e) => dispatch(setFromDate((e.target as HTMLInputElement).value))}
																className="w-full h-9 text-sm"
																iconRight={<CalendarIcon />}
															/>
														</div>
														<div>
															<CustomInput
																type="date"
																label="To"
																value={toDate ?? ""}
																onChange={(e) => dispatch(setToDate((e.target as HTMLInputElement).value))}
																className="w-full h-9 text-sm"
																iconRight={<CalendarIcon />}
															/>
														</div>
														<div className="pt-2 border-t">
															<button
																onClick={() => {
																	dispatch(setPage(1));
																	dispatch(setIsFilterApplied(true));
																}}
																className="w-full bg-primary text-white px-4 text-sm py-2 rounded">
																Enter
															</button>
														</div>
													</div>
												</DropdownMenuContent>
											</DropdownMenu>
											{isFilterApplied && (
												<button
													type="button"
													onClick={handleClearFilter}
													className={`${preTableButtonStyle} text-gray-700 bg-gray-200 hover:bg-gray-300`}>
													<span>Clear</span>
												</button>
											)}
										</div>
									</div>
								</div>

								<div className="mt-6 rounded-md bg-[#F3FBFF] p-4">
									<div className="flex flex-col justify-between">
										<div className="text-sm flex gap-3 items-center flex-wrap text-gray-500">
											<span>{tab === "vat" ? "Total VAT Amount" : "Total Penalties Amount"}</span>
											<span className="text-xs">
												From {fromDate ?? "2-4-2025"} To {toDate ?? "12-7-2025"}
											</span>
										</div>
										<div className="mt-3 text-2xl font-medium">NGN 50,000,000</div>
									</div>
								</div>

								<CustomCard className="mt-4 bg-card p-3">
									{tab === "vat" ? (
										isVATLoading ? (
											<TableSkeleton rows={5} cols={6} />
										) : vatRows.length === 0 ? (
											<div className="py-8">
												<EmptyData text="No VAT records found for the selected filters." />
											</div>
										) : (
											<VATCollected rows={vatRows} page={page} pages={vatTotalPages} onPageChange={(p) => dispatch(setPage(p))} />
										)
									) : isPenaltiesLoading ? (
										<TableSkeleton rows={5} cols={7} />
									) : penaltyRows.length === 0 ? (
										<div className="py-8">
											<EmptyData text="No interest penalties found for the selected filters." />
										</div>
									) : (
										<InterestPenalties
											rows={penaltyRows}
											page={page}
											pages={totalPages}
											onPageChange={(p) => dispatch(setPage(p))}
											pagination={penaltiesData?.pagination}
										/>
									)}
								</CustomCard>
							</div>
						</CustomCard>
					</div>
				) : (
					<EmptyData className="h-full" text="No reports yet." />
				)}
			</CustomCard>
		</div>
	);
}
