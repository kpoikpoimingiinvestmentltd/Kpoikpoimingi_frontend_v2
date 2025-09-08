import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilterIcon, IconWrapper, SearchIcon } from "@/assets/icons";
import { _router } from "@/routes/_router";
import Badge from "@/components/base/Badge";
import { EyeIcon } from "@/assets/icons";
import PageTitles from "@/components/common/PageTitles";
import { inputStyle, preTableButtonStyle } from "@/components/common/commonStyles";
import { Input } from "@/components/ui/input";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import { Link } from "react-router";
import { Edit } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../../../components/ui/pagination";

// Dummy data for demonstration
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
		status: "Pending",
		totalPayment: "500,000",
		date: "30-4-2025",
	},
];
export default function Customers() {
	return (
		<div className="flex flex-col gap-y-6">
			<div>
				<PageTitles title="Customers" description="List of people who patronize Kpo kpoi mingi investment" />
			</div>
			<CustomCard className="bg-white min-h-80 w-full rounded-lg p-4 border border-gray-100">
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
										placeholder="Search by name or property"
										aria-label="Search by name or property"
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
														<Edit size={"1em"} />
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
					<Pagination className="justify-end">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious />
							</PaginationItem>

							{Array.from({ length: 5 }).map((_, i) => (
								<PaginationItem key={i}>
									<PaginationLink>{i + 1}</PaginationLink>
								</PaginationItem>
							))}

							<PaginationItem>
								<PaginationNext />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</CustomCard>
		</div>
	);
}
