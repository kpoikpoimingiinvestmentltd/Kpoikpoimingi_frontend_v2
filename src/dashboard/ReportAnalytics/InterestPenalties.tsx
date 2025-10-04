import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CompactPagination from "@/components/ui/compact-pagination";
import { tableHeaderRowStyle } from "../../components/common/commonStyles";

interface InterestProps {
	rows: Array<any>;
	page: number;
	pages: number;
	onPageChange: (p: number) => void;
}

export default function InterestPenalties({ rows, page, pages, onPageChange }: InterestProps) {
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
						{rows.map((row: any, idx: number) => (
							<TableRow key={idx} className="hover:bg-[#F6FBFF]">
								<TableCell className="text-[#13121266] py-4">{row.contractCode}</TableCell>
								<TableCell className="text-[#13121266] py-4">{row.propertyName}</TableCell>
								<TableCell className="text-[#13121266] py-4">{row.customerName}</TableCell>
								<TableCell className="text-[#13121266] py-4">{row.totalAmount}</TableCell>
								<TableCell className="text-[#13121266] py-4">{row.lateFee}</TableCell>
								<TableCell className="text-[#13121266] py-4">{row.interestRate}</TableCell>
								<TableCell className="text-[#13121266] py-4">{row.dueDate}</TableCell>
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
