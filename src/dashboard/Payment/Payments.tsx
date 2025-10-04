import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilterIcon, IconWrapper, SearchIcon } from "@/assets/icons";
import { _router } from "@/routes/_router";
import Badge from "@/components/base/Badge";
import PageTitles from "@/components/common/PageTitles";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inputStyle, preTableButtonStyle, tableHeaderRowStyle, tabListStyle, tabStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import EmptyData from "@/components/common/EmptyData";
import ExportTrigger from "../../components/common/ExportTrigger";

// Dummy data for demonstration
const payments = [
	{
		id: "ID 123456",
		name: "Kenny Banks James",
		property: "12 inches HP laptop",
		paymentType: "Hire purchase",
		status: "Pending",
		totalPayment: "500,000",
		date: "20-4-2025",
	},
	{
		id: "ID 123457",
		name: "Kenny Banks James",
		property: "12 inches HP laptop",
		paymentType: "Hire purchase",
		status: "Paid",
		totalPayment: "500,000",
		date: "20-4-2025",
	},
	{
		id: "ID 123458",
		name: "Kenny Banks James",
		property: "12 inches HP laptop",
		paymentType: "Hire purchase",
		status: "Paid",
		totalPayment: "500,000",
		date: "20-4-2025",
	},
	{
		id: "ID 123459",
		name: "Kenny Banks James",
		property: "12 inches HP laptop",
		paymentType: "Hire purchase",
		status: "Pending",
		totalPayment: "500,000",
		date: "20-4-2025",
	},
];

export default function Payments() {
	const [isEmpty] = React.useState(false);
	const [page, setPage] = React.useState(1);
	const pages = 13;

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Payment Schedule" description="The list of all paid debt and pending payment" />
				<div className="flex items-center gap-3">
					<ExportTrigger title="Export" />
				</div>
			</div>
			<div className="min-h-96 flex">
				{!isEmpty ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<>
							<div className="w-full">
								<div className="flex items-center justify-between flex-wrap gap-6">
									<div className="flex items-center gap-4">
										<Tabs defaultValue="paid">
											<TabsList className={tabListStyle}>
												<TabsTrigger className={tabStyle} value="paid">
													Paid
												</TabsTrigger>
												<TabsTrigger className={tabStyle} value="pending">
													Pending
												</TabsTrigger>
											</TabsList>
										</Tabs>
									</div>
									<div className="flex items-center gap-2">
										<div className="relative md:w-80">
											<CustomInput
												placeholder="Search by id, name or contact"
												aria-label="Search payments"
												className={`max-w-[320px] ${inputStyle} h-10 pl-9`}
												iconLeft={<SearchIcon />}
											/>
										</div>
										<button type="button" className={`${preTableButtonStyle} text-white bg-primary ml-auto`}>
											<IconWrapper className="text-base">
												<FilterIcon />
											</IconWrapper>
											<span className="hidden sm:inline">Filter</span>
										</button>
									</div>
								</div>
								<div className="overflow-x-auto w-full mt-8">
									<Table>
										<TableHeader className="[&_tr]:border-0">
											<TableRow className={`${tableHeaderRowStyle}`}>
												<TableHead>Contract ID</TableHead>
												<TableHead>Customer Name</TableHead>
												<TableHead>Contact</TableHead>
												<TableHead>Amount</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Late Fees</TableHead>
												<TableHead>Vat Amount</TableHead>
												<TableHead>Total Amount</TableHead>
												<TableHead>Date</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{payments.map((row, idx) => (
												<TableRow key={idx} className="hover:bg-[#F6FBFF]">
													<TableCell className="text-[#13121266] py-4">{row.id}</TableCell>
													<TableCell className="text-[#13121266] py-4">{row.name}</TableCell>
													<TableCell className="text-[#13121266] py-4">0908647532</TableCell>
													<TableCell className="text-[#13121266] py-4">{row.totalPayment}</TableCell>
													<TableCell className="text-[#13121266] py-4">
														<Badge value={row.status} size="sm" />
													</TableCell>
													<TableCell className="text-[#13121266] py-4">500,000</TableCell>
													<TableCell className="text-[#13121266] py-4">500,000</TableCell>
													<TableCell className="text-[#13121266] py-4">500,000</TableCell>
													<TableCell className="text-[#13121266] py-4">{row.date}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</div>
						</>

						<CompactPagination page={page} pages={pages} onPageChange={setPage} showRange />
					</CustomCard>
				) : (
					<EmptyData text="ou have no payments yet. When you do, they will appear here." />
				)}
			</div>
		</div>
	);
}
