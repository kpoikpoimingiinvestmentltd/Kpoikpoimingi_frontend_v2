import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import CustomCard from "@/components/base/CustomCard";
import { EyeIcon, IconWrapper, ShareIcon } from "@/assets/icons";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import { Link } from "react-router";
import { tableHeaderRowStyle } from "../../../components/common/commonStyles";
import { _router } from "../../../routes/_router";

type ReceiptItem = {
	id: string;
	customer: string;
	property: string;
	paymentType: string;
	amount: string;
	date: string;
};

const sample: ReceiptItem[] = Array.from({ length: 10 }).map((_, i) => ({
	id: `ID 123456`,
	customer: `Kenny Banks James`,
	property: `12kg gas cylinder`,
	paymentType: i % 2 === 0 ? "Full Payment" : "Hire Purchase",
	amount: "500,000",
	date: "20-4-2025",
}));

export default function ReceiptTable({
	items = sample,
	page: controlledPage,
	pages: controlledPages,
	onPageChange,
	perPage = 10,
}: {
	items?: ReceiptItem[];
	page?: number;
	pages?: number;
	onPageChange?: (p: number) => void;
	perPage?: number;
}) {
	const [internalPage, setInternalPage] = React.useState(1);
	const page = controlledPage ?? internalPage;
	const setPage = onPageChange ?? setInternalPage;

	const total = items.length;
	const pages = controlledPages ?? Math.max(1, Math.ceil(total / perPage));
	const pageData = items.slice((page - 1) * perPage, page * perPage);

	return (
		<CustomCard className="mt-4 p-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-base font-medium">All Receipt</h3>
				<div className="text-sm text-muted-foreground">Total of (230)</div>
			</div>

			<div className="overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow className={tableHeaderRowStyle}>
							<TableHead>Receipt ID</TableHead>
							<TableHead>Customer Name</TableHead>
							<TableHead>Property Name</TableHead>
							<TableHead>Payment Type</TableHead>
							<TableHead>Amount Paid</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{pageData.map((it, idx) => (
							<TableRow key={idx} className="hover:bg-[#FBFBFB]">
								<TableCell className="text-sm text-muted-foreground">{it.id}</TableCell>
								<TableCell className="text-sm text-[#667085]">{it.customer}</TableCell>
								<TableCell className="text-sm text-[#667085]">{it.property}</TableCell>
								<TableCell className="text-sm text-[#667085]">{it.paymentType}</TableCell>
								<TableCell className="text-sm text-[#667085]">{it.amount}</TableCell>
								<TableCell className="text-sm text-[#667085]">{it.date}</TableCell>
								<TableCell>
									<div className="flex items-center gap-1">
										<Link to={_router.dashboard.receiptDetails} className="p-2 text-primary">
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
			</div>

			<CompactPagination page={page} pages={pages} onPageChange={setPage} total={230} perPage={perPage} showRange />
		</CustomCard>
	);
}
