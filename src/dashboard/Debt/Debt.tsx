import ExportTrigger from "../../components/common/ExportTrigger";
import PageTitles from "../../components/common/PageTitles";
import Image from "../../components/base/Image";
import { media } from "../../resources/images";
import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { tableHeaderRowStyle, inputStyle, preTableButtonStyle } from "@/components/common/commonStyles";
import CompactPagination from "@/components/ui/compact-pagination";
import CustomInput from "@/components/base/CustomInput";
import { SearchIcon, FilterIcon, EyeIcon, IconWrapper } from "@/assets/icons";
import { Link } from "react-router";
import { _router } from "@/routes/_router";
import React from "react";
import PageWrapper from "../../components/common/PageWrapper";
import { useGetAllContractDebts } from "@/api/contracts";
import { TableSkeleton } from "@/components/common/Skeleton";
import EmptyData from "@/components/common/EmptyData";
import { twMerge } from "tailwind-merge";

export default function Debt() {
	const [page, setPage] = React.useState(1);
	const [searchInput, setSearchInput] = React.useState("");
	const [search, setSearch] = React.useState("");

	// Debounce search input
	React.useEffect(() => {
		const timer = setTimeout(() => {
			setSearch(searchInput);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchInput]);

	const { data: debtData = {} as Record<string, unknown>, isLoading } = useGetAllContractDebts(page, 10, search);

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

	return (
		<PageWrapper>
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Debt" description="This contains all customers owing for product they signed to buy on installment" />
				<div className="flex items-center gap-3">
					<ExportTrigger title="Export" />
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
			<div className="min-h-96 flex">
				{isLoading ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<TableSkeleton rows={10} />
					</CustomCard>
				) : debtors.length > 0 ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<div className="w-full">
							<div className="flex items-center justify-between flex-wrap gap-6">
								<h2 className="font-semibold">All Debtors ( Customers Owning )</h2>
								<div className="flex items-center gap-2">
									<div className="relative md:w-80">
										<CustomInput
											placeholder="Search by contract code, customer name, or property name"
											aria-label="Search"
											value={searchInput}
											onChange={(e) => setSearchInput(e.target.value)}
											className={`max-w-[320px] ${inputStyle} h-10 pl-9`}
											iconLeft={<SearchIcon />}
										/>
									</div>
									<button type="button" className={`${preTableButtonStyle} text-white bg-primary ml-auto`}>
										<FilterIcon />
										<span className="hidden sm:inline">Filter</span>
									</button>
								</div>
							</div>

							<div className="overflow-x-auto w-full mt-8">
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
							</div>

							<div className="mt-8 flex flex-col md:flex-row text-center md:text-start justify-center items-center">
								<span className="text-sm text-nowrap">
									Showing{" "}
									<span className="font-medium">
										{Math.min((page - 1) * 10 + 1, (paginationData.total as number) ?? 0)}-
										{Math.min(page * 10, (paginationData.total as number) ?? 0)}
									</span>{" "}
									of <span className="font-medium">{(paginationData.total as number) ?? 0}</span> results
								</span>
								<div className="ml-auto">
									<CompactPagination page={page} pages={pages} onPageChange={setPage} />
								</div>
							</div>
						</div>
					</CustomCard>
				) : (
					<EmptyData text="No debtors at the moment" />
				)}
			</div>
		</PageWrapper>
	);
}
