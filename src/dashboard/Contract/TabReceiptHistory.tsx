import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import { useNavigate } from "react-router";
import { _router } from "../../routes/_router";
import { EyeIcon, IconWrapper } from "../../assets/icons";
import { useGetContractPayments } from "@/api/contracts";
import type { ContractPaymentsResponse, CustomerContract } from "@/api/contracts";
import { formatDate } from "@/lib/utils";

type Props = { contract?: CustomerContract };

function formatCurrency(amount: number | string) {
	const n = Number(amount) || 0;
	return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function TabReceiptHistory({ contract }: Props) {
	const navigate = useNavigate();
	const contractId = contract?.id;

	const { data, isLoading, isError } = useGetContractPayments(contractId, !!contractId);

	const payments: ContractPaymentsResponse["payments"] = data?.payments ?? [];

	return (
		<>
			<CustomCard className="border-none p-0 bg-white">
				<SectionTitle title={`Payment History${contract?.contractCode ? ` — ${contract.contractCode}` : ""}`} />

				<div className="space-y-6 mt-4">
					{isLoading && <div className="text-sm text-muted-foreground">Loading payments...</div>}
					{isError && <div className="text-sm text-destructive">Failed to load payments</div>}

					{!isLoading && payments.length === 0 && <div className="text-sm text-muted-foreground">No payments found.</div>}

					{payments.map((p) => (
						<div key={p.id} className="bg-card rounded-md p-5">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<div>
									<div className="text-sm text-muted-foreground">Payment date</div>
									<div className="mt-1 text-sm">{formatDate(p.paymentDate)}</div>
								</div>
								<div className="text-right">
									<div className="text-sm text-muted-foreground">&nbsp;</div>
									<div className="mt-1 text-sm">{p.paymentNumber}</div>
								</div>

								<div>
									<div className="text-sm text-muted-foreground">Payment method</div>
									<div className="mt-1 text-sm">{p.paymentMethod}</div>
								</div>
								<div className="text-right">
									<div className="text-sm text-muted-foreground">Amount paid</div>
									<div className="mt-1 text-sm">{formatCurrency(p.amountPaid)}</div>
								</div>

								<div>
									<div className="text-sm text-muted-foreground">Receipt number</div>
									<div className="mt-1 text-sm">{p.receiptNumber}</div>
								</div>
								<div className="text-right">
									<div className="text-sm text-muted-foreground">Outstanding balance</div>
									<div className="mt-1 text-sm">{formatCurrency(p.outstandingBalance)}</div>
								</div>
							</div>

							<div className="flex items-center justify-between mt-4">
								<div />
								<div>
									<span
										className={`inline-block ${
											p.status === "PAID" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
										} rounded-md px-3 py-1 text-sm`}>
										{p.status === "PAID" ? "Payment Successful" : p.status}
									</span>
								</div>
							</div>

							<div className="mt-4">
								<button
									onClick={() => navigate(_router.dashboard.receiptDetails.replace(":id", p.receiptId))}
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
			</CustomCard>
		</>
	);
}
