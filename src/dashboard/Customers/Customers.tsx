import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditIcon, FilterIcon, IconWrapper, PlusIcon, SearchIcon, SendEmailIcon, TrashIcon } from "@/assets/icons";
import { _router } from "@/routes/_router";
import Badge from "@/components/base/Badge";
import PageTitles from "@/components/common/PageTitles";
import { inputStyle, preTableButtonStyle, tableHeaderRowStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import { Link } from "react-router";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import DeleteModal from "@/dashboard/Customers/DeleteModal";
import EmptyData from "../../components/common/EmptyData";
import ActionButton from "../../components/base/ActionButton";

// Dummy data for demonstration
const initialCustomers = [
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
];
export default function Customers() {
	const [isEmpty] = React.useState(false);
	const [page, setPage] = React.useState(1);
	const [customersList, setCustomersList] = React.useState(initialCustomers);
	const [deleteOpen, setDeleteOpen] = React.useState(false);
	const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
	const pages = Math.max(1, Math.ceil(customersList.length / 10));

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Customers" description="List of people who patronize Kpo kpoi mingi investment" />
				<div className="flex items-center gap-3">
					<ActionButton type="button" className="bg-primary/10 text-primary gap-2 hover:bg-primary/20">
						<span className="text-sm">Send Email</span>
						<IconWrapper className="opacity-50">
							<SendEmailIcon />
						</IconWrapper>
					</ActionButton>
					<Link
						to={_router.dashboard.customerAdd}
						className="flex items-center gap-2 bg-primary rounded-sm px-4 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<PlusIcon />
						</IconWrapper>
						<span className="text-sm">Add Customer</span>
					</Link>
				</div>
			</div>
			<div className="min-h-96 flex">
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
											<CustomInput
												placeholder="Search by name or property"
												aria-label="Search by name or property"
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
										<TableHeader className={tableHeaderRowStyle}>
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
											{customersList.map((row, idx) => (
												<TableRow key={idx} className="hover:bg-[#F6FBFF]">
													<TableCell className="text-[#13121266]">{row.id}</TableCell>
													<TableCell className="text-[#13121266]">{row.name}</TableCell>
													<TableCell className="text-[#13121266]">{row.property}</TableCell>
													<TableCell className="text-[#13121266]">{row.paymentType}</TableCell>
													<TableCell className="text-[#13121266]">
														<Badge value={row.status} size="sm" />
													</TableCell>
													<TableCell className="text-[#13121266]">{row.totalPayment}</TableCell>
													<TableCell className="text-[#13121266]">{row.date}</TableCell>
													<TableCell className="flex items-center gap-1">
														<Link to={_router.dashboard.customerDetails.replace(":id", row.id)} className="p-2 flex items-center">
															<IconWrapper className="text-xl">
																<EditIcon />
															</IconWrapper>
														</Link>
														<button
															type="button"
															className="text-red-500"
															onClick={() => {
																setSelectedIndex(idx);
																setDeleteOpen(true);
															}}>
															<IconWrapper className="text-xl">
																<TrashIcon />
															</IconWrapper>
														</button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</div>
						</>

						<DeleteModal
							open={deleteOpen}
							onOpenChange={setDeleteOpen}
							title="Delete customer"
							description="Are you sure you want to delete this customer? This action cannot be undone."
							onConfirm={() => {
								if (selectedIndex !== null) {
									setCustomersList((prev) => prev.filter((_, i) => i !== selectedIndex));
									setSelectedIndex(null);
								}
							}}
						/>
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
					<EmptyData text="No Customers at the moment" />
				)}
			</div>
		</div>
	);
}
