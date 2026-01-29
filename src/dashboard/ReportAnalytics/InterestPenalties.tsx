import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CompactPagination from "@/components/ui/compact-pagination";
import { tableHeaderRowStyle } from "../../components/common/commonStyles";
import type { PenaltyRecord, PaginationMeta } from "@/types/reports";

interface InterestPenaltiesProps {
	rows: PenaltyRecord[];
	page: number;
	pages: number;
	onPageChange: (p: number) => void;
	pagination?: PaginationMeta;
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
	}).format(amount);
}

function formatDate(dateString: string): string {
	try {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-NG", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		});
	} catch {
		return dateString;
	}
}

export default function InterestPenalties({ rows, page, pages, onPageChange, pagination }: InterestPenaltiesProps) {
	return (
		<div>
			<div>
				<h4 className="text-sm font-medium">Interest Penalties</h4>
			</div>

			<div className="overflow-x-auto w-full mt-4">
				<Table>
					<TableHeader className={tableHeaderRowStyle}>
						<TableRow>
							<TableHead>Contract Code</TableHead>
							<TableHead>Property Name</TableHead>
							<TableHead>Customer Name</TableHead>
							<TableHead>Total Amount</TableHead>
							<TableHead>Late Fee</TableHead>
							<TableHead>Interest Rate</TableHead>
							<TableHead>Due Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((row: PenaltyRecord, idx: number) => (
							<TableRow key={idx} className="hover:bg-[#F6FBFF] dark:hover:bg-neutral-900/50">
								<TableCell className="py-4">{row.contractCode}</TableCell>
								<TableCell className="py-4">{row.propertyName}</TableCell>
								<TableCell className="py-4">{row.customerName}</TableCell>
								<TableCell className="py-4">{formatCurrency(row.totalAmount)}</TableCell>
								<TableCell className="py-4">{formatCurrency(row.lateFee)}</TableCell>
								<TableCell className="py-4">{row.interestRate}</TableCell>
								<TableCell className="py-4">{formatDate(row.dueDate)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="mt-4">
				<CompactPagination page={page} pages={pages || pagination?.totalPages || pages} onPageChange={onPageChange} showRange />
			</div>
		</div>
	);
}
