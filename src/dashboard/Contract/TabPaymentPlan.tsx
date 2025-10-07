import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import ActionButton from "@/components/base/ActionButton";
import Badge from "@/components/base/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const rows = [
	{ date: "12-3-2025", amount: "300,000", status: "Paid", link: null },
	{ date: "12-3-2025", amount: "300,000", status: "Incomplete", link: null },
	{ date: "12-3-2025", amount: "300,000", status: "Pending", link: null },
	{ date: "12-3-2025", amount: "300,000", status: "Pending", link: null },
	{ date: "12-3-2025", amount: "300,000", status: "Pending", link: null },
];

export default function TabPaymentPlan() {
	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<SectionTitle title="Payment Plan & Schedule" />

			<CustomCard className="mt-6 p-6 bg-card">
				<div className="mb-4 text-sm">
					Payment for : <span className="font-medium">12 inches HP laptop</span>
				</div>

				<div className="overflow-x-auto">
					<Table>
						<TableHeader className="[&_tr]:border-0">
							<TableRow className="bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
								<TableHead>Date</TableHead>
								<TableHead>Amount Paid</TableHead>
								<TableHead>Payment Link</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{rows.map((r, i) => (
								<TableRow key={i} className="hover:bg-[#F6FBFF]">
									<TableCell className="py-6">{r.date}</TableCell>
									<TableCell className="py-6">{r.amount}</TableCell>
									<TableCell className="py-6">
										{r.status === "Paid" ? (
											<div className="flex items-center gap-2 text-emerald-600">
												<Badge value="Paid" size="sm" />
											</div>
										) : r.status === "Incomplete" ? (
											<div className="flex items-center gap-3">
												<span className="text-amber-500">Incomplete Payment</span>
												<button className="text-primary">Generate Link</button>
											</div>
										) : (
											<button className="text-primary">Generate Link</button>
										)}
									</TableCell>
								</TableRow>
							))}

							<TableRow>
								<TableCell className="py-4"></TableCell>
								<TableCell className="py-4 font-medium">Total: 300,000</TableCell>
								<TableCell />
							</TableRow>
						</TableBody>
					</Table>
				</div>

				<div className="mt-6">
					<ActionButton variant="primary" className="w-full max-w-md mx-auto">
						Generate Custom Payment Link
					</ActionButton>
					<p className="text-xs text-muted-foreground text-center mt-2">
						Clicking on custom payment link, you can generate payment link to cover all or more than one part of the payment
					</p>
				</div>
			</CustomCard>
		</CustomCard>
	);
}
