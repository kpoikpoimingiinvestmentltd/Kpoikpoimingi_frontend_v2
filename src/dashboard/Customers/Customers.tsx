import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditIcon, FilterIcon, IconWrapper, PlusIcon, SearchIcon, SendEmailIcon, TrashIcon } from "@/assets/icons";
import { _router } from "@/routes/_router";
import Badge from "@/components/base/Badge";
import PageTitles from "@/components/common/PageTitles";
import { inputStyle, preTableButtonStyle, tableHeaderRowStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import { Link } from "react-router";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import type { CustomerRow } from "@/types/customer";
import DeleteModal from "@/dashboard/Customers/DeleteModal";
import SendEmailModal from "@/dashboard/Customers/SendEmailModal";
import EmptyData from "../../components/common/EmptyData";
import ActionButton from "../../components/base/ActionButton";
import { useGetAllCustomers, useDeleteCustomer } from "@/api/customer";
import { TableSkeleton } from "@/components/common/Skeleton";
import { toast } from "sonner";

export default function Customers() {
	const [page, setPage] = React.useState(1);
	const { data: customersData, isLoading, refetch } = useGetAllCustomers(page, 10, undefined, "createdAt", "desc");
	const [deleteOpen, setDeleteOpen] = React.useState(false);
	const [isSendEmailOpen, setIsSendEmailOpen] = React.useState(false);
	const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(null);

	// Delete customer mutation
	const deleteCustomerMutation = useDeleteCustomer(
		(res) => {
			console.log("Customer deleted successfully:", res);
			toast.success("Customer deleted successfully");
			setSelectedCustomerId(null);
			setDeleteOpen(false); // Close modal after successful deletion
			refetch(); // Refresh the customer list
		},
		(err) => {
			console.error("Error deleting customer:", err);
			toast.error("Failed to delete customer");
		}
	);

	// Transform API data to typed table format with runtime guards
	const customersList = React.useMemo((): CustomerRow[] => {
		if (!customersData || typeof customersData !== "object") return [];
		const cd = customersData as { data?: unknown[]; pagination?: { total?: number } };
		const raw = Array.isArray(cd.data) ? cd.data : [];
		return raw.map((item, idx) => {
			if (item && typeof item === "object") {
				const it = item as Record<string, unknown>;
				return {
					id: String(it.id ?? `cust-${idx}`),
					fullName: String(it.fullName ?? it.name ?? ""),
					email: String(it.email ?? ""),
					phoneNumber: it.phoneNumber ? String(it.phoneNumber) : undefined,
					status: typeof it.status === "string" ? it.status : undefined,
					createdAt: typeof it.createdAt === "string" ? it.createdAt : undefined,
				} as CustomerRow;
			}
			return { id: `cust-${idx}`, fullName: "", email: "" } as CustomerRow;
		});
	}, [customersData]);

	const pages = React.useMemo(() => {
		if (!customersData || typeof customersData !== "object") return 1;
		const cd = customersData as { pagination?: { total?: number } };
		const total = (cd.pagination && typeof cd.pagination.total === "number" ? cd.pagination.total : 0) || 0;
		return Math.max(1, Math.ceil(total / 10));
	}, [customersData]);

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Customers" description="List of people who patronize Kpo kpoi mingi investment" />
				<div className="flex items-center gap-3">
					<ActionButton type="button" className="bg-primary/10 text-primary gap-2 hover:bg-primary/20" onClick={() => setIsSendEmailOpen(true)}>
						<span className="text-sm">Send Email</span>
						<IconWrapper className="opacity-50">
							<SendEmailIcon />
						</IconWrapper>
					</ActionButton>
					<Link
						to={_router.dashboard.selectCustomerPaymentMethod}
						className="flex items-center gap-2 bg-primary rounded-sm px-4 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<PlusIcon />
						</IconWrapper>
						<span className="text-sm">Add Customer</span>
					</Link>
				</div>
			</div>
			<div className="min-h-96 flex">
				{isLoading ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<TableSkeleton rows={10} cols={7} />
					</CustomCard>
				) : customersList.length === 0 ? (
					<EmptyData text="No Customers at the moment" />
				) : (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<>
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
												<TableHead>Email</TableHead>
												<TableHead>Phone</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Action</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{customersList.map((row, idx: number) => (
												<TableRow key={row.id || idx} className="hover:bg-[#F6FBFF]">
													<TableCell className="text-[#13121266]">{row.id}</TableCell>
													<TableCell className="text-[#13121266]">{row.fullName}</TableCell>
													<TableCell className="text-[#13121266]">{row.email}</TableCell>
													<TableCell className="text-[#13121266]">{row.phoneNumber ?? "-"}</TableCell>
													<TableCell className="text-[#13121266]">
														<Badge value={row.status || "Active"} size="sm" />
													</TableCell>
													<TableCell className="text-[#13121266]">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}</TableCell>
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
																setSelectedCustomerId(row.id);
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
							onConfirm={async () => {
								if (selectedCustomerId) {
									await deleteCustomerMutation.mutateAsync(selectedCustomerId);
								}
							}}
							isLoading={deleteCustomerMutation.isPending}
						/>
						<div className="">
							<CompactPagination showRange page={page} pages={pages} onPageChange={setPage} />
						</div>
					</CustomCard>
				)}

				<SendEmailModal
					open={isSendEmailOpen}
					onOpenChange={setIsSendEmailOpen}
					customers={customersList.map((c) => ({ id: c.id, email: c.email, name: c.fullName }))}
					onSend={async (data) => {
						try {
							console.log("Sending email with data:", data);
							// TODO: Call your email API here
							// Example: await sendEmailAPI(data);
						} catch (error) {
							console.error("Failed to send email:", error);
						}
					}}
				/>
			</div>
		</div>
	);
}
