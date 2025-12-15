import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/base/Badge";
import PageTitles from "@/components/common/PageTitles";
import { tableHeaderRowStyle } from "@/components/common/commonStyles";
import CompactPagination from "@/components/ui/compact-pagination";
import EmptyData from "@/components/common/EmptyData";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import type { FilterField } from "@/components/common/SearchWithFilters";
import { useGetAllDuePayments, useExportDuePayments } from "@/api/duePayment";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import { TableSkeleton } from "@/components/common/Skeleton";
import CsvExportModal from "@/components/common/CsvExportModal";
import type { CsvField } from "@/components/common/CsvExportModal";
import { ExportFileIcon, IconWrapper } from "@/assets/icons";
import { twMerge } from "tailwind-merge";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setPage, setSearch, setCsvModalOpen, applyFilters, resetFilters } from "@/store/duePaymentSlice";

export default function Payments() {
	const dispatch = useDispatch();
	const { page, search, csvModalOpen, sortBy, sortOrder, dueDateFrom, dueDateTo, dateFrom, dateTo, isOverdue, statusId } = useSelector(
		(state: RootState) => state.duePayment
	);

	const debouncedSearch = useDebounceSearch(search, 400);

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
		dispatch(
			applyFilters({
				dueDateFrom: filters.dueDateFrom || "",
				dueDateTo: filters.dueDateTo || "",
				dateFrom: filters.dateFrom || "",
				dateTo: filters.dateTo || "",
				isOverdue: filters.isOverdue ? filters.isOverdue === "true" : undefined,
				statusId: filters.statusId ? Number(filters.statusId) : undefined,
				sortBy: filters.sortBy || "dueDate",
				sortOrder: filters.sortOrder || "asc",
			})
		);
	};

	const handleFilterReset = () => {
		dispatch(resetFilters());
	};

	const duePaymentCsvFields: CsvField[] = [
		{ key: "dueDateFrom", label: "Payment Due From", type: "date", placeholder: "01-01-2025" },
		{ key: "dueDateTo", label: "Payment Due To", type: "date", placeholder: "31-12-2025" },
		{ key: "dateFrom", label: "Reminder Sent From", type: "date", placeholder: "01-01-2025" },
		{ key: "dateTo", label: "Reminder Sent To", type: "date", placeholder: "31-12-2025" },
		{ key: "contractCode", label: "Contract Code", type: "text", placeholder: "Contract code" },
		{ key: "customerName", label: "Customer Name", type: "text", placeholder: "John Doe" },
		{ key: "customerEmail", label: "Customer Email", type: "text", placeholder: "john@example.com" },
		{
			key: "isOverdue",
			label: "Status",
			type: "select",
			options: [
				{ value: "true", label: "Overdue" },
				{ value: "false", label: "Current" },
			],
		},
		{
			key: "statusId",
			label: "Payment Status",
			type: "text",
			placeholder: "Status ID",
		},
	];

	const handleCsvExport = async (formData: Record<string, string>) => {
		try {
			const blob = await exportMutation.mutateAsync({
				dueDateFrom: formData.dueDateFrom || undefined,
				dueDateTo: formData.dueDateTo || undefined,
				dateFrom: formData.dateFrom || undefined,
				dateTo: formData.dateTo || undefined,
				contractCode: formData.contractCode || undefined,
				customerName: formData.customerName || undefined,
				customerEmail: formData.customerEmail || undefined,
				isOverdue: formData.isOverdue ? formData.isOverdue === "true" : undefined,
				statusId: formData.statusId ? Number(formData.statusId) : undefined,
			});
			const url = URL.createObjectURL(blob);
			return {
				success: true,
				downloadUrl: url,
			};
		} catch (err) {
			console.error("Failed to export due payments:", err);
			return {
				success: false,
				message: "Failed to export due payments",
			};
		}
	};

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Due Payments" description="The list of all paid debt and pending payment" />
				<div className="flex items-center gap-3">
					<CsvExportModal
						open={csvModalOpen}
						onOpenChange={(open) => dispatch(setCsvModalOpen(open))}
						title="Export Due Payments As CSV"
						subtitle="Filter due payments by date range, customer, or status"
						fields={duePaymentCsvFields}
						onExport={handleCsvExport}
						downloadFileName={`due-payments-${new Date().toISOString().slice(0, 10)}.csv`}
						triggerButton={
							<button className={twMerge("flex items-center gap-2 underline-offset-[4px] underline")}>
								<IconWrapper>
									<ExportFileIcon />
								</IconWrapper>
								<span>Export</span>
							</button>
						}
					/>
				</div>
			</div>

			<CustomCard>
				<div className="flex items-center justify-end">
					<SearchWithFilters
						search={search}
						onSearchChange={(v) => {
							dispatch(setSearch(v));
							dispatch(setPage(1));
						}}
						setPage={(newPage) => dispatch(setPage(newPage))}
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
									<CompactPagination page={page} pages={pages} onPageChange={(newPage) => dispatch(setPage(newPage))} />
								</div>
							</div>
						</CustomCard>
					)}
				</div>
			</CustomCard>
		</div>
	);
}
