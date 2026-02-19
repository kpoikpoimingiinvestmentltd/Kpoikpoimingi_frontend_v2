import React from "react";
import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import ModalPaymentDetails from "./ModalPaymentDetails";
import PaymentCard from "@/components/base/PaymentCard";
import type { PaymentDto, ApiPaymentItem, ApiContractPayments } from "@/types/payment";
import { FileIcon } from "@/assets/icons";
import { useGetCustomerPayments } from "@/api/customer";

export default function TabPaymentHistory({ payments, customerId }: { payments?: PaymentDto[] | undefined; customerId?: string }) {
	const [selected, setSelected] = React.useState<ApiPaymentItem | null>(null);
	const [open, setOpen] = React.useState(false);

	const { data: allPayments } = useGetCustomerPayments(customerId, !!customerId);

	const handleView = (p: ApiPaymentItem) => {
		const allPaymentsData = allPayments as Record<string, unknown> | undefined;
		if (allPayments && allPaymentsData?.payments) {
			const groups = allPaymentsData.payments as ApiContractPayments[];
			for (const grp of groups) {
				const found = (grp.payments ?? []).find((it) => it.id === p.id);
				if (found) {
					setSelected(found as ApiPaymentItem);
					setOpen(true);
					return;
				}
			}
		}

		// fallback to provided object
		setSelected(p);
		setOpen(true);
	};

	const buildPaymentDetails = (p: ApiPaymentItem) => {
		const date = p.createdAt ?? ((p as Record<string, unknown>).date as string) ?? "";
		const method = p.paymentMethod ? (p.paymentMethod === "PAYMENT_LINK" ? "Payment Link" : p.paymentMethod) : "-";
		const amount = p.amount ? Number(p.amount).toLocaleString() : "-";
		const receipt = p.receiptNumber ?? "-";
		const outstanding = p.outStandingBalance ?? p.outstandingBalance ?? "-";
		const status = p.status === "PAID" || p.status === "SUCCESS" ? "Payment Successful" : "Payment Failed";

		return {
			date: date ? new Date(date as string).toLocaleString() : "-",
			method,
			amount,
			receipt,
			outstanding: outstanding !== "-" ? Number(outstanding).toLocaleString() : "-",
			penalty: "0",
			status,
		};
	};

	return (
		<>
			<CustomCard className="border-none p-0 bg-white">
				<SectionTitle title="Payment History" />

				<div className="space-y-8 mt-4">
					{Array.isArray((payments as unknown as Record<string, unknown>)?.payments) &&
					((payments as unknown as Record<string, unknown>).payments as unknown[]).length > 0 ? (
						((payments as unknown as Record<string, unknown>).payments as ApiContractPayments[]).map((grp: ApiContractPayments) => {
							const title = `${grp.contractCode ?? grp.contractId ?? "Contract"} — ${grp.propertyName ?? ""}`;
							return (
								<div key={grp.contractId ?? grp.contractCode ?? title}>
									<div className="bg-[#F7F7F7] dark:bg-neutral-700 p-3 rounded-sm text-sm mb-4">{title}</div>
									<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
										{Array.isArray(grp.payments) && grp.payments.length > 0 ? (
											grp.payments.map((p) => (
												<PaymentCard
													key={p.id}
													p={{ id: p.id, status: p.status === "PAID" || p.status === "SUCCESS" ? "Successful" : "Failed", date: p.createdAt ?? "" }}
													onView={(_: unknown) => handleView(p)}
													icon={<FileIcon />}
												/>
											))
										) : (
											<div className="text-sm text-muted-foreground">No payments for this contract.</div>
										)}
									</div>
								</div>
							);
						})
					) : (
						<div className="text-sm text-muted-foreground">No payment records found.</div>
					)}
				</div>
			</CustomCard>

			<ModalPaymentDetails open={open} onOpenChange={setOpen} payment={selected ? buildPaymentDetails(selected) : null} />
		</>
	);
}
