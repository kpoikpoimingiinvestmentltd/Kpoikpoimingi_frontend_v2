import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import { useNavigate } from "react-router";
import { _router } from "../../routes/_router";
import { EyeIcon, IconWrapper } from "../../assets/icons";

type Payment = { id: string; status?: "Successful" | "Failed"; date: string };
type ContractGroup = { id: string; title: string; payments: Payment[] };

const groups: ContractGroup[] = [
	{
		id: "c102",
		title: "Contract 102 (Hire Purchase): 12 inches HP laptop",
		payments: [
			{ id: "p1", status: "Successful", date: "12-3-2025" },
			{ id: "p2", status: "Failed", date: "12-3-2025" },
			{ id: "p3", status: "Successful", date: "12-3-2025" },
			{ id: "p4", status: "Successful", date: "12-3-2025" },
			{ id: "p5", status: "Successful", date: "12-3-2025" },
			{ id: "p6", status: "Successful", date: "12-3-2025" },
			{ id: "p7", status: "Failed", date: "12-3-2025" },
			{ id: "p8", status: "Successful", date: "12-3-2025" },
			{ id: "p9", status: "Successful", date: "12-3-2025" },
			{ id: "p10", status: "Successful", date: "12-3-2025" },
		],
	},
	{
		id: "c101",
		title: "Contract 101(Full Payment): 25kg gas cylinder",
		payments: [{ id: "p11", status: "Successful", date: "12-3-2025" }],
	},
];

export default function TabReceiptHistory({ contract }: { contract?: any }) {
	console.log(contract);
	const navigate = useNavigate();

	return (
		<>
			<CustomCard className="border-none p-0 bg-white">
				<SectionTitle title="Payment History" />

				<div className="space-y-6 mt-4">
					{groups.map((g) => (
						<div key={g.id}>
							<div className="flex items-center justify-between mb-3">
								<div className="text-sm font-medium">{g.title}</div>
								<div className="text-sm text-muted-foreground">Total payed (1/6)</div>
							</div>

							<div className="space-y-6">
								{g.payments.map((p) => (
									<div key={p.id} className="bg-card rounded-md p-5">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											<div>
												<div className="text-sm text-muted-foreground">Payment date</div>
												<div className="mt-1 text-sm">{p.date}</div>
											</div>
											<div className="text-right">
												<div className="text-sm text-muted-foreground">&nbsp;</div>
												<div className="mt-1 text-sm">{p.date}</div>
											</div>

											<div>
												<div className="text-sm text-muted-foreground">Payment method</div>
												<div className="mt-1 text-sm">Link</div>
											</div>
											<div className="text-right">
												<div className="text-sm text-muted-foreground">Amount payed</div>
												<div className="mt-1 text-sm">30,000</div>
											</div>

											<div>
												<div className="text-sm text-muted-foreground">Receipt number</div>
												<div className="mt-1 text-sm">0-54738376</div>
											</div>
											<div className="text-right">
												<div className="text-sm text-muted-foreground">Outstanding balance</div>
												<div className="mt-1 text-sm">340,000</div>
											</div>
										</div>

										<div className="flex items-center justify-between mt-4">
											<div />
											<div>
												<span
													className={`inline-block ${
														p.status === "Successful" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
													} rounded-md px-3 py-1 text-sm`}>
													{p.status === "Successful" ? "Payment Successful" : "Payment Failed"}
												</span>
											</div>
										</div>

										<div className="mt-4">
											<button
												onClick={() => navigate(_router.dashboard.contractReceipt.replace(":id", p.id))}
												className="w-full bg-[#E6F7FF] flex items-center gap-2 justify-center text-sm text-primary py-3 rounded-md">
												<span> View Receipt</span>
												<IconWrapper>
													<EyeIcon />
												</IconWrapper>
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</CustomCard>
		</>
	);
}
