import { useState } from "react";
import CompactPagination from "@/components/ui/compact-pagination";
import EmptyData from "@/components/common/EmptyData";
import CustomCard from "@/components/base/CustomCard";
import { useGetAuditLogsGrouped, useExportAuditLogs } from "@/api/analytics";
import PageTitles from "@/components/common/PageTitles";
import ExportTrigger from "@/components/common/ExportTrigger";
import { CardSkeleton } from "@/components/common/Skeleton";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import type { FilterField } from "@/components/common/SearchWithFilters";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";

export default function AuditCompliance() {
	const [page, setPage] = useState(1);
	const pageSize = 10;
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");

	const debouncedSearch = useDebounceSearch(searchQuery, 400);

	// Fetch grouped audit logs
	const { data: auditData, isLoading } = useGetAuditLogsGrouped(page, pageSize, debouncedSearch || undefined);

	const auditDataTyped = auditData as Record<string, unknown> | undefined;
	const groups = Array.isArray(auditDataTyped?.data) ? (auditDataTyped?.data as unknown[]) : [];
	const paginationData = auditDataTyped?.pagination as Record<string, unknown> | undefined;
	const pagination = { total: (paginationData?.total as number) ?? 0, totalPages: (paginationData?.totalPages as number) ?? 1 };
	const isEmpty = !isLoading && groups.length === 0;

	const exportMutation = useExportAuditLogs();

	const handleExport = async (format: "csv" | "pdf") => {
		if (format === "csv") {
			try {
				const blob = await exportMutation.mutateAsync({
					search: debouncedSearch || undefined,
					startDate: startDate || undefined,
					endDate: endDate || undefined,
				});
				// Create a download link and trigger
				const fileName = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = fileName;
				document.body.appendChild(link);
				link.click();
				link.remove();
				URL.revokeObjectURL(url);
			} catch (err) {
				console.error("Failed to export audit logs:", err);
			}
		}
		// TODO: implement PDF export when endpoint is available
	};

	const filterFields: FilterField[] = [
		{
			key: "startDate",
			label: "Start Date",
			type: "date",
		},
		{
			key: "endDate",
			label: "End Date",
			type: "date",
		},
	];

	const handleFilterApply = (filters: Record<string, string>) => {
		setStartDate(filters.startDate || "");
		setEndDate(filters.endDate || "");
		setPage(1);
	};

	const handleFilterReset = () => {
		setStartDate("");
		setEndDate("");
		setPage(1);
	};

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Audit & Compliance" description="This Contains all activities done indicating who performed the action" />
				<div className="flex items-center gap-3">
					<ExportTrigger title="Export" onSelect={handleExport} />
				</div>
			</div>

			<SearchWithFilters
				search={searchQuery}
				onSearchChange={setSearchQuery}
				setPage={setPage}
				placeholder="Search by staff name, email, or action"
				showFilter={true}
				fields={filterFields}
				initialValues={{
					startDate,
					endDate,
				}}
				onApply={handleFilterApply}
				onReset={handleFilterReset}
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
								<CompactPagination page={page} pages={pagination.totalPages} onPageChange={setPage} />
							</div>
						</div>
					</CustomCard>
				)}
			</div>
		</div>
	);
}

function RowItem({ action, staffName, date, time }: { action: string; staffName: string; date: string; time: string }) {
	return (
		<div className="rounded-lg bg-white p-5 border border-gray-100 flex items-start justify-between">
			<div>
				<h4 className="font-medium">{action}</h4>
				<p className="text-sm text-muted-foreground mt-2">Staff Name: {staffName}</p>
			</div>
			<div className="text-right text-sm text-muted-foreground">
				<div>{date}</div>
				<div>{time}</div>
			</div>
		</div>
	);
}
