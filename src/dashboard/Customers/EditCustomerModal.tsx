import { Dialog, DialogContent } from "@/components/ui/dialog";
import CustomerForm from "./CustomerForm";
import { modalContentStyle } from "../../components/common/commonStyles";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initial?: unknown;
	onSave?: (data: unknown) => void;
};

export default function EditCustomerModal({ open, onOpenChange, initial, onSave }: Props) {
	const normalizedInitial = initial && typeof initial === "object" ? (initial as Record<string, unknown>) : undefined;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle()}>
				<CustomerForm
					centeredContainer={() => "md:w-4/5 mx-auto"}
					initial={normalizedInitial}
					onSubmit={onSave}
					onClose={() => onOpenChange(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}
