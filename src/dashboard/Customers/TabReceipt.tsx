// React import not required with the new JSX transform
import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import PaymentCard from "@/components/base/PaymentCard";
import { FileIcon } from "@/assets/icons";
// ModalPaymentDetails is not used in this tab; keep if needed in the future.
// import ModalPaymentDetails from "./ModalPaymentDetails";
import { useNavigate, useParams } from "react-router";
import { _router } from "@/routes/_router";
import { useEffect } from "react";

type Payment = { id: string; date: string };
type ContractGroup = { id: string; title: string; payments: Payment[]; totalPaid?: string };

const groups: ContractGroup[] = [
	{
		id: "c102",
		title: "Contract 102(Hire Purchase): 12 inches HP laptop",
		totalPaid: "3/6",
		payments: [
			{ id: "r1", date: "12-3-2025" },
			{ id: "r2", date: "12-3-2025" },
			{ id: "r3", date: "12-3-2025" },
			{ id: "r4", date: "12-3-2025" },
			{ id: "r5", date: "12-3-2025" },
			{ id: "r6", date: "12-3-2025" },
		],
	},
	{
		id: "c101",
		title: "Contract 101(Full Payment): 25kg gas cylinder",
		totalPaid: "1/1",
		payments: [{ id: "r7", date: "12-3-2025" }],
	},
];

export default function TabReceipt({ receipts }: { receipts?: any }) {
	const navigate = useNavigate();
	const params = useParams();
	const customerId = params.id ?? "";

	// Log the receipts response for debugging
	useEffect(() => {
		if (receipts) {
			console.log("Receipts Response Structure:", receipts);
		}
	}, [receipts]);

	const handleView = (p: Payment) => {
		// Sanitize customer id (replace spaces with hyphens) so the URL remains readable
		const safeCustomerId = (customerId ?? "").trim().replace(/\s+/g, "-");
		const path = _router.dashboard.customerDetailsReceipt.replace(":id", safeCustomerId || ":id");
		navigate(`${path}?paymentId=${encodeURIComponent(p.id)}`);
	};

	return (
		<>
			<CustomCard className="p-0 border-none bg-white">
				<SectionTitle title="Receipt" />

				<div className="space-y-8 mt-4">
					{groups.map((g) => (
						<div key={g.id}>
							<div className="flex items-center justify-between bg-[#F7F7F7] p-3 flex-wrap gap-3 rounded-sm text-sm mb-4">
								<div>{g.title}</div>
								<div className="text-sm text-muted-foreground">Total paid ({g.totalPaid})</div>
							</div>

							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
								{g.payments.map((p) => (
									<PaymentCard
										key={p.id}
										p={{ id: p.id, status: "Successful", date: p.date }}
										onView={() => handleView(p)}
										variant="icon"
										icon={<FileIcon />}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</CustomCard>
		</>
	);
}
