import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconWrapper } from "@/assets/icons";
import { Link } from "react-router";
import { _router } from "@/routes/_router";
import Badge from "@/components/base/Badge";
import { EyeIcon } from "@/assets/icons";

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

export default function TableForIndex() {
	return (
		<CustomCard className="bg-white w-full rounded-lg p-4 border border-gray-100">
			<div className="flex items-center justify-between mb-2">
				<h2 className="font-semibold">Recent Customers</h2>
				<Link to="#" className="text-primary text-sm font-medium hover:underline">
					View all
				</Link>
			</div>
			<div className="overflow-x-auto w-full mt-4">
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
									<div className="flex items-center gap-2">
										<button className="text-blue-500 hover:bg-blue-100 p-2 rounded-full">
											<IconWrapper>
												<EyeIcon />
											</IconWrapper>
										</button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</CustomCard>
	);
}
