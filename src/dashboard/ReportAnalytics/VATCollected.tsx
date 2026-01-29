import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CompactPagination from "@/components/ui/compact-pagination";
import { tableHeaderRowStyle } from "../../components/common/commonStyles";
import type { VATRecord } from "@/types/reports";

interface VATCollectedProps {
	rows: VATRecord[];
	page: number;
	pages: number;
	onPageChange: (p: number) => void;
}

function formatCurrency(amount: string | number): string {
	const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
	}).format(numAmount);
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

function formatPercentage(rate: string): string {
	const numRate = parseFloat(rate);
	return `${(numRate * 100).toFixed(2)}%`;
}

export default function VATCollected({ rows, page, pages, onPageChange }: VATCollectedProps) {
	return (
		<div>
			<div>
				<h4 className="text-sm font-medium">All VAT Collected</h4>
			</div>

			<div className="overflow-x-auto w-full mt-4">
				<Table>
					<TableHeader className={tableHeaderRowStyle}>
						<TableRow>
							<TableHead>Contract Code</TableHead>
							<TableHead>Customer Name</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>VAT Amount</TableHead>
							<TableHead>VAT Rate</TableHead>
							<TableHead>Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((row: VATRecord) => (
							<TableRow key={row.id} className="hover:bg-[#F6FBFF] dark:hover:bg-neutral-900/50">
								<TableCell className="py-4">{row.contract.contractCode}</TableCell>
								<TableCell className="py-4">{row.customer.fullName}</TableCell>
								<TableCell className="py-4">{formatCurrency(row.amount)}</TableCell>
								<TableCell className="py-4">{formatCurrency(row.vatAmount)}</TableCell>
								<TableCell className="py-4">{formatPercentage(row.vatRate)}</TableCell>
								<TableCell className="py-4">{formatDate(row.createdAt)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			<div className="mt-4">
				<CompactPagination page={page} pages={pages} onPageChange={onPageChange} showRange />
			</div>
		</div>
	);
}
