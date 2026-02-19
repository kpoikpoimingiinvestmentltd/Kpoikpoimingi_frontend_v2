import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import Badge from "@/components/base/Badge";
import { useNavigate } from "react-router";
import { _router } from "../../routes/_router";
import { EyeIcon, IconWrapper } from "../../assets/icons";
import { useGetContractPayments } from "@/api/contracts";
import type { ContractPaymentsResponse, CustomerContract } from "@/api/contracts";
import { formatDate } from "@/lib/utils";

type Props = { contract?: CustomerContract };

type ValueRowProps = {
	label: string;
	value: React.ReactNode;
	align?: "left" | "right";
};

function ValueRow({ label, value, align = "left" }: ValueRowProps) {
	return (
		<div className={align === "right" ? "text-right" : ""}>
			<div className="text-[.8rem] text-muted-foreground">{label}</div>
			<div className="mt-1 text-sm">{value}</div>
		</div>
	);
}

function formatCurrency(amount: number | string) {
	const n = Number(amount) || 0;
	return n.toLocaleString();
}

export default function TabReceiptHistory({ contract }: Props) {
	const navigate = useNavigate();
	const contractId = contract?.id;

	const { data, isLoading, isError } = useGetContractPayments(contractId, !!contractId);

	const payments: ContractPaymentsResponse["payments"] = data?.payments ?? [];

	return (
		<>
			<CustomCard className="border-none p-0 bg-white">
				<SectionTitle title={`Payment History${payments.length > 0 && contract?.contractCode ? ` — ${contract.contractCode}` : ""}`} />

				<div className="space-y-6 mt-4">
					{isLoading && <div className="text-sm text-muted-foreground">Loading payments...</div>}
					{isError && <div className="text-sm text-destructive">Failed to load payments</div>}

					{!isLoading && payments.length === 0 && <div className="text-sm text-muted-foreground">No payments found.</div>}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{payments.map((p) => (
							<div key={p.id} className="bg-card rounded-md p-5">
								<div className="grid grid-cols-1 gap-3">
									<div className="grid grid-cols-2 gap-3">
										<ValueRow label="Payment Number" value={<span className="font-medium">{p.paymentNumber}</span>} />
										<ValueRow label="Amount Paid" value={<span className="font-medium">₦{formatCurrency(p.amountPaid)}</span>} align="right" />
									</div>

									<div className="grid grid-cols-2 gap-3">
										<ValueRow label="Payment Date" value={formatDate(p.paymentDate)} />
										<ValueRow label="Payment Method" value={p.paymentMethod.replace("_", " ")} align="right" />
									</div>

									<div className="grid grid-cols-2 gap-3">
										<ValueRow label="Receipt Number" value={p.receiptNumber} />
										<ValueRow label="Outstanding Balance" value={`₦${formatCurrency(p.outstandingBalance)}`} align="right" />
									</div>

									<div className="grid grid-cols-2 gap-3">
										<ValueRow label="Reference" value={p.reference} />
										<div className="text-right">
											<div className="text-sm text-muted-foreground">Status</div>
											<div className="mt-1">
												<Badge
													value={p.status}
													status={p.status === "PAID" ? "success" : "warning"}
													size="sm"
													label={p.status === "PAID" ? "Payment Successful" : p.status}
												/>
											</div>
										</div>
									</div>
								</div>

								<div className="mt-4">
									<button
										onClick={() => navigate(_router.dashboard.receiptDetails.replace(":id", p.receiptId))}
										className="w-full bg-[#E6F7FF] dark:bg-primary dark:text-white flex items-center gap-2 justify-center text-sm text-primary py-3 rounded-md">
										<span>View Receipt</span>
										<IconWrapper>
											<EyeIcon />
										</IconWrapper>
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</CustomCard>
		</>
	);
}
