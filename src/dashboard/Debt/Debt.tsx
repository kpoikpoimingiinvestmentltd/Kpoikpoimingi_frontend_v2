import ExportTrigger from "../../components/common/ExportTrigger";
import PageTitles from "../../components/common/PageTitles";
import Image from "../../components/base/Image";
import { media } from "../../resources/images";
import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { tableHeaderRowStyle } from "@/components/common/commonStyles";
import CompactPagination from "@/components/ui/compact-pagination";
import { EyeIcon, IconWrapper } from "@/assets/icons";
import { Link } from "react-router";
import { _router } from "@/routes/_router";
import React from "react";
import PageWrapper from "../../components/common/PageWrapper";
import { useGetAllContractDebts, useExportAllContractDebts } from "@/api/contracts";
import { TableSkeleton } from "@/components/common/Skeleton";
import { twMerge } from "tailwind-merge";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import type { FilterField } from "@/components/common/SearchWithFilters";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";

export default function Debt() {
	const [page, setPage] = React.useState(1);
	const [limit, setLimit] = React.useState<number>(10);
	const [searchQuery, setSearchQuery] = React.useState<string>("");
	const debouncedSearch = useDebounceSearch(searchQuery, 400);
	const [sortBy, setSortBy] = React.useState<string>("createdAt");
	const [sortOrder, setSortOrder] = React.useState<string>("desc");

	const { data: debtData = {} as Record<string, unknown>, isLoading } = useGetAllContractDebts(
		page,
		limit,
		debouncedSearch || undefined,
		sortBy,
		sortOrder
	);

	const exportMutation = useExportAllContractDebts();

	const handleExport = async (format: "csv" | "pdf") => {
		if (format === "csv") {
			try {
				const blob = await exportMutation.mutateAsync({ search: debouncedSearch || "" });
				// Create a download link and trigger
				const fileName = `contract-debts-${new Date().toISOString().slice(0, 10)}.csv`;
				const url = URL.createObjectURL(blob);
				const link = document.createElement("a");
				link.href = url;
				link.download = fileName;
				document.body.appendChild(link);
				link.click();
				link.remove();
				URL.revokeObjectURL(url);
			} catch (err) {
				// Optionally report the error, kept simple for now
				console.error("Failed to export debts:", err);
			}
		}
		// TODO: implement PDF export when endpoint is available
	};

	const debtorsData = (debtData.data as unknown[]) || [];
	const debtors = debtorsData.map((d: unknown) => {
		const debt = d as Record<string, unknown>;
		return {
			id: debt.contractId,
			contractCode: debt.contractCode,
			customerName: debt.customerName,
			propertyName: debt.propertyName,
			amountPaid: debt.amountPaid,
			totalDebt: debt.totalDebtAmount,
			date: new Date(debt.date as string).toLocaleDateString(),
			isOverdue: debt.isOverdue,
		};
	});

	const summary = (debtData.summary as unknown as Record<string, unknown>) ?? {
		totalCustomersOwing: 0,
		totalContracts: 0,
		totalDebtAmount: 0,
		totalAmountPaid: 0,
		totalOverdueContracts: 0,
	};

	const paginationData = (debtData.pagination as Record<string, unknown>) || {};
	const pages = Math.max(1, (paginationData.totalPages as number) ?? 1);
	const total = (paginationData.total as number) ?? 0;

	return (
		<PageWrapper>
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Debt" description="This contains all customers owing for product they signed to buy on installment" />
				<div className="flex items-center gap-3">
					<ExportTrigger title="Export" onSelect={handleExport} />
				</div>
			</div>

			<div className="grid grid-cols-2 bg-white rounded-lg overflow-hidden items-center">
				<div className="bg-[#03b5ff] h-full text-white rounded-r-full py-6 px-6 flex-1 mr-4 flex items-center justify-between">
					<div className="flex flex-col h-full justify-between">
						<div className="text-[.9rem] opacity-90">Total Debt</div>
						<div className="mt-2 text-lg font-medium">
							NGN <span className="text-3xl">{(summary.totalDebtAmount || 0).toLocaleString()}</span>
						</div>
					</div>
				</div>
				<aside className="items-end p-4 h-full flex justify-end">
					<Image src={media.images.coin} alt="coin" className="w-28 md:mr-10" />
				</aside>
			</div>

			{/* Debtors table */}
			<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
				<div className="w-full">
					<div className="flex items-center justify-between mb-4">
						<h2 className="font-semibold">All Debtors ( Customers Owning )</h2>
						<div className="flex items-center gap-2">
							<SearchWithFilters
								search={searchQuery}
								onSearchChange={(v) => {
									setSearchQuery(v);
									setPage(1);
								}}
								setPage={setPage}
								placeholder="Search by contract code, customer name, or property name"
								fields={
									[
										{
											key: "limit",
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
											key: "sortBy",
											label: "Sort By",
											type: "sortBy",
											options: [
												{ value: "name", label: "name" },
												{ value: "price", label: "price" },
												{ value: "createdAt", label: "createdAt" },
												{ value: "updatedAt", label: "updatedAt" },
											],
										},
										{ key: "sortOrder", label: "Sort Order", type: "sortOrder" },
									] as FilterField[]
								}
								initialValues={{ limit: String(limit), sortBy: sortBy || "", sortOrder: sortOrder || "" }}
								onApply={(filters) => {
									setLimit(filters.limit ? Number(filters.limit) : 10);
									setSortBy(filters.sortBy || "createdAt");
									setSortOrder(filters.sortOrder || "desc");
									setPage(1);
								}}
								onReset={() => {
									setSearchQuery("");
									setLimit(10);
									setSortBy("createdAt");
									setSortOrder("desc");
									setPage(1);
								}}
							/>
						</div>
					</div>

					<div className="overflow-x-auto w-full mt-8">
						{isLoading ? (
							<TableSkeleton rows={10} />
						) : debtors.length > 0 ? (
							<>
								<Table>
									<TableHeader className={tableHeaderRowStyle}>
										<TableRow className="bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
											<TableHead>Contract Code</TableHead>
											<TableHead>Customer Name</TableHead>
											<TableHead>Property Name</TableHead>
											<TableHead>Amount Paid</TableHead>
											<TableHead>Total Debt Amount</TableHead>
											<TableHead>Date</TableHead>
											<TableHead>Status</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{debtors.map((r: unknown, i: number) => {
											const row = r as Record<string, unknown>;
											return (
												<TableRow key={i}>
													<TableCell className="text-[#13121266]">{row.contractCode as string}</TableCell>
													<TableCell className="text-[#13121266]">{row.customerName as string}</TableCell>
													<TableCell className="text-[#13121266]">{row.propertyName as string}</TableCell>
													<TableCell className="text-[#13121266]">NGN {((row.amountPaid as number) || 0).toLocaleString()}</TableCell>
													<TableCell className="text-[#13121266]">NGN {((row.totalDebt as number) || 0).toLocaleString()}</TableCell>
													<TableCell className="text-[#13121266]">{row.date as string}</TableCell>
													<TableCell>
														<span
															className={twMerge(
																"px-3 py-1 rounded-full text-xs font-medium",
																(row.isOverdue as boolean) ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
															)}>
															{(row.isOverdue as boolean) ? "Overdue" : "Current"}
														</span>
													</TableCell>
													<TableCell className="text-right">
														<Link to={_router.dashboard.debtDetails.replace(":id", row.id as string)} className="p-2 flex items-center">
															<IconWrapper className="text-xl">
																<EyeIcon />
															</IconWrapper>
														</Link>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>

								<div className="mt-8 flex flex-col md:flex-row text-center md:text-start justify-center items-center">
									<span className="text-sm text-nowrap">
										Showing{" "}
										<span className="font-medium">
											{Math.min((page - 1) * limit + 1, total)}- {Math.min(page * limit, total)}
										</span>{" "}
										of <span className="font-medium">{total}</span> results
									</span>
									<div className="ml-auto">
										<CompactPagination page={page} pages={pages} onPageChange={setPage} />
									</div>
								</div>
							</>
						) : (
							<div className="text-center py-8 text-muted-foreground">No debtors found</div>
						)}
					</div>
				</div>
			</CustomCard>
		</PageWrapper>
	);
}
