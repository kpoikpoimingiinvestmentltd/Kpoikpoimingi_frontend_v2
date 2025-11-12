import React from "react";
import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import ModalPaymentDetails from "./ModalPaymentDetails";
import PaymentCard from "@/components/base/PaymentCard";
import { FileIcon } from "@/assets/icons";

type Payment = { id: string; status?: "Successful" | "Failed"; date: string };
type ContractGroup = { id: string; title: string; payments: Payment[] };

const groups: ContractGroup[] = [
	{
		id: "c102",
		title: "Contract 102 (Hire Purchase): 12 inches HP laptop",
		payments: [
			{ id: "p1", status: "Successful", date: "12-3-2025" },
			{ id: "p2", status: "Failed", date: "12-3-2025" },
			{ id: "p3", status: "Successful", date: "12-3-2025" },
			{ id: "p4", status: "Successful", date: "12-3-2025" },
			{ id: "p5", status: "Successful", date: "12-3-2025" },
			{ id: "p6", status: "Successful", date: "12-3-2025" },
			{ id: "p7", status: "Failed", date: "12-3-2025" },
			{ id: "p8", status: "Successful", date: "12-3-2025" },
			{ id: "p9", status: "Successful", date: "12-3-2025" },
			{ id: "p10", status: "Successful", date: "12-3-2025" },
		],
	},
	{
		id: "c101",
		title: "Contract 101(Full Payment): 25kg gas cylinder",
		payments: [{ id: "p11", status: "Successful", date: "12-3-2025" }],
	},
];

export default function TabPaymentHistory({ payments }: { payments?: any }) {
	const [selected, setSelected] = React.useState<Payment | null>(null);
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		if (payments) {
			console.log("Payments Response Structure:", payments);
		}
	}, [payments]);

	const handleView = (p: Payment) => {
		setSelected(p);
		setOpen(true);
	};

	const buildPaymentDetails = (p: Payment) => {
		return {
			date: p.date,
			method: "Paystack",
			amount: "30,000",
			receipt: "0-54738376",
			outstanding: "340,000",
			penalty: "0",
			status: p.status === "Successful" ? "Payment Successful" : "Payment Failed",
		};
	};

	return (
		<>
			<CustomCard className="border-none p-0 bg-white">
				<SectionTitle title="Payment History" />

				<div className="space-y-8 mt-4">
					{groups.map((g) => (
						<div key={g.id}>
							<div className="bg-[#F7F7F7] p-3 rounded-sm text-sm mb-4">{g.title}</div>
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-4">
								{g.payments.map((p) => (
									<PaymentCard key={p.id} p={p} onView={handleView} icon={<FileIcon />} />
								))}
							</div>
						</div>
					))}
				</div>
			</CustomCard>

			<ModalPaymentDetails open={open} onOpenChange={setOpen} payment={selected ? buildPaymentDetails(selected) : null} />
		</>
	);
}
