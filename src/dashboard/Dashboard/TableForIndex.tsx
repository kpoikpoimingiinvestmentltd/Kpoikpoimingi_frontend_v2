import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconWrapper } from "@/assets/icons";
import { Link } from "react-router";
import { _router } from "@/routes/_router";
import Badge from "@/components/base/Badge";
import { EyeIcon } from "@/assets/icons";
import { useGetAllCustomers } from "@/api/customer";
import { TableSkeleton } from "@/components/common/Skeleton";

export default function TableForIndex() {
	const { data: customersResponse, isLoading } = useGetAllCustomers(1, 5);
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
							<TableHead>Email</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-8">
									<div className="flex justify-center">
										<TableSkeleton rows={3} cols={7} />
									</div>
								</TableCell>
							</TableRow>
						) : (customersResponse as any)?.data && (customersResponse as any).data.length > 0 ? (
							(customersResponse as any).data.map((customer: any, idx: number) => (
								<TableRow key={idx} className="hover:bg-[#F6FBFF]">
									<TableCell>{customer.id}</TableCell>
									<TableCell>{customer.fullName}</TableCell>
									<TableCell>{customer.email || "-"}</TableCell>
									<TableCell>{customer.phoneNumber || "-"}</TableCell>
									<TableCell>
										<Badge value={customer.status || "Active"} size="sm" />
									</TableCell>
									<TableCell>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "-"}</TableCell>
									<TableCell>
										<Link to={_router.dashboard.customerDetails} className="text-primary hover:bg-primary/10 p-2 rounded-full inline-block">
											<IconWrapper>
												<EyeIcon />
											</IconWrapper>
										</Link>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={7} className="text-center py-8 text-gray-400">
									No customers found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</CustomCard>
	);
}
