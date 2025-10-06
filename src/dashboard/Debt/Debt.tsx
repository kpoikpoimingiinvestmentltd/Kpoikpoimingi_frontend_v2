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

const demoDebtors = Array.from({ length: 10 }).map((_, i) => ({
	id: `ID12345${i}`,
	customerName: "Kenny Banks James",
	propertyName: "25kg gas cylinder",
	amountPaid: "20,000",
	totalDebt: "80,000",
	date: "20-04-2025",
}));

export default function Debt() {
	const [isEmpty] = React.useState(false);
	const [page, setPage] = React.useState(1);
	const [rows] = React.useState(demoDebtors);
	const pages = Math.max(1, Math.ceil(rows.length / 10));

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
							NGN <span className="text-3xl">80,000</span>
						</div>
					</div>
				</div>
				<aside className="items-end p-4 h-full flex justify-end">
					<Image src={media.images.coin} alt="coin" className="w-28 md:mr-10" />
				</aside>
			</div>

			{/* Debtors table */}
			<div className="min-h-96 flex">
				{!isEmpty ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<div className="w-full">
							<div className="flex items-center justify-between flex-wrap gap-6">
								<h2 className="font-semibold">All Debtors ( Customers Owning )</h2>
								<div className="flex items-center gap-2">
									<div className="relative md:w-80">
										<CustomInput
											placeholder="Search reports"
											aria-label="Search"
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
											<TableHead>Contract ID</TableHead>
											<TableHead>Customer Name</TableHead>
											<TableHead>Property Name</TableHead>
											<TableHead>Amount Paid</TableHead>
											<TableHead>Total Dept Amount</TableHead>
											<TableHead>Date</TableHead>
											<TableHead className="text-right">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{rows.map((r, i) => (
											<TableRow key={i} className="hover:bg-[#F6FBFF]">
												<TableCell className="text-[#13121266]">{r.id}</TableCell>
												<TableCell className="text-[#13121266]">{r.customerName}</TableCell>
												<TableCell className="text-[#13121266]">{r.propertyName}</TableCell>
												<TableCell className="text-[#13121266]">{r.amountPaid}</TableCell>
												<TableCell className="text-[#13121266]">{r.totalDebt}</TableCell>
												<TableCell className="text-[#13121266]">{r.date}</TableCell>
												<TableCell className="text-right">
													<Link to={_router.dashboard.debtDetails.replace(":id", r.id)} className="p-2 flex items-center">
														<IconWrapper className="text-xl">
															<EyeIcon />
														</IconWrapper>
													</Link>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>

							<div className="mt-8 flex flex-col md:flex-row text-center md:text-start justify-center items-center">
								<span className="text-sm text-nowrap">
									Showing <span className="font-medium">1-10</span> of <span className="font-medium">{rows.length}</span> results
								</span>
								<div className="ml-auto">
									<CompactPagination page={page} pages={pages} onPageChange={setPage} />
								</div>
							</div>
						</div>
					</CustomCard>
				) : (
					<></>
				)}
			</div>
		</PageWrapper>
	);
}
