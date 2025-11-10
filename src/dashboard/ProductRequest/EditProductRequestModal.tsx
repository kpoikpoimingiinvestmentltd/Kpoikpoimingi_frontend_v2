import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import CustomerForm from "../Customers/CustomerForm";
import { modalContentStyle } from "../../components/common/commonStyles";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initial?: any;
	onSave?: (data: any) => void;
};

export default function EditProductRequest({ open, onOpenChange, initial, onSave }: Props) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle()}>
				<DialogHeader className="justify-center flex-row mt-5">
					<h2 className="text-lg font-semibold">Edit Request Product</h2>
				</DialogHeader>
				<CustomerForm initial={initial} onSubmit={onSave} centeredContainer={() => "w-5/6 mx-auto"} />
			</DialogContent>
		</Dialog>
	);
}
