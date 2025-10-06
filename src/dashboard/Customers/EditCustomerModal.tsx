import { Dialog, DialogContent } from "@/components/ui/dialog";
import CustomerForm from "./CustomerForm";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initial?: any;
	onSave?: (data: any) => void;
};

export default function EditCustomerModal({ open, onOpenChange, initial, onSave }: Props) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl">
				<CustomerForm initial={initial} onSubmit={onSave} />
			</DialogContent>
		</Dialog>
	);
}
