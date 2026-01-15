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
						) : Array.isArray((customersResponse as Record<string, unknown>)?.data) ? (
							((customersResponse as Record<string, unknown>).data as unknown[]).map((customer: unknown, idx: number) => {
								const cust = customer as Record<string, unknown>;
								return (
									<TableRow key={idx} className="hover:bg-[#F6FBFF]">
										<TableCell title={String(cust.customerCode || cust.id)}>
											<span className="max-w-40 block truncate">{String(cust.customerCode || cust.id)}</span>
										</TableCell>
										<TableCell>{String(cust.fullName)}</TableCell>
										<TableCell>{String(cust.email || "-")}</TableCell>
										<TableCell>{String(cust.phoneNumber || "-")}</TableCell>
										<TableCell>
											<Badge value={(cust.status as string) || "Active"} size="sm" />
										</TableCell>
										<TableCell>{cust.createdAt ? new Date(cust.createdAt as string).toLocaleDateString() : "-"}</TableCell>
										<TableCell>
											<Link
												preventScrollReset={false}
												to={_router.dashboard.customerDetails.replace(":id", String(cust.id))}
												className="text-primary hover:bg-primary/10 p-2 rounded-full inline-block">
												<IconWrapper>
													<EyeIcon />
												</IconWrapper>
											</Link>
										</TableCell>
									</TableRow>
								);
							})
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
