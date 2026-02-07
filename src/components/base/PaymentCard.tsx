import * as React from "react";
import StatusBadge from "@/components/base/StatusBadge";
import { FileIcon } from "@/assets/icons";
import { formatDate } from "@/lib/utils";

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
		<div className="bg-card py-6 rounded-lg border border-dashed border-gray-200 dark:border-gray-600 p-3 flex flex-col items-center gap-y-2 text-center justify-center">
			{variant === "icon" ? (
				<>
					<div className="text-3xl text-primary">{icon ?? <FileIcon />}</div>
					<div className="text-xs text-muted-foreground mt-2">
						{formatDate(p.date, {
							year: "numeric",
							month: "short",
							day: "2-digit",
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
							hour12: true,
						})}
					</div>
					<button type="button" onClick={() => onView(p)} className="text-xs text-primary mt-2">
						View
					</button>
				</>
			) : (
				<>
					<StatusBadge status={p.status ?? "Successful"} />
					<div className="text-xs text-muted-foreground mt-1">
						{formatDate(p.date, {
							year: "numeric",
							month: "short",
							day: "2-digit",
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
							hour12: true,
						})}
					</div>
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
