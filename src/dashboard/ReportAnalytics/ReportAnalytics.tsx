import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
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
			value: (incomeData?.totalIncomeEarned || 0).toFixed(2),
			currency: "NGN",
			variant: "income" as const,
			loading: isIncomeLoading,
			period: incomePeriod,
			setPeriod: (period: string) => dispatch(setIncomePeriod(period)),
		},
		{
			id: "vat",
			title: "Total VAT Collected",
			value: (vatCollectedData?.totalVatCollected || 0).toFixed(2),
			currency: "NGN",
			variant: "income" as const,
			loading: isVatCollectedLoading,
			period: vatPeriod,
			setPeriod: (period: string) => dispatch(setVatPeriod(period)),
		},
		{
			id: "interest",
			title: "Total Interest Penalties",
			value: (interestPenaltiesData?.totalInterestPenalties || 0).toFixed(2),
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

								{/* <div className="mt-6 rounded-md bg-[#F3FBFF] p-4"> */}
								{/* <div className="flex flex-col justify-between">
										<div className="text-sm flex gap-3 items-center flex-wrap text-gray-500">
											<span>{tab === "vat" ? "Total VAT Amount" : "Total Penalties Amount"}</span>
											{tab === "vat" && isFilterApplied && vatFromDate && vatToDate && (
												<span className="text-xs">
													From {vatFromDate} To {vatToDate}
												</span>
											)}
										</div>
										<div className="mt-3 text-2xl font-medium">NGN 50,000,000</div>
									</div> */}
								{/* </div> */}

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
