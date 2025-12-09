import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/base/Badge";
import PageTitles from "@/components/common/PageTitles";
import { tableHeaderRowStyle } from "@/components/common/commonStyles";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import EmptyData from "@/components/common/EmptyData";
import ExportTrigger from "../../components/common/ExportTrigger";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import type { FilterField } from "@/components/common/SearchWithFilters";
import { useGetAllDuePayments, useExportDuePayments } from "@/api/duePayment";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { TableSkeleton } from "@/components/common/Skeleton";

export default function Payments() {
	const [page, setPage] = React.useState(1);
	const [search, setSearch] = React.useState<string>("");
	const debouncedSearch = useDebounceSearch(search, 400);
	const [sortBy, setSortBy] = React.useState<string>("dueDate");
	const [sortOrder, setSortOrder] = React.useState<string>("asc");
	const [dueDateFrom, setDueDateFrom] = React.useState<string>("");
	const [dueDateTo, setDueDateTo] = React.useState<string>("");
	const [dateFrom, setDateFrom] = React.useState<string>("");
	const [dateTo, setDateTo] = React.useState<string>("");
	const [isOverdue, setIsOverdue] = React.useState<boolean | undefined>(undefined);
	const [statusId, setStatusId] = React.useState<number | undefined>(undefined);

	const { data: paymentsData = {}, isLoading } = useGetAllDuePayments(
		page,
		10,
		sortBy,
		sortOrder,
		dueDateFrom || undefined,
		dueDateTo || undefined,
		dateFrom || undefined,
		dateTo || undefined,
		debouncedSearch || undefined,
		debouncedSearch || undefined,
		debouncedSearch || undefined,
		isOverdue,
		statusId
	);

	const paymentsTyped = paymentsData as Record<string, unknown> | undefined;
	const paymentsList = Array.isArray(paymentsTyped?.data) ? (paymentsTyped?.data as unknown[]) : [];
	const paginationData = paymentsTyped?.pagination as Record<string, unknown> | undefined;
	const pages = Math.max(1, (paginationData?.totalPages as number) ?? 1);
	const isEmpty = !isLoading && paymentsList.length === 0;
	const exportMutation = useExportDuePayments();

	const filterFields: FilterField[] = [
		{
			key: "dueDateFrom",
			label: "Due Date From",
			type: "date",
		},
		{
			key: "dueDateTo",
			label: "Due Date To",
			type: "date",
		},
		{
			key: "dateFrom",
			label: "Reminder Date From",
			type: "date",
		},
		{
			key: "dateTo",
			label: "Reminder Date To",
			type: "date",
		},
		{
			key: "isOverdue",
			label: "Overdue Status",
			type: "boolean",
		},
		{
			key: "statusId",
			label: "Payment Status",
			type: "select",
			options: [
				{ value: "1", label: "Pending" },
				{ value: "2", label: "Paid" },
				{ value: "3", label: "Failed" },
			],
		},
		{
			key: "sortBy",
			label: "Sort By",
			type: "sortBy",
			options: [
				{ value: "sentAt", label: "Sent Date" },
				{ value: "dueDate", label: "Due Date" },
				{ value: "customerName", label: "Customer Name" },
				{ value: "contractCode", label: "Contract Code" },
				{ value: "totalDue", label: "Total Due" },
			],
		},
		{ key: "sortOrder", label: "Sort Order", type: "sortOrder" },
	];

	const handleFilterApply = (filters: Record<string, string>) => {
		setDueDateFrom(filters.dueDateFrom || "");
		setDueDateTo(filters.dueDateTo || "");
		setDateFrom(filters.dateFrom || "");
		setDateTo(filters.dateTo || "");
		setIsOverdue(filters.isOverdue ? filters.isOverdue === "true" : undefined);
		setStatusId(filters.statusId ? Number(filters.statusId) : undefined);
		setSortBy(filters.sortBy || "dueDate");
		setSortOrder(filters.sortOrder || "asc");
		setPage(1);
	};

	const handleFilterReset = () => {
		setDueDateFrom("");
		setDueDateTo("");
		setDateFrom("");
		setDateTo("");
		setIsOverdue(undefined);
		setStatusId(undefined);
		setSortBy("dueDate");
		setSortOrder("asc");
		setSearch("");
		setPage(1);
	};

	const handleExport = async (format: "csv" | "pdf") => {
		if (format === "csv") {
			try {
				const blob = await exportMutation.mutateAsync({
					dueDateFrom: dueDateFrom || undefined,
					dueDateTo: dueDateTo || undefined,
					dateFrom: dateFrom || undefined,
					dateTo: dateTo || undefined,
					contractCode: debouncedSearch || undefined,
					customerName: debouncedSearch || undefined,
					customerEmail: debouncedSearch || undefined,
					isOverdue: isOverdue,
					statusId: statusId,
				});
				const fileName = `due-payments-${new Date().toISOString().slice(0, 10)}.csv`;
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = fileName;
				document.body.appendChild(link);
				link.click();
				link.remove();
				URL.revokeObjectURL(url);
			} catch (err) {
				console.error("Failed to export due payments:", err);
			}
		}
	};

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Due Payments" description="The list of all paid debt and pending payment" />
				<div className="flex items-center gap-3">
					<ExportTrigger title="Export" onSelect={handleExport} />
				</div>
			</div>

			<CustomCard>
				<div className="flex items-center justify-end">
					<SearchWithFilters
						search={search}
						onSearchChange={(v) => {
							setSearch(v);
							setPage(1);
						}}
						setPage={setPage}
						placeholder="Search by contract code, customer name, or email"
						showFilter={true}
						fields={filterFields}
						initialValues={{
							dueDateFrom,
							dueDateTo,
							dateFrom,
							dateTo,
							isOverdue: isOverdue !== undefined ? String(isOverdue) : "",
							statusId: statusId !== undefined ? String(statusId) : "",
							sortBy: sortBy || "",
							sortOrder: sortOrder || "",
						}}
						onApply={handleFilterApply}
						onReset={handleFilterReset}
					/>
				</div>
				<div className="min-h-96 flex flex-col">
					{isLoading ? (
						<TableSkeleton rows={10} cols={9} />
					) : isEmpty ? (
						<EmptyData text="No due payments at the moment" />
					) : (
						<CustomCard className="p-0 mt-5 border-0 h-full flex-grow w-full flex flex-col  gap-y-8">
							<div className="w-full">
								<div className="overflow-x-auto w-full">
									<Table>
										<TableHeader className={tableHeaderRowStyle}>
											<TableRow className="bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
												<TableHead>Contract Code</TableHead>
												<TableHead>Customer Name</TableHead>
												<TableHead>Email</TableHead>
												<TableHead>Property</TableHead>
												<TableHead>Amount</TableHead>
												<TableHead>Late Fees</TableHead>
												<TableHead>Total Due</TableHead>
												<TableHead>Due Date</TableHead>
												<TableHead>Status</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{paymentsList.map((payment: unknown, idx: number) => {
												const p = payment as Record<string, unknown>;
												const dueDate = new Date(p.dueDate as string).toLocaleDateString();
												const isOverdueStatus = p.isOverdue as boolean;
												const statusObj = p.status as Record<string, unknown> | undefined;
												const statusStr = statusObj?.status as string | undefined;

												return (
													<TableRow key={(p.id as string) || idx} className="hover:bg-[#F6FBFF]">
														<TableCell className="text-[#13121266] py-4">{p.contractCode as string}</TableCell>
														<TableCell className="text-[#13121266] py-4">{p.customerName as string}</TableCell>
														<TableCell className="text-[#13121266] py-4">{p.customerEmail as string}</TableCell>
														<TableCell className="text-[#13121266] py-4">{p.propertyName as string}</TableCell>
														<TableCell className="text-[#13121266] py-4">₦{p.amount as string}</TableCell>
														<TableCell className="text-[#13121266] py-4">₦{p.lateFees as string}</TableCell>
														<TableCell className="text-[#13121266] py-4 font-medium">₦{p.totalDue as string}</TableCell>
														<TableCell className="text-[#13121266] py-4">{dueDate}</TableCell>
														<TableCell className="text-[#13121266] py-4">
															<Badge
																value={isOverdueStatus ? "Overdue" : statusStr || "Unknown"}
																status={isOverdueStatus ? "banned" : undefined}
																size="sm"
															/>
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
							</div>

							<div className="mt-auto flex flex-col md:flex-row text-center md:text-start justify-center items-center">
								<span className="text-sm text-nowrap">
									Showing <span className="font-medium">{(page - 1) * 10 + 1}</span>-
									<span className="font-medium">{Math.min(page * 10, (paginationData?.totalCount as number) || 0)}</span> of{" "}
									<span className="font-medium">{(paginationData?.totalCount as number) || 0}</span> results
								</span>
								<div className="ml-auto">
									<CompactPagination page={page} pages={pages} onPageChange={setPage} />
								</div>
							</div>
						</CustomCard>
					)}
				</div>
			</CustomCard>
		</div>
	);
}
