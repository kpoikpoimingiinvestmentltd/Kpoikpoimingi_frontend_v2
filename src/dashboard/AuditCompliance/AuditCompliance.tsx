import { useState } from "react";
import React from "react";
import CompactPagination from "@/components/ui/compact-pagination";
import EmptyData from "@/components/common/EmptyData";
import CustomCard from "@/components/base/CustomCard";
import { useGetAuditLogsGrouped, useExportAuditLogs } from "@/api/analytics";
import PageTitles from "@/components/common/PageTitles";
import { CardSkeleton } from "@/components/common/Skeleton";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import type { FilterField } from "@/components/common/SearchWithFilters";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import ExportConfirmModal from "@/components/common/ExportConfirmModal";
import ActionButton from "@/components/base/ActionButton";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import { ExportFileIcon, IconWrapper } from "../../assets/icons";
import { useSearchParams } from "react-router";

export default function AuditCompliance() {
	const [searchParams, setSearchParams] = useSearchParams();

	const page = Number(searchParams.get("page")) || 1;
	const pageSize = 10;
	const search = searchParams.get("search") || "";
	const sortBy = searchParams.get("sortBy") || "createdAt";
	const sortOrder = searchParams.get("sortOrder") || "desc";

	// Initialize URL params on mount if not present
	React.useEffect(() => {
		const hasParams = searchParams.has("page") || searchParams.has("search") || searchParams.has("sortBy") || searchParams.has("sortOrder");
		if (!hasParams) {
			const params = new URLSearchParams();
			params.set("page", "1");
			params.set("sortBy", "createdAt");
			params.set("sortOrder", "desc");
			setSearchParams(params);
		}
	}, []);

	const debouncedSearch = useDebounceSearch(search, 400);
	const [showExportModal, setShowExportModal] = useState(false);

	const updateSearchParams = React.useCallback(
		(updates: Record<string, string | number | null>) => {
			const params = new URLSearchParams(searchParams);
			Object.entries(updates).forEach(([key, value]) => {
				if (value === null) {
					params.delete(key);
				} else {
					params.set(key, String(value));
				}
			});
			setSearchParams(params);
		},
		[searchParams, setSearchParams]
	);

	const { data: auditData, isLoading } = useGetAuditLogsGrouped(page, pageSize, debouncedSearch || undefined, sortBy, sortOrder);

	const auditDataTyped = auditData as Record<string, unknown> | undefined;
	const groups = Array.isArray(auditDataTyped?.data) ? (auditDataTyped?.data as unknown[]) : [];
	const paginationData = auditDataTyped?.pagination as Record<string, unknown> | undefined;
	const pagination = { total: (paginationData?.total as number) ?? 0, totalPages: (paginationData?.totalPages as number) ?? 1 };
	const isEmpty = !isLoading && groups.length === 0;

	const exportMutation = useExportAuditLogs();

	const filterFields: FilterField[] = [
		{
			key: "sortBy",
			label: "Sort by field",
			type: "sortBy",
			options: [
				{ value: "name", label: "name" },
				{ value: "price", label: "price" },
				{ value: "createdAt", label: "createdAt" },
				{ value: "updatedAt", label: "updatedAt" },
			],
		},
		{ key: "sortOrder", label: "Sort order", type: "sortOrder" },
	];

	const handleFilterApply = (newFilters: Record<string, string>) => {
		updateSearchParams({
			sortBy: newFilters.sortBy || null,
			sortOrder: newFilters.sortOrder || null,
			page: 1,
		});
	};

	const handleSearchChange = (value: string) => {
		updateSearchParams({ search: value || null, page: 1 });
	};

	const handlePageChange = (newPage: number) => {
		updateSearchParams({ page: newPage });
	};

	const hasActiveFilters = !!(debouncedSearch || sortBy !== "createdAt" || sortOrder !== "desc");

	const getFilterLabels = () => {
		const labels: Record<string, string> = {};
		if (sortBy && sortBy !== "createdAt") labels["Sort By"] = sortBy;
		if (sortOrder && sortOrder !== "desc") labels["Sort Order"] = sortOrder;
		return labels;
	};

	const handleExportClick = () => {
		if (hasActiveFilters) {
			setShowExportModal(true);
		} else {
			handleExportAll();
		}
	};

	const handleExportFiltered = async () => {
		try {
			const blob = await exportMutation.mutateAsync({
				search: debouncedSearch || undefined,
			});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `audit-logs-filtered-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("Audit logs exported successfully");
			setShowExportModal(false);
		} catch (err) {
			toast.error(extractErrorMessage(err, "Failed to export audit logs"));
		}
	};

	const handleExportAll = async () => {
		try {
			const blob = await exportMutation.mutateAsync({});
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("Audit logs exported successfully");
			setShowExportModal(false);
		} catch (err) {
			toast.error(extractErrorMessage(err, "Failed to export audit logs"));
		}
	};

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Audit & Compliance" description="This Contains all activities done indicating who performed the action" />
				<ActionButton
					type="button"
					className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-2"
					onClick={handleExportClick}
					disabled={exportMutation.isPending}>
					<IconWrapper className="text-base">
						<ExportFileIcon />
					</IconWrapper>
					<span className="text-sm">{exportMutation.isPending ? "Exporting..." : "Export"}</span>
				</ActionButton>
			</div>

			<div className="flex items-center gap-2">
				<SearchWithFilters
					search={search}
					onSearchChange={handleSearchChange}
					setPage={handlePageChange}
					placeholder="Search by staff name, email, or action"
					showFilter={true}
					fields={filterFields}
					initialValues={{ sortBy: sortBy || "", sortOrder: sortOrder || "" }}
					onApply={handleFilterApply}
					onReset={() => {
						handleSearchChange("");
						updateSearchParams({ sortBy: null, sortOrder: null, page: 1 });
					}}
				/>
			</div>

			<ExportConfirmModal
				open={showExportModal}
				onOpenChange={setShowExportModal}
				searchTerm={debouncedSearch}
				filterLabels={getFilterLabels()}
				onExportFiltered={handleExportFiltered}
				onExportAll={handleExportAll}
				isLoading={exportMutation.isPending}
			/>

			<div className="min-h-96 flex">
				{isLoading ? (
					<CustomCard className="bg-transparent p-0 border-0 w-full">
						<div className="flex flex-col gap-y-4">
							<CardSkeleton lines={3} />
							<CardSkeleton lines={3} />
							<CardSkeleton lines={3} />
						</div>
					</CustomCard>
				) : isEmpty ? (
					<EmptyData text="No Audit Records at the moment" />
				) : (
					<CustomCard className="bg-transparent p-0 border-0 w-full">
						<div className="flex flex-col gap-y-6">
							{groups.map((group: unknown) => {
								const g = group as Record<string, unknown>;
								return (
									<section key={g.title as string}>
										<h3 className="text-sm font-medium mb-2 text-[#111827]">{g.title as string}</h3>
										<div className="flex flex-col gap-y-4">
											{Array.isArray(g.logs) &&
												g.logs.map((log: unknown) => {
													const l = log as Record<string, unknown>;
													return (
														<RowItem
															key={l.id as string}
															action={l.action as string}
															staffName={l.staffName as string}
															date={l.date as string}
															time={l.time as string}
														/>
													);
												})}
										</div>
									</section>
								);
							})}
						</div>
						<div className="mt-10">
							<div className="ml-auto">
								<CompactPagination page={page} pages={pagination.totalPages} onPageChange={handlePageChange} />
							</div>
						</div>
					</CustomCard>
				)}
			</div>
		</div>
	);
}

function RowItem({ action, staffName, date, time }: { action: string; staffName: string; date: string; time: string }) {
	const formatDate = (dateStr: string) => {
		try {
			const parts = dateStr.split("/");
			const day = parseInt(parts[0]);
			const month = parseInt(parts[1]) - 1; // months are 0-indexed
			const year = parseInt(parts[2]);
			const dateObj = new Date(year, month, day);

			const shortFormat = dateStr;

			const longFormat = dateObj.toLocaleDateString("en-US", {
				day: "numeric",
				month: "long",
				year: "numeric",
			});

			return { shortFormat, longFormat };
		} catch {
			return { shortFormat: dateStr, longFormat: dateStr };
		}
	};

	const formatTime = (timeStr: string) => {
		try {
			// Parse time string like "19:41"
			const [hours, minutes] = timeStr.split(":").map(Number);
			const period = hours >= 12 ? "PM" : "AM";
			const hours12 = hours % 12 || 12;
			return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
		} catch {
			return timeStr;
		}
	};

	const { shortFormat, longFormat } = formatDate(date);
	const time12 = formatTime(time);

	return (
		<div className="rounded-lg bg-white p-5 gap-6 border border-gray-100 flex items-start justify-between">
			<div>
				<h4 className="font-medium">{action}</h4>
				<p className="text-sm text-muted-foreground mt-2">Staff Name: {staffName || "N/A"}</p>
			</div>
			<div className="text-right text-sm text-muted-foreground">
				<div className="md:hidden">{shortFormat}</div>
				<div className="hidden md:block">{longFormat}</div>
				<div>{time12}</div>
			</div>
		</div>
	);
}
