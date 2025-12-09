import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
	setTab,
	setVatPage,
	setVatLimit,
	setVatSortBy,
	setVatSortOrder,
	setVatFromDate,
	setVatToDate,
	setIsFilterApplied,
	setPenaltyPage,
	setPenaltySearch,
	setPenaltyLimit,
	setPenaltySortBy,
	setPenaltySortOrder,
	setIncomePeriod,
	setVatPeriod,
	setPenaltyPeriod,
	clearFilters,
	clearPenaltyFilters,
} from "@/store/reportAnalyticsSlice";
import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import StatCard from "@/components/base/StatCard";
import CustomInput from "@/components/base/CustomInput";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inputStyle, preTableButtonStyle, tabListStyle, tabStyle } from "@/components/common/commonStyles";
import { FilterIcon, IconWrapper, SearchIcon, CalendarIcon, CloseIcon } from "@/assets/icons";
import ExportTrigger from "@/components/common/ExportTrigger";
import { useExportInterestPenalties } from "@/api/analytics";
import { toast } from "sonner";
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
	const {
		tab,
		vatPage,
		vatLimit,
		vatSortBy,
		vatSortOrder,
		vatFromDate,
		vatToDate,
		isFilterApplied,
		incomePeriod,
		vatPeriod,
		penaltyPeriod,
		penaltyPage,
		penaltySearch,
		penaltyLimit,
		penaltySortBy,
		penaltySortOrder,
	} = useSelector((state: RootState) => state.reportAnalytics);

	const isEmpty = false;

	const { data: incomeData, isLoading: isIncomeLoading } = useGetIncomeEarned(incomePeriod);

	const { data: vatCollectedData, isLoading: isVatCollectedLoading } = useGetVatCollected(vatPeriod);

	const { data: interestPenaltiesData, isLoading: isInterestPenaltiesLoading } = useGetInterestPenalties(penaltyPeriod);

	const { data: vatData, isLoading: isVATLoading } = useGetVATRecords(
		vatPage,
		vatLimit,
		isFilterApplied ? vatFromDate || undefined : undefined,
		isFilterApplied ? vatToDate || undefined : undefined,
		vatSortBy,
		vatSortOrder,
		tab === "vat"
	);

	const vatRows: VATRecord[] = vatData?.data || [];
	const vatTotalPages = vatData?.pagination?.totalPages || 1;

	const { data: penaltiesData, isLoading: isPenaltiesLoading } = useGetPenalties(
		penaltyPage,
		penaltyLimit,
		penaltySearch || undefined,
		penaltySortBy,
		penaltySortOrder,
		tab === "interest"
	);

	const penaltyRows: PenaltyRecord[] = penaltiesData?.data || [];
	const totalPages = penaltiesData?.pagination?.totalPages || 1;

	const handleClearFilter = () => {
		dispatch(clearFilters());
	};

	// Hook for exporting interest penalties CSV
	const exportInterestMutation = useExportInterestPenalties();

	const handleExport = async (format: "csv" | "pdf") => {
		if (format !== "csv") return; // only CSV supported for now
		if (tab !== "interest") {
			toast.error("Export available only for Interest Penalties tab.");
			return;
		}

		try {
			const blob = await exportInterestMutation.mutateAsync({
				page: penaltyPage || 1,
				limit: penaltyLimit || 10,
				search: penaltySearch || "",
				sortBy: penaltySortBy || "createdAt",
				sortOrder: penaltySortOrder || "desc",
				period: penaltyPeriod || "daily",
			});
			const fileName = `interest-penalties-${new Date().toISOString().slice(0, 10)}.csv`;
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			link.remove();
			URL.revokeObjectURL(url);
			toast.success("Export started; check your downloads");
		} catch (err) {
			console.error("Failed to export interest penalties:", err);
			toast.error("Failed to export interest penalties");
		}
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
					<ExportTrigger
						title="Export"
						onSelect={(format) => {
							handleExport(format);
						}}
					/>
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
										{tab === "interest" && (
											<div className="relative md:w-80">
												<CustomInput
													placeholder="Search by contract code"
													aria-label="Search penalties"
													value={penaltySearch}
													onChange={(e) => {
														const v = (e.target as HTMLInputElement).value;
														dispatch(setPenaltySearch(v));
														dispatch(setPenaltyPage(1));
													}}
													className={`max-w-[320px] ${inputStyle} h-10 pl-9`}
													iconLeft={<SearchIcon />}
												/>
											</div>
										)}

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
															<label className="text-xs font-medium text-gray-700 mb-2 block">Items per page</label>
															<Select
																value={tab === "interest" ? String(penaltyLimit) : String(vatLimit)}
																onValueChange={(v) => {
																	if (tab === "interest") {
																		dispatch(setPenaltyLimit(Number(v)));
																		dispatch(setPenaltyPage(1));
																	} else {
																		dispatch(setVatLimit(Number(v)));
																		dispatch(setVatPage(1));
																	}
																}}>
																<SelectTrigger className="w-full h-9">
																	<SelectValue />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="5">5</SelectItem>
																	<SelectItem value="10">10</SelectItem>
																	<SelectItem value="20">20</SelectItem>
																	<SelectItem value="50">50</SelectItem>
																</SelectContent>
															</Select>
														</div>
														<div>
															<label className="text-xs font-medium text-gray-700 mb-2 block">Sort By Field</label>
															<Select
																value={tab === "interest" ? penaltySortBy : vatSortBy}
																onValueChange={(value) => {
																	if (tab === "interest") {
																		dispatch(setPenaltySortBy(value));
																		dispatch(setPenaltyPage(1));
																	} else {
																		dispatch(setVatSortBy(value));
																		dispatch(setVatPage(1));
																	}
																}}>
																<SelectTrigger className="w-full h-9">
																	<SelectValue />
																</SelectTrigger>
																<SelectContent>
																	{tab === "interest" ? (
																		<>
																			<SelectItem value="name">Name</SelectItem>
																			<SelectItem value="price">Price</SelectItem>
																		</>
																	) : (
																		<>
																			<SelectItem value="createdAt">Created At</SelectItem>
																			<SelectItem value="amount">Amount</SelectItem>
																			<SelectItem value="vatAmount">VAT Amount</SelectItem>
																		</>
																	)}
																</SelectContent>
															</Select>
														</div>

														<div>
															<label className="text-xs font-medium text-gray-700 mb-2 block">Sort Order</label>
															<Select
																value={tab === "interest" ? penaltySortOrder : vatSortOrder}
																onValueChange={(value) => {
																	if (tab === "interest") {
																		dispatch(setPenaltySortOrder(value));
																		dispatch(setPenaltyPage(1));
																	} else {
																		dispatch(setVatSortOrder(value));
																		dispatch(setVatPage(1));
																	}
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

														{tab === "vat" && (
															<>
																<div>
																	<CustomInput
																		type="date"
																		label="From"
																		value={vatFromDate ?? ""}
																		onChange={(e) => dispatch(setVatFromDate((e.target as HTMLInputElement).value || null))}
																		className="w-full h-9 text-sm"
																		iconRight={<CalendarIcon />}
																	/>
																</div>
																<div>
																	<CustomInput
																		type="date"
																		label="To"
																		value={vatToDate ?? ""}
																		onChange={(e) => dispatch(setVatToDate((e.target as HTMLInputElement).value || null))}
																		className="w-full h-9 text-sm"
																		iconRight={<CalendarIcon />}
																	/>
																</div>
															</>
														)}
														<div className="pt-2 border-t flex items-center justify-between gap-2">
															<button
																type="button"
																onClick={() => {
																	// reset filters
																	if (tab === "interest") {
																		dispatch(clearPenaltyFilters());
																	} else {
																		dispatch(clearFilters());
																	}
																}}
																className="px-4 py-2 text-sm rounded border border-gray-200 hover:bg-gray-100">
																Reset
															</button>
															<button
																type="button"
																onClick={() => {
																	if (tab === "interest") {
																		dispatch(setPenaltyPage(1));
																	} else {
																		dispatch(setVatPage(1));
																	}
																	dispatch(setIsFilterApplied(true));
																}}
																className="px-4 py-2 bg-primary text-white text-sm rounded">
																Apply
															</button>
														</div>
													</div>
												</DropdownMenuContent>
											</DropdownMenu>
											{isFilterApplied && (
												<button type="button" onClick={handleClearFilter} className={`p-2 rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300`}>
													<IconWrapper>
														<CloseIcon />
													</IconWrapper>
												</button>
											)}
										</div>
									</div>
								</div>

								<div className="mt-6 rounded-md bg-[#F3FBFF] p-4">
									<div className="flex flex-col justify-between">
										<div className="text-sm flex gap-3 items-center flex-wrap text-gray-500">
											<span>{tab === "vat" ? "Total VAT Amount" : "Total Penalties Amount"}</span>
											{tab === "vat" && isFilterApplied && vatFromDate && vatToDate && (
												<span className="text-xs">
													From {vatFromDate} To {vatToDate}
												</span>
											)}
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
											<VATCollected rows={vatRows} page={vatPage} pages={vatTotalPages} onPageChange={(p) => dispatch(setVatPage(p))} />
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
											page={penaltyPage}
											pages={totalPages}
											onPageChange={(p) => dispatch(setPenaltyPage(p))}
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
