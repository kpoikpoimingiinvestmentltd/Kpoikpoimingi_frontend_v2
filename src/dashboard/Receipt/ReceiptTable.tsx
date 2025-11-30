import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import CustomCard from "@/components/base/CustomCard";
import { EyeIcon, IconWrapper, ShareIcon } from "@/assets/icons";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import { Link } from "react-router";
import { useGetReceipts } from "@/api/receipt";
import { tableHeaderRowStyle } from "../../components/common/commonStyles";
import { _router } from "../../routes/_router";
import { TableSkeleton } from "@/components/common/Skeleton";
import type { ReceiptListItem } from "@/types/receipt";

export default function ReceiptTable({ perPage = 10 }: { perPage?: number }) {
	const [page, setPage] = React.useState(1);
	const { data, isLoading } = useGetReceipts(page, perPage);

	const paginationData = (data?.pagination as Record<string, unknown>) || {};
	const pagination = {
		page: (paginationData.page as number) ?? 1,
		limit: (paginationData.limit as number) ?? perPage,
		total: (paginationData.total as number) ?? 0,
		totalPages: (paginationData.totalPages as number) ?? 1,
	};
	const items: ReceiptListItem[] = Array.isArray(data?.data) ? data.data : [];
	const pages = pagination.totalPages ?? Math.max(1, Math.ceil(pagination.total / perPage));

	const formatCurrency = (v?: string | number | null) => {
		if (v === undefined || v === null || v === "") return "-";
		const n = Number(v);
		if (Number.isNaN(n)) return String(v);
		return `₦${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	};

	const formatPaymentMethod = (pm?: string | { id?: number; method?: string } | null) => {
		if (!pm) return "-";
		if (typeof pm === "string") return pm;
		const method = (pm as Record<string, unknown>)?.method;
		if (!method) return "-";
		if (method === "PAYMENT_LINK") return "Payment Link";
		return String(method);
	};

	return (
		<CustomCard className="mt-4 p-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-base font-medium">All Receipt</h3>
				<div className="text-sm text-muted-foreground">Total of ({(pagination.total as number) ?? 0})</div>
			</div>

			<div className="overflow-x-auto">
				{isLoading ? (
					<TableSkeleton rows={6} cols={7} />
				) : (
					<Table>
						<TableHeader>
							<TableRow className={tableHeaderRowStyle}>
								<TableHead>Receipt ID</TableHead>
								<TableHead>Customer Name</TableHead>
								<TableHead>Property Name</TableHead>
								<TableHead>Payment Type</TableHead>
								<TableHead>Amount Paid</TableHead>
								<TableHead>Date</TableHead>
								<TableHead className="text-center">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{items.map((it, idx) => (
								<TableRow key={it.id ?? idx} className="hover:bg-card">
									<TableCell className="text-sm text-muted-foreground">{it.receiptNumber ?? it.id}</TableCell>
									<TableCell className="text-sm text-[#667085]">{it.customer?.fullName ?? "-"}</TableCell>
									<TableCell className="text-sm text-[#667085]">{it.contract?.property?.name ?? it.propertyName ?? "-"}</TableCell>
									<TableCell className="text-sm text-[#667085]">
										{formatPaymentMethod(it.paymentMethod as string | { id?: number; method?: string })}
									</TableCell>
									<TableCell className="text-sm text-[#667085]">{formatCurrency(it.amountPaid ?? it.totalAmount)}</TableCell>
									<TableCell className="text-sm text-[#667085]">
										{it.paymentDate
											? new Date(it.paymentDate).toLocaleDateString()
											: it.createdAt
											? new Date(it.createdAt).toLocaleDateString()
											: "-"}
									</TableCell>
									<TableCell>
										<div className="flex items-center justify-center gap-1">
											<Link to={_router.dashboard.receiptDetails.replace(":id", it.id)} className="p-2 text-primary">
												<IconWrapper>
													<EyeIcon />
												</IconWrapper>
											</Link>
											<button className="p-2 text-primary">
												<IconWrapper>
													<ShareIcon />
												</IconWrapper>
											</button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>

			<CompactPagination page={page} pages={pages} onPageChange={setPage} total={pagination.total ?? 0} perPage={perPage} showRange />
		</CustomCard>
	);
}
