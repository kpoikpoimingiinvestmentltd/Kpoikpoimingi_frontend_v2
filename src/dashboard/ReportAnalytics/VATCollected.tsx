import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CompactPagination from "@/components/ui/compact-pagination";
import { tableHeaderRowStyle } from "../../components/common/commonStyles";

interface VATCollectedProps {
	rows: Array<any>;
	page: number;
	pages: number;
	onPageChange: (p: number) => void;
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
							<TableHead>Customer Name</TableHead>
							<TableHead>Property Name</TableHead>
							<TableHead>Payment Method</TableHead>
							<TableHead>Payment Type</TableHead>
							<TableHead>Total Amount</TableHead>
							<TableHead>VAT Collected</TableHead>
							<TableHead>VAT Rate</TableHead>
							<TableHead>Date</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((row: any, idx: number) => (
							<TableRow key={idx} className="hover:bg-[#F6FBFF]">
								<TableCell className="text-[#13121266] py-4">{row.customerName}</TableCell>
								<TableCell className="text-[#13121266] py-4">{row.propertyName}</TableCell>
								<TableCell className="text-[#13121266] py-4">{row.paymentMethod}</TableCell>
								<TableCell className="text-[#13121266] py-4">{row.paymentType}</TableCell>
								<TableCell className="text-[#13121266] py-4">{row.totalAmount}</TableCell>
								<TableCell className="text-[#13121266] py-4">{row.vatCollected}</TableCell>
								<TableCell className="text-[#13121266] py-4">{row.vatRate}</TableCell>
								<TableCell className="text-[#13121266] py-4">{row.date}</TableCell>
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
