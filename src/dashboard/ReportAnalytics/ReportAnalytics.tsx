import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import React from "react";
import { useSearchParams } from "react-router";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { tabListStyle, tabStyle } from "@/components/common/commonStyles";
import { IconWrapper, ExportFileIcon } from "@/assets/icons";
import { useExportInterestPenalties, useExportVATRecords } from "@/api/analytics";
import ExportConfirmModal from "@/components/common/ExportConfirmModal";
import EmptyData from "@/components/common/EmptyData";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import type { FilterField } from "@/components/common/SearchWithFilters";
import VATCollected from "./VATCollected";
import InterestPenalties from "./InterestPenalties";
import { useGetPenalties, useGetVATRecords, useGetIncomeEarned, useGetVatCollected, useGetInterestPenalties } from "@/api/analytics";
import type { PenaltyRecord, VATRecord } from "@/types/reports";
import ActionButton from "@/components/base/ActionButton";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import { TableSkeleton } from "@/components/common/Skeleton";

export default function ReportAnalytics() {
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();

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

	// Initialize URL params on mount and restore Redux state from URL
	React.useEffect(() => {
		const hasParams = searchParams.has("tab") || searchParams.has("vatPage") || searchParams.has("penaltyPage");

		// Get values from URL or use defaults
		const urlTabRaw = searchParams.get("tab") || "vat";
		const urlTab = urlTabRaw === "vat" || urlTabRaw === "interest" ? urlTabRaw : "vat";
		const urlVatPage = parseInt(searchParams.get("vatPage") || "1", 10);
		const urlPenaltyPage = parseInt(searchParams.get("penaltyPage") || "1", 10);
		const urlIncomePeriod = searchParams.get("incomePeriod") || "daily";
		const urlVatPeriod = searchParams.get("vatPeriod") || "daily";
		const urlPenaltyPeriod = searchParams.get("penaltyPeriod") || "daily";
		const urlVatLimit = parseInt(searchParams.get("vatLimit") || "10", 10);
		const urlVatSortBy = searchParams.get("vatSortBy") || "createdAt";
		const urlVatSortOrder = searchParams.get("vatSortOrder") || "desc";
		const urlVatFromDate = searchParams.get("vatFromDate") || null;
		const urlVatToDate = searchParams.get("vatToDate") || null;
		const urlIsFilterApplied = searchParams.has("vatFromDate") || searchParams.has("vatToDate");
		const urlPenaltyLimit = parseInt(searchParams.get("penaltyLimit") || "10", 10);
		const urlPenaltySortBy = searchParams.get("penaltySortBy") || "createdAt";
		const urlPenaltySortOrder = searchParams.get("penaltySortOrder") || "desc";
		const urlPenaltySearch = searchParams.get("penaltySearch") || "";

		// Dispatch to Redux to restore state
		dispatch(setTab(urlTab as "vat" | "interest"));
		dispatch(setVatPage(urlVatPage));
		dispatch(setPenaltyPage(urlPenaltyPage));
		dispatch(setIncomePeriod(urlIncomePeriod));
		dispatch(setVatPeriod(urlVatPeriod));
		dispatch(setPenaltyPeriod(urlPenaltyPeriod));
		dispatch(setVatLimit(urlVatLimit));
		dispatch(setVatSortBy(urlVatSortBy));
		dispatch(setVatSortOrder(urlVatSortOrder as "asc" | "desc"));
		dispatch(setVatFromDate(urlVatFromDate));
		dispatch(setVatToDate(urlVatToDate));
		dispatch(setIsFilterApplied(urlIsFilterApplied));
		dispatch(setPenaltyLimit(urlPenaltyLimit));
		dispatch(setPenaltySortBy(urlPenaltySortBy));
		dispatch(setPenaltySortOrder(urlPenaltySortOrder as "asc" | "desc"));
		dispatch(setPenaltySearch(urlPenaltySearch));

		// If no params exist, set defaults in URL
		if (!hasParams) {
			const params = new URLSearchParams();
			params.set("tab", urlTab);
			params.set("vatPage", String(urlVatPage));
			params.set("penaltyPage", String(urlPenaltyPage));
			params.set("incomePeriod", urlIncomePeriod);
			params.set("vatPeriod", urlVatPeriod);
			params.set("penaltyPeriod", urlPenaltyPeriod);
			params.set("vatLimit", String(urlVatLimit));
			params.set("vatSortBy", urlVatSortBy);
			params.set("vatSortOrder", urlVatSortOrder);
			params.set("penaltyLimit", String(urlPenaltyLimit));
			params.set("penaltySortBy", urlPenaltySortBy);
			params.set("penaltySortOrder", urlPenaltySortOrder);
			setSearchParams(params);
		}
	}, []);

	// Sync tab with URL
	const urlTab = searchParams.get("tab") || "vat";
	React.useEffect(() => {
		if (urlTab !== tab) {
			const params = new URLSearchParams(searchParams);
			params.set("tab", tab);
			setSearchParams(params);
		}
	}, [tab]);

	// Sync pagination with URL
	React.useEffect(() => {
		const params = new URLSearchParams(searchParams);
		params.set("vatPage", String(vatPage));
		params.set("penaltyPage", String(penaltyPage));
		setSearchParams(params);
	}, [vatPage, penaltyPage]);

	// Sync periods with URL
	React.useEffect(() => {
		const params = new URLSearchParams(searchParams);
		params.set("incomePeriod", incomePeriod);
		params.set("vatPeriod", vatPeriod);
		params.set("penaltyPeriod", penaltyPeriod);
		setSearchParams(params);
	}, [incomePeriod, vatPeriod, penaltyPeriod]);

	// Sync VAT filters with URL
	React.useEffect(() => {
		const params = new URLSearchParams(searchParams);
		params.set("vatLimit", String(vatLimit));
		params.set("vatSortBy", vatSortBy);
		params.set("vatSortOrder", vatSortOrder);
		if (vatFromDate) {
			params.set("vatFromDate", vatFromDate);
		} else {
			params.delete("vatFromDate");
		}
		if (vatToDate) {
			params.set("vatToDate", vatToDate);
		} else {
			params.delete("vatToDate");
		}
		setSearchParams(params);
	}, [vatLimit, vatSortBy, vatSortOrder, vatFromDate, vatToDate]);

	// Sync Penalty filters with URL
	React.useEffect(() => {
		const params = new URLSearchParams(searchParams);
		params.set("penaltyLimit", String(penaltyLimit));
		params.set("penaltySortBy", penaltySortBy);
		params.set("penaltySortOrder", penaltySortOrder);
		if (penaltySearch) {
			params.set("penaltySearch", penaltySearch);
		} else {
			params.delete("penaltySearch");
		}
		setSearchParams(params);
	}, [penaltyLimit, penaltySortBy, penaltySortOrder, penaltySearch]);

	const isEmpty = false;
	const [vatExportOpen, setVatExportOpen] = useState(false);
	const [penaltyExportOpen, setPenaltyExportOpen] = useState(false);

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
		tab === "vat",
	);

	const vatRows: VATRecord[] = vatData?.data || [];
	const vatTotalPages = vatData?.pagination?.totalPages || 1;

	const { data: penaltiesData, isLoading: isPenaltiesLoading } = useGetPenalties(
		penaltyPage,
		penaltyLimit,
		penaltySearch || undefined,
		penaltySortBy,
		penaltySortOrder,
		tab === "interest",
	);

	const penaltyRows: PenaltyRecord[] = penaltiesData?.data || [];
	const totalPages = penaltiesData?.pagination?.totalPages || 1;

	// Hooks for exporting CSV
	const exportVATMutation = useExportVATRecords();
	const exportInterestMutation = useExportInterestPenalties();

	// VAT Export handlers
	const handleVATExportClick = async () => {
		const hasActiveFilters = !!(vatFromDate || vatToDate);
		if (hasActiveFilters) {
			setVatExportOpen(true);
		} else {
			handleVATExportAll();
		}
	};

	const getVATFilterLabels = () => {
		const labels: Record<string, string> = {};
		if (vatFromDate) labels["From"] = vatFromDate;
		if (vatToDate) labels["To"] = vatToDate;
		return labels;
	};

	const handleVATExportFiltered = async () => {
		try {
			const blob = await exportVATMutation.mutateAsync({
				startDate: vatFromDate || undefined,
				endDate: vatToDate || undefined,
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `vat-records-filtered-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("VAT records exported successfully");
			setVatExportOpen(false);
		} catch (err) {
			toast.error(extractErrorMessage(err, "Failed to export VAT records"));
		}
	};

	const handleVATExportAll = async () => {
		try {
			const blob = await exportVATMutation.mutateAsync({});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `vat-records-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("VAT records exported successfully");
			setVatExportOpen(false);
		} catch (err) {
			toast.error(extractErrorMessage(err, "Failed to export VAT records"));
		}
	};

	// Penalty Export handlers
	const handlePenaltyExportClick = async () => {
		const hasActiveFilters = !!penaltySearch;
		if (hasActiveFilters) {
			setPenaltyExportOpen(true);
		} else {
			handlePenaltyExportAll();
		}
	};

	const getPenaltyFilterLabels = () => {
		const labels: Record<string, string> = {};
		if (penaltySearch) labels["Search"] = penaltySearch;
		return labels;
	};

	const handlePenaltyExportFiltered = async () => {
		try {
			const blob = await exportInterestMutation.mutateAsync({
				page: penaltyPage || 1,
				limit: penaltyLimit || 10,
				search: penaltySearch || "",
				sortBy: penaltySortBy || "createdAt",
				sortOrder: penaltySortOrder || "desc",
				period: penaltyPeriod || "daily",
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `interest-penalties-filtered-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("Interest penalties exported successfully");
			setPenaltyExportOpen(false);
		} catch (err) {
			toast.error(extractErrorMessage(err, "Failed to export interest penalties"));
		}
	};

	const handlePenaltyExportAll = async () => {
		try {
			const blob = await exportInterestMutation.mutateAsync({
				page: 1,
				limit: 10,
				search: "",
				sortBy: "createdAt",
				sortOrder: "desc",
				period: penaltyPeriod || "daily",
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `interest-penalties-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("Interest penalties exported successfully");
			setPenaltyExportOpen(false);
		} catch (err) {
			toast.error(extractErrorMessage(err, "Failed to export interest penalties"));
		}
	};

	// Filter fields for VAT tab
	const vatFilterFields: FilterField[] = [
		{
			key: "vatLimit",
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
			key: "vatSortBy",
			label: "Sort By",
			type: "sortBy",
			options: [
				{ value: "createdAt", label: "Created At" },
				{ value: "amount", label: "Amount" },
				{ value: "vatAmount", label: "VAT Amount" },
			],
		},
		{ key: "vatSortOrder", label: "Sort Order", type: "sortOrder" },
		{
			key: "vatFromDate",
			label: "From Date",
			type: "date",
		},
		{
			key: "vatToDate",
			label: "To Date",
			type: "date",
		},
	];

	// Filter fields for Penalty tab
	const penaltyFilterFields: FilterField[] = [
		{
			key: "penaltyLimit",
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
			key: "penaltySortBy",
			label: "Sort By",
			type: "sortBy",
			options: [
				{ value: "name", label: "Name" },
				{ value: "price", label: "Price" },
			],
		},
		{ key: "penaltySortOrder", label: "Sort Order", type: "sortOrder" },
	];

	// Handle VAT filter application
	const handleVATFilterApply = (filters: Record<string, string>) => {
		dispatch(setVatLimit(Number(filters.vatLimit) || vatLimit));
		dispatch(setVatSortBy(filters.vatSortBy || vatSortBy));
		dispatch(setVatSortOrder(filters.vatSortOrder || vatSortOrder));
		dispatch(setVatFromDate(filters.vatFromDate || null));
		dispatch(setVatToDate(filters.vatToDate || null));
		dispatch(setIsFilterApplied(!!(filters.vatFromDate || filters.vatToDate)));
		dispatch(setVatPage(1));
	};

	// Handle VAT filter reset
	const handleVATFilterReset = () => {
		dispatch(clearFilters());
	};

	// Handle Penalty filter application
	const handlePenaltyFilterApply = (filters: Record<string, string>) => {
		dispatch(setPenaltyLimit(Number(filters.penaltyLimit) || penaltyLimit));
		dispatch(setPenaltySortBy(filters.penaltySortBy || penaltySortBy));
		dispatch(setPenaltySortOrder(filters.penaltySortOrder || penaltySortOrder));
		dispatch(setPenaltyPage(1));
	};

	// Handle Penalty filter reset
	const handlePenaltyFilterReset = () => {
		dispatch(clearPenaltyFilters());
	};

	// Dynamic stats data from API
	const stats = [
		{
			id: "income",
			title: "Total Income Earned",
			value: (incomeData?.totalIncomeEarned || 0).toString(),
			currency: "NGN",
			variant: "income" as const,
			loading: isIncomeLoading,
			period: incomePeriod,
			setPeriod: (period: string) => {
				dispatch(setIncomePeriod(period));
				const params = new URLSearchParams(searchParams);
				params.set("incomePeriod", period);
				setSearchParams(params);
			},
		},
		{
			id: "vat",
			title: "Total VAT Collected",
			value: (vatCollectedData?.totalVatCollected || 0).toString(),
			currency: "NGN",
			variant: "income" as const,
			loading: isVatCollectedLoading,
			period: vatPeriod,
			setPeriod: (period: string) => {
				dispatch(setVatPeriod(period));
				const params = new URLSearchParams(searchParams);
				params.set("vatPeriod", period);
				setSearchParams(params);
			},
		},
		{
			id: "interest",
			title: "Total Interest Penalties",
			value: (interestPenaltiesData?.totalInterestPenalties || 0).toString(),
			currency: "NGN",
			variant: "income" as const,
			loading: isInterestPenaltiesLoading,
			period: penaltyPeriod,
			setPeriod: (period: string) => {
				dispatch(setPenaltyPeriod(period));
				const params = new URLSearchParams(searchParams);
				params.set("penaltyPeriod", period);
				setSearchParams(params);
			},
		},
	];

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Report Analytics" description="Overview of financial and operational reports" />
				<div className="flex items-center gap-3">
					{tab === "vat" && (
						<ActionButton
							type="button"
							className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-2"
							onClick={handleVATExportClick}
							disabled={exportVATMutation.isPending}>
							<IconWrapper className="text-base">
								<ExportFileIcon />
							</IconWrapper>
							<span className="text-sm">{exportVATMutation.isPending ? "Exporting..." : "Export"}</span>
						</ActionButton>
					)}
					{tab === "interest" && (
						<ActionButton
							type="button"
							className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-2"
							onClick={handlePenaltyExportClick}
							disabled={exportInterestMutation.isPending}>
							<IconWrapper className="text-base">
								<ExportFileIcon />
							</IconWrapper>
							<span className="text-sm">{exportInterestMutation.isPending ? "Exporting..." : "Export"}</span>
						</ActionButton>
					)}
				</div>
			</div>

			<CustomCard className="flex min-h-96 flex-col gap-y-6 md:p-8">
				{!isEmpty ? (
					<div className="flex flex-col gap-y-6">
						<CustomCard className="p-0 border-0 bg-card">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
										<Tabs value={tab} onValueChange={(v) => dispatch(setTab(v as "vat" | "interest"))}>
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

									<div className="flex items-center justify-end">
										<SearchWithFilters
											search={tab === "interest" ? penaltySearch : ""}
											onSearchChange={(v) => {
												if (tab === "interest") {
													dispatch(setPenaltySearch(v));
													dispatch(setPenaltyPage(1));
												}
											}}
											placeholder={tab === "interest" ? "Search by contract code" : undefined}
											showFilter={true}
											fields={tab === "vat" ? vatFilterFields : penaltyFilterFields}
											initialValues={
												tab === "vat"
													? {
															vatLimit: String(vatLimit),
															vatSortBy: vatSortBy,
															vatSortOrder: vatSortOrder,
															vatFromDate: vatFromDate || "",
															vatToDate: vatToDate || "",
														}
													: {
															penaltyLimit: String(penaltyLimit),
															penaltySortBy: penaltySortBy,
															penaltySortOrder: penaltySortOrder,
														}
											}
											onApply={tab === "vat" ? handleVATFilterApply : handlePenaltyFilterApply}
											onReset={tab === "vat" ? handleVATFilterReset : handlePenaltyFilterReset}
										/>
									</div>
								</div>

								{tab === "vat" && (
									<CustomCard className="mt-6 rounded-md dark:bg-neutral-800 bg-[#F3FBFF] p-4">
										<div className="flex flex-col justify-between">
											<div className="text-sm flex gap-3 items-center flex-wrap">
												<span className=" text-gray-500 dark:text-gray-200">Total VAT Amount</span>
												{isFilterApplied && vatFromDate && vatToDate && (
													<span className="text-xs">
														From {vatFromDate} To {vatToDate}
													</span>
												)}
											</div>
											<div className="mt-3 text-2xl font-medium">NGN {(vatData?.totals?.totalVatAmount || 0).toLocaleString()}</div>
										</div>
									</CustomCard>
								)}

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

				{/* Export Modals */}
				<ExportConfirmModal
					open={vatExportOpen}
					onOpenChange={setVatExportOpen}
					filterLabels={getVATFilterLabels()}
					onExportFiltered={handleVATExportFiltered}
					onExportAll={handleVATExportAll}
					isLoading={exportVATMutation.isPending}
				/>

				<ExportConfirmModal
					open={penaltyExportOpen}
					onOpenChange={setPenaltyExportOpen}
					filterLabels={getPenaltyFilterLabels()}
					onExportFiltered={handlePenaltyExportFiltered}
					onExportAll={handlePenaltyExportAll}
					isLoading={exportInterestMutation.isPending}
				/>
			</CustomCard>
		</div>
	);
}
