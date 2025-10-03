import * as React from "react";
import StatusBadge from "@/components/base/StatusBadge";
import { FileIcon } from "@/assets/icons";

type Payment = { id: string; status?: "Successful" | "Failed"; date: string };

export default function PaymentCard({
	p,
	onView,
	variant = "text",
	icon,
}: {
	p: Payment;
	onView: (p: Payment) => void;
	variant?: "text" | "icon";
	icon?: React.ReactNode;
}) {
	return (
		<div className="bg-card py-6 rounded-lg border border-dashed border-gray-200 p-3 flex flex-col gap-y-2 items-center justify-center">
			{variant === "icon" ? (
				<>
					<div className="text-3xl text-primary">{icon ?? <FileIcon />}</div>
					<div className="text-xs text-muted-foreground mt-2">{p.date}</div>
					<button type="button" onClick={() => onView(p)} className="text-xs text-primary mt-2">
						View
					</button>
				</>
			) : (
				<>
					<StatusBadge status={p.status ?? "Successful"} />
					<div className="text-xs text-muted-foreground mt-1">{p.date}</div>
					<button type="button" onClick={() => onView(p)} className="text-xs text-primary mt-2">
						View
					</button>
				</>
			)}
		</div>
	);
}

export function PaymentCardIcon(props: { p: Payment; onView: (p: Payment) => void; icon?: React.ReactNode }) {
	const { p, onView, icon } = props;
	return <PaymentCard p={p} onView={onView} variant="icon" icon={icon} />;
}
