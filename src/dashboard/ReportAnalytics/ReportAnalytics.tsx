import React from "react";
import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import StatCard from "@/components/base/StatCard";
import CustomInput from "@/components/base/CustomInput";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inputStyle, preTableButtonStyle, tabListStyle, tabStyle } from "@/components/common/commonStyles";
import { FilterIcon, IconWrapper, SearchIcon, CalendarIcon } from "@/assets/icons";
import ExportTrigger from "@/components/common/ExportTrigger";
import EmptyData from "@/components/common/EmptyData";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import VATCollected from "./VATCollected";
import InterestPenalties from "./InterestPenalties";

// demo rows for VAT and interest (separate shapes)
const vatRows = [
	{
		id: "ID 123456",
		customerName: "Kenny Banks James",
		propertyName: "12kg gas cylinder",
		paymentMethod: "Cash",
		paymentType: "Hire Purchase",
		totalAmount: "500,000",
		vatCollected: "500,000",
		vatRate: "5%",
		date: "20-4-2025",
	},
	{
		id: "ID 123457",
		customerName: "Kenny Banks James",
		propertyName: "12kg gas cylinder",
		paymentMethod: "Cash",
		paymentType: "Hire Purchase",
		totalAmount: "500,000",
		vatCollected: "500,000",
		vatRate: "5%",
		date: "20-4-2025",
	},
];

const interestRows = [
	{
		contractCode: "123456",
		propertyName: "12kg gas cylinder",
		customerName: "Kenny Banks James",
		totalAmount: "500,000",
		lateFee: "500,000",
		interestRate: "5%",
		dueDate: "20-4-2025",
	},
	{
		contractCode: "123457",
		propertyName: "12kg gas cylinder",
		customerName: "Kenny Banks James",
		totalAmount: "500,000",
		lateFee: "500,000",
		interestRate: "5%",
		dueDate: "20-4-2025",
	},
];

export default function ReportAnalytics() {
	const [tab, setTab] = React.useState<"vat" | "interest">("vat");
	const [isEmpty] = React.useState(false);
	const [page, setPage] = React.useState(1);
	const pages = 6;
	const [fromDate, setFromDate] = React.useState<string | null>("2025-04-02");
	const [toDate, setToDate] = React.useState<string | null>("2025-07-12");

	// Static stats data
	const stats = [
		{
			id: "income",
			title: "Total Income Earned",
			value: 50000000,
			currency: "NGN",
			variant: "income",
		},
		{
			id: "vat",
			title: "Total VAT Collected",
			value: 5000000,
			currency: "NGN",
			variant: "income",
		},
		{
			id: "interest",
			title: "Total Interest Penalties",
			value: 2500000,
			currency: "NGN",
			variant: "income",
		},
	];

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Report Analytics" description="Overview of financial and operational reports" />
				<div className="flex items-center gap-3">
					<ExportTrigger title="Export" />
				</div>
			</div>

			<CustomCard className="flex min-h-96 flex-col gap-y-6 md:p-8">
				{!isEmpty ? (
					<div className="flex flex-col gap-y-6">
						<CustomCard className="p-4 border-0 bg-card">
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								{stats.map((s) => (
									<StatCard key={s.id} title={s.title} value={s.value as any} currency={s.currency} variant={s.variant as any} />
								))}
							</div>
						</CustomCard>
						<CustomCard className="border-0 flex-grow w-full p-0">
							<div className="w-full">
								<div className="flex items-center justify-between flex-wrap gap-6">
									<div className="flex items-center gap-4">
										<Tabs defaultValue={tab} onValueChange={(v) => setTab(v as "vat" | "interest")}>
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

									<div className="flex items-center gap-2">
										<div className="relative md:w-80">
											<CustomInput
												placeholder="Search reports by id, metric or source"
												aria-label="Search reports"
												className={`max-w-[320px] ${inputStyle} h-10 pl-9`}
												iconLeft={<SearchIcon />}
											/>
										</div>

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<button type="button" className={`${preTableButtonStyle} text-white bg-primary ml-auto`}>
													<IconWrapper className="text-base">
														<FilterIcon />
													</IconWrapper>
													<span className="hidden sm:inline">Filter</span>
												</button>
											</DropdownMenuTrigger>

											<DropdownMenuContent className="w-72 p-4 mr-4">
												<div className="grid grid-cols-1 gap-3">
													<div>
														<CustomInput
															type="date"
															label="From"
															value={fromDate ?? ""}
															onChange={(e) => setFromDate((e.target as HTMLInputElement).value)}
															className="w-full h-9 text-sm"
															iconRight={<CalendarIcon />}
														/>
													</div>
													<div>
														<CustomInput
															type="date"
															label="To"
															value={toDate ?? ""}
															onChange={(e) => setToDate((e.target as HTMLInputElement).value)}
															className="w-full h-9 text-sm"
															iconRight={<CalendarIcon />}
														/>
													</div>

													<div className="pt-2 border-t">
														<button onClick={() => {}} className="w-full bg-primary text-white px-4 text-sm py-2 rounded">
															Enter
														</button>
													</div>
												</div>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>

								<div className="mt-6 rounded-md bg-[#F3FBFF] p-4">
									<div className="flex flex-col justify-between">
										<div className="text-sm flex gap-3 items-center flex-wrap text-gray-500">
											<span> Total VAT Amount</span>
											<span className="text-xs">
												From {fromDate ?? "2-4-2025"} To {toDate ?? "12-7-2025"}
											</span>
										</div>
										<div className="mt-3 text-2xl font-medium">NGN 50,000,000</div>
									</div>
								</div>

								<CustomCard className="mt-4 bg-card p-3">
									{tab === "vat" ? (
										<VATCollected rows={vatRows as any} page={page} pages={pages} onPageChange={setPage} />
									) : (
										<InterestPenalties rows={interestRows as any} page={page} pages={pages} onPageChange={setPage} />
									)}
								</CustomCard>
							</div>
						</CustomCard>
					</div>
				) : (
					<EmptyData className="h-full" text="No reports yet." />
				)}
			</CustomCard>
		</div>
	);
}
