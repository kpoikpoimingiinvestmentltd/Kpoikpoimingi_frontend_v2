import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import CustomerForm from "../Customers/CustomerForm";
import { modalContentStyle } from "../../components/common/commonStyles";
import React from "react";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initial?: Record<string, unknown>;
	onSave?: (data: unknown) => void;
};

export default function EditProductRequest({ open, onOpenChange, initial, onSave }: Props) {
	const normalizedInitial = React.useMemo(() => {
		if (!initial || typeof initial !== "object") return initial;
		const init = initial as Record<string, unknown>;

		const gArr: unknown[] | undefined =
			(init.guarantors as unknown[] | undefined) ??
			((init.customer as Record<string, unknown> | undefined)?.guarantors as unknown[] | undefined) ??
			(init.guarantor as unknown[] | undefined);

		if (!Array.isArray(gArr) || gArr.length === 0) return initial;

		const mapped = [0, 1].map((i) => {
			const src = (gArr[i] || {}) as Record<string, unknown>;
			return {
				fullName: (src.fullName as string) || "",
				occupation: (src.occupation as string) || "",
				phone: (src.phoneNumber as string) || (src.phone as string) || "",
				email: (src.email as string) || "",
				employmentStatus: (src.employmentStatus as string) || (src.employmentStatusId as string) || "",
				homeAddress: (src.homeAddress as string) || (src.address as string) || "",
				businessAddress: (src.companyAddress as string) || (src.businessAddress as string) || "",
				stateOfOrigin: (src.stateOfOrigin as string) || "",
				votersUploaded: (src.votersUploaded as number) || 0,
				hasAgreed: Boolean(src.hasAgreed ?? false),
			};
		});

		return { ...init, guarantors: mapped } as Record<string, unknown>;
	}, [initial]);

	const forceInstallment = React.useMemo(() => {
		if (!initial || typeof initial !== "object") return false;
		const init = initial as Record<string, unknown>;
		return Boolean(init.guarantors) || Boolean((init.customer as Record<string, unknown> | undefined)?.guarantors) || Boolean(init.guarantor);
	}, [initial]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle("px-4 md:px-8")}>
				<DialogHeader className="justify-center flex-row mt-5">
					<h2 className="text-lg font-semibold">Edit Product Request</h2>
				</DialogHeader>
				<CustomerForm
					initial={normalizedInitial}
					onSubmit={onSave}
					centeredContainer={() => "mx-auto w-full md:w-3/4"}
					paymentMethod={forceInstallment ? "installment" : undefined}
				/>
			</DialogContent>
		</Dialog>
	);
}
