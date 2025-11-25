// React import not required with the new JSX transform
import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import PaymentCard from "@/components/base/PaymentCard";
import { FileIcon } from "@/assets/icons";
import type { ReceiptDto } from "@/types/receipt";
import { useNavigate, useParams } from "react-router";
import { _router } from "@/routes/_router";
import { useEffect } from "react";

// type Payment = { id: string; date: string };

type ApiReceiptItem = {
	id: string;
	receiptNumber?: string;
	paymentDate?: string;
	vatAmount?: string | number;
	totalAmount?: string | number;
	paymentType?: string;
	amountPaid?: string | number;
	paymentMethod?: string;
	status?: string;
	createdAt?: string;
};

type ApiContractReceipts = {
	contractId?: string;
	contractCode?: string;
	propertyName?: string;
	propertyPrice?: string | number;
	receipts?: ApiReceiptItem[];
};

export default function TabReceipt({ receipts }: { receipts?: ReceiptDto[] | undefined }) {
	const navigate = useNavigate();
	const params = useParams();
	const customerId = params.id ?? "";

	// Log the receipts response for debugging
	useEffect(() => {
		if (receipts) {
			console.log("Receipts Response Structure:", receipts);
		}
	}, [receipts]);

	const handleView = (p: ApiReceiptItem) => {
		const safeCustomerId = (customerId ?? "").trim().replace(/\s+/g, "-");
		const path = _router.dashboard.customerDetailsReceipt.replace(":id", safeCustomerId || ":id");
		navigate(`${path}?receiptId=${encodeURIComponent(p.id)}`);
	};

	return (
		<>
			<CustomCard className="p-0 border-none bg-white">
				<SectionTitle title="Receipt" />

				<div className="space-y-8 mt-4">
					{Array.isArray((receipts as any)?.receipts) && (receipts as any).receipts.length > 0 ? (
						(receipts as any).receipts.map((grp: ApiContractReceipts) => {
							const title = `${grp.contractCode ?? grp.contractId ?? "Contract"} — ${grp.propertyName ?? ""}`;
							const total = grp.propertyPrice ? Number(grp.propertyPrice).toLocaleString() : "-";
							return (
								<div key={grp.contractId ?? grp.contractCode ?? title}>
									<div className="flex items-center justify-between bg-[#F7F7F7] p-3 flex-wrap gap-3 rounded-sm text-sm mb-4">
										<div>
											<div className="font-medium">{title}</div>
											<div className="text-xs text-muted-foreground">Price: {total}</div>
										</div>
										<div className="text-sm text-muted-foreground">Total receipts ({grp.receipts ? grp.receipts.length : 0})</div>
									</div>

									<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
										{Array.isArray(grp.receipts) && grp.receipts.length > 0 ? (
											grp.receipts.map((r) => (
												<PaymentCard
													key={r.id}
													p={{
														id: r.id,
														status: r.status === "PAID" || r.status === "SUCCESS" ? "Successful" : "Failed",
														date: r.paymentDate ?? r.createdAt ?? "",
													}}
													onView={() => handleView(r)}
													variant="icon"
													icon={<FileIcon />}
												/>
											))
										) : (
											<div className="text-sm text-muted-foreground">No receipts for this contract.</div>
										)}
									</div>
								</div>
							);
						})
					) : (
						<div className="text-sm text-muted-foreground">No receipt records found.</div>
					)}
				</div>
			</CustomCard>
		</>
	);
}
