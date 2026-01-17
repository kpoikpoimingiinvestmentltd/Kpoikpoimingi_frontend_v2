import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ActionButton from "@/components/base/ActionButton";
import CustomInput from "@/components/base/CustomInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useUpdateContract } from "@/api/contracts";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import type { CustomerContract } from "@/api/contracts";
import { modalContentStyle, labelStyle, selectTriggerStyle, radioStyle } from "@/components/common/commonStyles";
import { CalendarIcon } from "@/assets/icons";
import ContractSuccessModal from "@/dashboard/Contract/ContractSuccessModal";

type Props = {
	isOpen: boolean;
	onClose: () => void;
	contract: CustomerContract | null;
};

export default function EditContractModal({ isOpen, onClose, contract }: Props) {
	const queryClient = useQueryClient();
	const [showSuccessModal, setShowSuccessModal] = React.useState(false);
	const [generatedLink, setGeneratedLink] = React.useState<string>("");

	const [formData, setFormData] = React.useState({
		remarks: "",
		downPayment: "",
		startDate: "",
		intervalId: "",
		durationValue: "",
		durationUnitId: "",
		paymentMethod: "link",
	});

	// Determine if this is a hire purchase (paymentTypeId === 1) or full payment (paymentTypeId === 2)
	const isHirePurchase = contract?.paymentTypeId === 1;

	React.useEffect(() => {
		if (contract && isOpen) {
			// Convert ISO date string to YYYY-MM-DD format for date input
			const formatDateForInput = (dateString: string | null) => {
				if (!dateString) return "";
				const date = new Date(dateString);
				const year = date.getUTCFullYear();
				const month = String(date.getUTCMonth() + 1).padStart(2, "0");
				const day = String(date.getUTCDate()).padStart(2, "0");
				return `${year}-${month}-${day}`;
			};

			setFormData({
				remarks: contract.remarks || "",
				downPayment: contract.downPayment || "",
				startDate: formatDateForInput(contract.startDate),
				intervalId: contract.intervalId ? String(contract.intervalId) : "",
				durationValue: contract.durationValue ? String(contract.durationValue) : "",
				durationUnitId: contract.durationUnitId ? String(contract.durationUnitId) : "",
				paymentMethod: "link",
			});
		}
	}, [contract, isOpen]);

	const updateMutation = useUpdateContract(
		(response) => {
			const message = (response as { message?: string })?.message ?? "Contract updated successfully";
			toast.success(message);

			// If a payment link was generated, show it in the success modal
			const downPaymentLink = (response as { downPaymentLink?: string })?.downPaymentLink;
			if (downPaymentLink) {
				setGeneratedLink(downPaymentLink);
				setShowSuccessModal(true);
			}

			onClose();
			queryClient.invalidateQueries({ queryKey: ["contract", contract?.id] });
		},
		(err) => {
			const message = extractErrorMessage(err, "Failed to update contract");
			toast.error(message);
		}
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (name: string, value: string) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async () => {
		if (!contract) return;

		try {
			const payload: Record<string, unknown> = {};

			if (formData.remarks) payload.remarks = formData.remarks;
			if (formData.downPayment) payload.downPayment = formData.downPayment;
			if (formData.startDate) payload.startDate = formData.startDate;

			if (isHirePurchase) {
				if (formData.intervalId) payload.intervalId = formData.intervalId;
				if (formData.durationValue) payload.durationValue = formData.durationValue;
				if (formData.durationUnitId) payload.durationUnitId = formData.durationUnitId;
			} else {
				// For full payment, include isCash flag if payment method is being changed
				payload.isCash = formData.paymentMethod === "cash";
			}

			updateMutation.mutate({
				id: contract.id,
				payload,
			});
		} catch (err: unknown) {
			const message = extractErrorMessage(err, "Failed to update contract");
			toast.error(message);
		}
	};

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className={modalContentStyle("md:max-w-3xl")}>
					<DialogHeader>
						<DialogTitle>Edit Contract Details</DialogTitle>
					</DialogHeader>

					{contract && (
						<form className="grid max-w-2xl mx-auto grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-5 py-4">
							{/* Full Name (Disabled) */}
							<div className="w-full">
								<Label className={labelStyle()}>Full Name</Label>
								<CustomInput value={contract.customer.fullName} disabled />
							</div>

							{/* Property Name (Disabled) */}
							<div className="w-full">
								<Label className={labelStyle()}>Property Name</Label>
								<CustomInput value={contract.property.name} disabled />
							</div>

							{isHirePurchase ? (
								<>
									{/* Payment Type (Disabled) */}
									<div className="w-full">
										<Label className={labelStyle()}>Payment Type</Label>
										<CustomInput value={contract.paymentType.type} disabled />
									</div>

									{/* Whatsapp Number (Disabled) */}
									<div className="w-full">
										<Label className={labelStyle()}>Whatsapp Number</Label>
										<CustomInput value={contract.customer.phoneNumber} disabled />
									</div>

									{/* Down Payment */}
									<div className="col-span-full">
										<CustomInput
											label="Down Payment"
											type="number"
											name="downPayment"
											value={formData.downPayment}
											onChange={handleInputChange}
											placeholder="Enter down payment"
										/>
									</div>
									{/* Payment Method */}
									<div className="w-full md:col-span-2">
										<Label className={labelStyle()}>Payment Method</Label>
										<RadioGroup
											value={formData.paymentMethod}
											onValueChange={(value) => handleSelectChange("paymentMethod", value)}
											className="flex items-center gap-6 mt-2">
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="link" id="edit-link-hire" className={radioStyle} />
												<Label htmlFor="edit-link-hire" className="text-sm cursor-pointer">
													Generate Payment Link
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="cash" id="edit-cash-hire" className={radioStyle} />
												<Label htmlFor="edit-cash-hire" className="text-sm cursor-pointer">
													Cash Payment
												</Label>
											</div>
										</RadioGroup>
									</div>
									{/* Payment Interval */}
									<div className="w-full">
										<Label className={labelStyle()}>Payment Interval*</Label>
										<Select value={formData.intervalId} onValueChange={(value) => handleSelectChange("intervalId", value)}>
											<SelectTrigger className={selectTriggerStyle()}>
												<SelectValue placeholder="Select interval" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="1">Weekly</SelectItem>
												<SelectItem value="2">Monthly</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* Duration Unit */}
									<div className="w-full">
										<Label className={labelStyle()}>Duration Unit*</Label>
										<Select value={formData.durationUnitId} onValueChange={(value) => handleSelectChange("durationUnitId", value)}>
											<SelectTrigger className={selectTriggerStyle()}>
												<SelectValue placeholder="Select unit" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="1">Days</SelectItem>
												<SelectItem value="2">Months</SelectItem>
												<SelectItem value="3">Years</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* Duration Value */}
									<div className="w-full">
										<Label className={labelStyle()}>
											{(() => {
												const isWeekly = formData.intervalId === "1";
												return isWeekly ? "For How Many Weeks*" : "For How Many Months*";
											})()}
										</Label>
										<Select value={formData.durationValue} onValueChange={(value) => handleSelectChange("durationValue", value)}>
											<SelectTrigger className={selectTriggerStyle()}>
												<SelectValue placeholder="Select duration" />
											</SelectTrigger>
											<SelectContent>
												{(() => {
													const isWeekly = formData.intervalId === "1";
													const max = isWeekly ? 52 : 12;
													return Array.from({ length: max }, (_, i) => i + 1).map((n) => (
														<SelectItem key={n} value={String(n)}>
															{n} {isWeekly ? (n !== 1 ? "weeks" : "week") : `month${n !== 1 ? "s" : ""}`}
														</SelectItem>
													));
												})()}
											</SelectContent>
										</Select>
									</div>

									{/* Start Date */}
									<div className="w-full">
										<CustomInput type="date" label="Start Date" value={formData.startDate} iconRight={<CalendarIcon />} disabled />
									</div>
								</>
							) : (
								<>
									{/* Payment Method */}
									<div className="w-full md:col-span-2">
										<Label className={labelStyle()}>Payment Method</Label>
										<RadioGroup
											value={formData.paymentMethod}
											onValueChange={(value) => handleSelectChange("paymentMethod", value)}
											className="flex items-center gap-6 mt-2">
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="link" id="edit-link" className={radioStyle} />
												<Label htmlFor="edit-link" className="text-sm cursor-pointer">
													Generate Payment Link
												</Label>
											</div>
											<div className="flex items-center space-x-2">
												<RadioGroupItem value="cash" id="edit-cash" className={radioStyle} />
												<Label htmlFor="edit-cash" className="text-sm cursor-pointer">
													Cash Payment
												</Label>
											</div>
										</RadioGroup>
									</div>

									{/* Amount (Disabled) */}
									<div className="w-full">
										<Label className={labelStyle()}>Amount</Label>
										<CustomInput value={contract.property.price} disabled />
									</div>

									{/* Whatsapp Number (Disabled) */}
									<div className="w-full">
										<Label className={labelStyle()}>Whatsapp Number</Label>
										<CustomInput value={contract.customer.phoneNumber} disabled />
									</div>

									{/* Number of Properties (Disabled) */}
									<div className="w-full">
										<Label className={labelStyle()}>Number of Properties</Label>
										<CustomInput value={String(contract.quantity)} disabled />
									</div>

									{/* Down Payment */}
									<div className="w-full">
										<CustomInput
											label="Down Payment"
											type="number"
											name="downPayment"
											value={formData.downPayment}
											onChange={handleInputChange}
											placeholder="Enter down payment"
										/>
									</div>
								</>
							)}

							{/* Remarks */}
							<div className="w-full md:col-span-2">
								<CustomInput
									label="Remarks (Optional)"
									name="remarks"
									value={formData.remarks}
									onChange={handleInputChange}
									placeholder="Enter any additional remarks"
								/>
							</div>

							{/* Action Buttons */}
							<div className="w-full md:col-span-2 flex gap-3 pt-4">
								<ActionButton
									type="button"
									variant="outline"
									className="w-full py-3"
									onClick={onClose}
									disabled={updateMutation.status === "pending"}>
									Cancel
								</ActionButton>
								<ActionButton
									type="button"
									className="w-full bg-primary text-white py-3"
									onClick={handleSubmit}
									disabled={updateMutation.status === "pending"}>
									{updateMutation.status === "pending" ? "Saving Changes..." : "Save Changes"}
								</ActionButton>
							</div>
						</form>
					)}
				</DialogContent>
			</Dialog>

			<ContractSuccessModal open={showSuccessModal} onOpenChange={setShowSuccessModal} link={generatedLink} />
		</>
	);
}
