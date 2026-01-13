import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import CustomInput from "@/components/base/CustomInput";
import ActionButton from "@/components/base/ActionButton";
import { inputStyle, labelStyle, modalContentStyle } from "@/components/common/commonStyles";
import { useCreatePaymentLink } from "@/api/contracts";
import { toast } from "sonner";

type Props = {
	open: boolean;
	onOpenChange: (o: boolean) => void;
	contract: Record<string, any> | undefined;
	onSuccess?: (data: { paymentLink: string; reference: string }) => void;
};

export default function GenerateCustomPaymentLinkModal({ open, onOpenChange, contract, onSuccess }: Props) {
	const [amount, setAmount] = React.useState<string>("");
	const [dueDate, setDueDate] = React.useState<string>("");
	const [remarks, setRemarks] = React.useState<string>("");

	const createCustomLinkMutation = useCreatePaymentLink(
		(data) => {
			onSuccess?.(data);
			onOpenChange(false);
			setAmount("");
			setDueDate("");
			setRemarks("");
			toast.success("Custom payment link generated successfully!");
		},
		(err) => {
			const message = (err as { message?: string })?.message ?? "Failed to create payment link";
			toast.error(message);
		}
	);

	const validate = () => {
		if (!amount || Number(amount) <= 0) {
			toast.error("Amount is required");
			return false;
		}
		if (!dueDate) {
			toast.error("Due date is required");
			return false;
		}
		if (!remarks) {
			toast.error("Remarks are required");
			return false;
		}
		return true;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!contract) {
			toast.error("Contract data missing");
			return;
		}
		if (!validate()) return;

		const payload = {
			contractId: contract.id,
			customerId: contract.customerId || (contract.customer?.id as string) || contract.customer?.id,
			amount: String(amount).replace(/,/g, ""),
			paymentMethodId: contract.paymentTypeId || contract.paymentType?.id || contract.paymentType,
			dueDate: new Date(dueDate).toISOString(),
			remarks,
		};

		createCustomLinkMutation.mutate(payload);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle("md:max-w-xl")}>
				<DialogHeader className="justify-center flex flex-row mt-2 text-center">
					<DialogTitle>Generate Custom Payment Link</DialogTitle>
					<DialogClose />
				</DialogHeader>

				<form onSubmit={handleSubmit} className="grid max-w-2xl mx-auto grid-cols-1 sm:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-5 py-4 mt-4">
					<CustomInput value={amount} onChange={(e) => setAmount(e.target.value)} required className={inputStyle} label="Amount" />
					<CustomInput type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className={inputStyle} label="Due Date" />

					<div className="col-span-2">
						<Label className={labelStyle()}>Remarks*</Label>
						<CustomInput value={remarks} onChange={(e) => setRemarks(e.target.value)} required className={inputStyle} />
					</div>

					<DialogFooter className="col-span-2 mt-5">
						<ActionButton type="submit" fullWidth className="py-3" disabled={createCustomLinkMutation.status === "pending"}>
							{createCustomLinkMutation.status === "pending" ? "Generating..." : "Generate Link"}
						</ActionButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
