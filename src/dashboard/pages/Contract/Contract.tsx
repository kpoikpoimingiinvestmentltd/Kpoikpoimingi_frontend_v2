import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditIcon, FilePlusIcon, FilterIcon, IconWrapper, SearchIcon } from "@/assets/icons";
import { _router } from "@/routes/_router";
import Badge from "@/components/base/Badge";
import PageTitles from "@/components/common/PageTitles";
import CreateContractModal from "./CreateContractModal";
import { inputStyle, preTableButtonStyle } from "@/components/common/commonStyles";
import { Input } from "@/components/ui/input";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import { Link } from "react-router";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import EmptyData from "@/components/common/EmptyData";

export default function Contract() {
	const [isEmpty] = React.useState(false);
	const [createOpen, setCreateOpen] = React.useState(false);
	const [page, setPage] = React.useState(1);
	const pages = Math.max(1, Math.ceil(customers.length / 10));
	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Contract" description="The contracts transaction between Kpo kpoi mingi investment and it customers" />
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => setCreateOpen(true)}
						className="flex items-center gap-2 bg-primary rounded-sm px-4 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<FilePlusIcon />
						</IconWrapper>
						<span className="text-sm">Create Contract</span>
					</button>
				</div>
			</div>
			<div className="min-h-80 flex">
				{!isEmpty ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<>
							<div className="flex-grow max-w-sm mx-auto text-center gap-5 hidden flex-col items-center justify-center p-5">
								<Image src={media.images.empty} alt="Empty Customer List" className="w-24" />
								<p className="text-muted-foreground">You have no customers yet. When you do, they will appear here.</p>
							</div>
							<div className="w-full">
								<div className="flex items-center justify-between flex-wrap gap-6">
									<h2 className="font-semibold">All Customers</h2>
									<div className="flex items-center gap-2">
										<div className="relative md:w-80">
											<Input
												placeholder="Search by name, property or contract code"
												aria-label="Search by name, property or contract code"
												className={`max-w-[320px] ${inputStyle} h-10 pl-9`}
											/>
											<IconWrapper className="absolute top-1/2 -translate-y-1/2 opacity-50 left-5 -translate-x-1/2">
												<SearchIcon />
											</IconWrapper>
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
										{/* Create contract modal */}
										<CreateContractModal open={createOpen} onOpenChange={setCreateOpen} />

										<TableHeader className="[&_tr]:border-0">
											<TableRow className="bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
												<TableHead>Customer ID</TableHead>
												<TableHead>Name</TableHead>
												<TableHead>Property Name</TableHead>
												<TableHead>Payment Type</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Total payment</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Action</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{customers.map((row, idx) => (
												<TableRow key={idx} className="hover:bg-[#F6FBFF]">
													<TableCell>{row.id}</TableCell>
													<TableCell>{row.name}</TableCell>
													<TableCell>{row.property}</TableCell>
													<TableCell>{row.paymentType}</TableCell>
													<TableCell>
														<Badge value={row.status} size="sm" />
													</TableCell>
													<TableCell>{row.totalPayment}</TableCell>
													<TableCell>{row.date}</TableCell>
													<TableCell>
														<Link to={_router.dashboard.customerDetails.replace(":id", row.id)} className=" p-2 flex items-center">
															<IconWrapper>
																<EditIcon />
															</IconWrapper>
														</Link>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</div>
						</>

						<div className="mt-8 flex flex-col md:flex-row text-center md:text-start justify-center items-center">
							<span className="text-sm text-nowrap">
								Showing <span className="font-medium">1-10</span> of <span className="font-medium">100</span> results
							</span>
							<div className="ml-auto">
								<CompactPagination page={page} pages={pages} onPageChange={setPage} />
							</div>
						</div>
					</CustomCard>
				) : (
					<div className="flex-grow flex items-center justify-center">
						<EmptyData text="No Customers at the moment" />
					</div>
				)}
			</div>
		</div>
	);
}

// Mock data matching the provided image
const customers = [
	{
		id: "ID 123456",
		name: "Tom Doe James",
		property: "12 inches HP laptop",
		paymentType: "Hire purchase",
		status: "Active",
		totalPayment: "500,000",
		date: "30-4-2025",
	},
	{
		id: "ID 123456",
		name: "Tom Doe James",
		property: "12 inches HP laptop",
		paymentType: "Hire purchase",
		status: "Active",
		totalPayment: "500,000",
		date: "30-4-2025",
	},
	{
		id: "ID 123456",
		name: "Tom Doe James",
		property: "12 inches HP laptop",
		paymentType: "Hire purchase",
		status: "Active",
		totalPayment: "500,000",
		date: "30-4-2025",
	},
	{
		id: "ID 123456",
		name: "Tom Doe James",
		property: "12 inches HP laptop",
		paymentType: "Hire purchase",
		status: "Active",
		totalPayment: "500,000",
		date: "30-4-2025",
	},
	{
		id: "ID 123456",
		name: "Tom Doe James",
		property: "12 inches HP laptop",
		paymentType: "Hire purchase",
		status: "Pending",
		totalPayment: "500,000",
		date: "30-4-2025",
	},
	{
		id: "ID 123456",
		name: "Tom Doe James",
		property: "12 inches HP laptop",
		paymentType: "Hire purchase",
		status: "Pending",
		totalPayment: "500,000",
		date: "30-4-2025",
	},
	{
		id: "ID 123456",
		name: "Tom Doe James",
		property: "12 inches HP laptop",
		paymentType: "Hire purchase",
		status: "Terminated",
		totalPayment: "500,000",
		date: "30-4-2025",
	},
	{
		id: "ID 123456",
		name: "Tom Doe James",
		property: "12 inches HP laptop",
		paymentType: "Hire purchase",
		status: "Terminated",
		totalPayment: "500,000",
		date: "30-4-2025",
	},
	{
		id: "ID 123456",
		name: "Tom Doe James",
		property: "12 inches HP laptop",
		paymentType: "Hire purchase",
		status: "Paused",
		totalPayment: "500,000",
		date: "30-4-2025",
	},
	{
		id: "ID 123456",
		name: "Tom Doe James",
		property: "12 inches HP laptop",
		paymentType: "Hire purchase",
		status: "Paused",
		totalPayment: "500,000",
		date: "30-4-2025",
	},
];
