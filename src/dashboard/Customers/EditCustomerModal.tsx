import { Dialog, DialogContent } from "@/components/ui/dialog";
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
			<DialogContent className={modalContentStyle()}>
				<CustomerForm centeredContainer={() => "md:w-4/5 mx-auto"} initial={mergedInitial} onSubmit={onSave} onClose={() => onOpenChange(false)} />
			</DialogContent>
		</Dialog>
	);
}
