import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import CustomerForm from "./CustomerForm";
import { modalContentStyle } from "../../components/common/commonStyles";
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

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle("px-4 md:px-8")}>
				<DialogHeader className="justify-center flex-row mt-5">
					<h2 className="text-lg font-semibold">Edit Customer</h2>
				</DialogHeader>
				<CustomerForm
					centeredContainer={() => "md:w-4/5 mx-auto"}
					initial={mergedInitial}
					onSubmit={onSave}
					onClose={() => onOpenChange(false)}
					submitButtonText="Update Customer"
				/>
			</DialogContent>
		</Dialog>
	);
}
