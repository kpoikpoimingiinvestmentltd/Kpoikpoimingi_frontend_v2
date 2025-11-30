import React from "react";
import CustomCard from "@/components/base/CustomCard";
import { IconWrapper, EditIcon } from "@/assets/icons";
import { useGetSystemSettings, useUpdateVAT, useUpdateInterest, useUpdatePenaltyInterest } from "@/api/settings";
import type { SystemSettings } from "@/api/settings";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import CustomInput from "@/components/base/CustomInput";
import ActionButton from "@/components/base/ActionButton";
import { toast } from "sonner";

export default function VatInterest() {
	const { data } = useGetSystemSettings(true);
	const [editVatOpen, setEditVatOpen] = React.useState(false);
	const [editInterestOpen, setEditInterestOpen] = React.useState(false);
	const [editPenaltyOpen, setEditPenaltyOpen] = React.useState(false);

	const [vatValue, setVatValue] = React.useState<string>("");
	const [interestValue, setInterestValue] = React.useState<string>("");
	const [penaltyValue, setPenaltyValue] = React.useState<string>("");

	React.useEffect(() => {
		const d = data as SystemSettings | undefined;
		if (d) {
			setVatValue(typeof d.vatRate === "number" ? String(d.vatRate * 100) : d.vatRate ? String(d.vatRate) : "");
			setInterestValue(typeof d.interestRate === "number" ? String(d.interestRate * 100) : d.interestRate ? String(d.interestRate) : "");
			setPenaltyValue(
				typeof d.penaltyInterestRate === "number" ? String(d.penaltyInterestRate * 100) : d.penaltyInterestRate ? String(d.penaltyInterestRate) : ""
			);
		}
	}, [data]);

	const updateVat = useUpdateVAT();
	const updateInterest = useUpdateInterest();
	const updatePenalty = useUpdatePenaltyInterest();

	const saveVat = async () => {
		try {
			const val = parseFloat(vatValue || "0");
			await updateVat.mutateAsync({ vat: val / 100 });
			toast.success("VAT updated");
			setEditVatOpen(false);
		} catch (e: unknown) {
			const errMsg = (e as Record<string, unknown>)?.message ?? "Failed to update VAT";
			toast.error(errMsg as string);
		}
	};

	const saveInterest = async () => {
		try {
			const val = parseFloat(interestValue || "0");
			await updateInterest.mutateAsync({ interest: val / 100 });
			toast.success("Interest updated");
			setEditInterestOpen(false);
		} catch (e: unknown) {
			const errMsg = (e as Record<string, unknown>)?.message ?? "Failed to update interest";
			toast.error(errMsg as string);
		}
	};

	const savePenalty = async () => {
		try {
			const val = parseFloat(penaltyValue || "0");
			await updatePenalty.mutateAsync({ interest: val / 100 });
			toast.success("Penalty interest updated");
			setEditPenaltyOpen(false);
		} catch (e: unknown) {
			const errMsg = (e as Record<string, unknown>)?.message ?? "Failed to update penalty interest";
			toast.error(errMsg as string);
		}
	};

	const row = (label: string, value: string | number | undefined, onEdit: () => void) => (
		<div className="flex items-center justify-between px-6 py-1">
			<div className="flex items-center gap-1.5">
				<span className="text-sm text-muted-foreground">{label}</span>
				<span className="font-medium text-primary">{value ?? "-"}</span>
			</div>
			<div>
				<button onClick={onEdit} className="flex items-center gap-2 bg-sky-50 text-primary px-3 py-1 rounded">
					<IconWrapper className="text-base">
						<EditIcon />
					</IconWrapper>
					<span className="text-sm">Edit</span>
				</button>
			</div>
		</div>
	);

	return (
		<div className="mt-4">
			<CustomCard className="px-0 py-2 border-0 bg-[#fafafa]">
				{(() => {
					const d = data as SystemSettings | undefined;
					return (
						<>
							{row("Customer VAT Rate:", d?.vatRate != null ? `${Number(d.vatRate) * 100}%` : "-", () => setEditVatOpen(true))}
							{row("Penalty Interest Rate:", d?.penaltyInterestRate != null ? `${Number(d.penaltyInterestRate) * 100}%` : "-", () =>
								setEditPenaltyOpen(true)
							)}
							{row("Interest Rate:", d?.interestRate != null ? `${Number(d.interestRate) * 100}%` : "-", () => setEditInterestOpen(true))}
						</>
					);
				})()}
			</CustomCard>

			{/* Edit VAT dialog */}
			<Dialog open={editVatOpen} onOpenChange={setEditVatOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Edit VAT Rate</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<CustomInput label="VAT (%)" value={vatValue} onChange={(e) => setVatValue(e.target.value)} />
					</div>
					<DialogFooter>
						<ActionButton variant="ghost" onClick={() => setEditVatOpen(false)} className="mr-2">
							Cancel
						</ActionButton>
						<ActionButton isLoading={updateVat.isPending} onClick={saveVat}>
							Save
						</ActionButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Interest dialog */}
			<Dialog open={editInterestOpen} onOpenChange={setEditInterestOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Edit Interest Rate</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<CustomInput label="Interest (%)" value={interestValue} onChange={(e) => setInterestValue(e.target.value)} />
					</div>
					<DialogFooter>
						<ActionButton variant="ghost" onClick={() => setEditInterestOpen(false)} className="mr-2">
							Cancel
						</ActionButton>
						<ActionButton isLoading={updateInterest.isPending} onClick={saveInterest}>
							Save
						</ActionButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Penalty dialog */}
			<Dialog open={editPenaltyOpen} onOpenChange={setEditPenaltyOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Edit Penalty Interest Rate</DialogTitle>
					</DialogHeader>
					<div className="py-4">
						<CustomInput label="Penalty Interest (%)" value={penaltyValue} onChange={(e) => setPenaltyValue(e.target.value)} />
					</div>
					<DialogFooter>
						<ActionButton variant="ghost" onClick={() => setEditPenaltyOpen(false)} className="mr-2">
							Cancel
						</ActionButton>
						<ActionButton isLoading={updatePenalty.isPending} onClick={savePenalty}>
							Save
						</ActionButton>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
