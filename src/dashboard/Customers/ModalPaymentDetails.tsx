import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CustomCard from "@/components/base/CustomCard";
import KeyValueRow from "@/components/common/KeyValueRow";

type Payment = {
	date: string;
	method: string;
	amount: string;
	receipt: string;
	outstanding: string;
	penalty: string;
	status: string;
};

export default function ModalPaymentDetails({
	open,
	onOpenChange,
	payment,
}: {
	open: boolean;
	onOpenChange: (o: boolean) => void;
	payment?: Payment | null;
}) {
	if (!payment) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="md:min-w-lg lg:min-w-2xl">
				<DialogHeader>
					<DialogTitle className="text-center text-base font-medium">Payment Details</DialogTitle>
				</DialogHeader>

				<CustomCard className="px-6 py-4 max-w-full bg-card">
					<div className="grid grid-cols-1 gap-3">
						<KeyValueRow label="Payment date" value={payment.date} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Payment method" value={payment.method} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Amount payed" value={payment.amount} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Receipt number" value={payment.receipt} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							label="Outstanding balance"
							value={payment.outstanding}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow label="Penalty" value={payment.penalty} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<div className="flex items-center justify-between mt-2">
							<div />
							<div className="text-right">
								<span className="inline-block bg-green-100 text-green-700 rounded-md px-3 py-1 text-sm">{payment.status}</span>
							</div>
						</div>
					</div>
				</CustomCard>
			</DialogContent>
		</Dialog>
	);
}
