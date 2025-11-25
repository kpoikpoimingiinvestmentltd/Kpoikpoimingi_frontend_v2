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
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle()}>
				<CustomerForm centeredContainer={() => "md:w-4/5 mx-auto"} initial={initial} onSubmit={onSave} />
			</DialogContent>
		</Dialog>
	);
}
