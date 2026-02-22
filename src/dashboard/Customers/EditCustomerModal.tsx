import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import CustomerForm from "./CustomerForm";
import { modalContentStyle } from "../../components/common/commonStyles";
import { toast } from "sonner";
import React from "react";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initial?: unknown;
	documents?: unknown;
	onSave?: (data: unknown) => void;
};

export default function EditCustomerModal({ open, onOpenChange, initial, documents, onSave }: Props) {
	const normalizedInitial = initial && typeof initial === "object" ? (initial as Record<string, unknown>) : undefined;

	// Merge documents into initial data if provided
	const mergedInitial = React.useMemo(() => {
		if (!normalizedInitial) return normalizedInitial;
		if (!documents) return normalizedInitial;

		return {
			...normalizedInitial,
			mediaFiles: documents,
		};
	}, [normalizedInitial, documents]);

	// Ensure employment object exists to prevent null access errors
	const safeInitial = React.useMemo(() => {
		if (!mergedInitial) return mergedInitial;
		const initial = mergedInitial as Record<string, unknown>;
		// Ensure employment object exists with default values
		if (!initial.employment || typeof initial.employment !== "object") {
			initial.employment = { status: "", employerName: "", employerAddress: "", companyName: "", businessAddress: "", homeAddress: "" };
		}
		return initial;
	}, [mergedInitial]);

	// Check if payment type is hire purchase (installment = paymentTypeId 1)
	const isHirePurchase = (safeInitial as any)?.paymentTypeId === 1 || (safeInitial as any)?.paymentType?.id === 1;

	const handleSave = (data: unknown) => {
		toast.success("Customer details updated successfully!");
		if (onSave) {
			onSave(data);
		}
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle("px-4 md:px-8")}>
				<DialogHeader className="justify-center flex-row mt-5">
					<h2 className="text-lg font-semibold">Edit Customer</h2>
				</DialogHeader>
				<CustomerForm
					centeredContainer={() => "md:w-4/5 mx-auto"}
					initial={safeInitial}
					onSubmit={handleSave}
					onClose={() => onOpenChange(false)}
					submitButtonText="Update Customer"
					skipEmailVerification={true}
					showSignedContract={isHirePurchase}
				/>
			</DialogContent>
		</Dialog>
	);
}
