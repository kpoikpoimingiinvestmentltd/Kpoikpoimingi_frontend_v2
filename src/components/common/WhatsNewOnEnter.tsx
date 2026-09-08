import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { modalContentStyle } from "@/components/common/commonStyles";
import { PRODUCT_UPDATES } from "@/config/productUpdates";
import {
	hasUnseenUpdates,
	markUpdatesSeen,
} from "@/services/productUpdatesPersistence";

function formatDisplayDate(isoDate: string) {
	const d = new Date(`${isoDate}T12:00:00`);
	if (Number.isNaN(d.getTime())) return isoDate;
	return d.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

/**
 * Shows once when staff enter the dashboard after a new product update ships.
 */
export default function WhatsNewOnEnter() {
	const userId = useSelector((state: RootState) => state.auth.id);
	const [open, setOpen] = useState(false);

	const latest = useMemo(() => PRODUCT_UPDATES[0] ?? null, []);

	useEffect(() => {
		if (!userId || !latest) return;
		if (!hasUnseenUpdates(userId)) return;

		const t = window.setTimeout(() => setOpen(true), 400);
		return () => window.clearTimeout(t);
	}, [userId, latest]);

	const dismiss = () => {
		markUpdatesSeen(userId, latest?.id);
		setOpen(false);
	};

	if (!latest) return null;

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) dismiss();
				else setOpen(true);
			}}>
			<DialogContent className={modalContentStyle("md:max-w-lg")}>
				<DialogHeader className="text-left space-y-2 pt-2">
					<p className="text-xs font-medium uppercase tracking-wide text-primary">
						What’s new · {formatDisplayDate(latest.date)}
					</p>
					<DialogTitle className="text-xl font-semibold leading-snug">
						{latest.title}
					</DialogTitle>
				</DialogHeader>

				<div className="mt-2 space-y-4 text-sm text-slate-600 dark:text-slate-300">
					<p className="leading-relaxed">{latest.summary}</p>
					{latest.bullets && latest.bullets.length > 0 ? (
						<ul className="space-y-2.5 border-l-2 border-primary/40 pl-4">
							{latest.bullets.map((item) => (
								<li key={item} className="leading-relaxed">
									{item}
								</li>
							))}
						</ul>
					) : null}
				</div>

				<DialogFooter className="mt-6 sm:justify-end">
					<Button
						type="button"
						className="bg-primary hover:bg-primary/90 text-white rounded-sm h-11 px-6 w-full sm:w-auto"
						onClick={dismiss}>
						Got it
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
