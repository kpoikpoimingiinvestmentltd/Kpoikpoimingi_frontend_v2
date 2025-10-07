import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import CheckboxField from "@/components/base/CheckboxField";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { inputStyle, labelStyle, selectTriggerStyle } from "../../components/common/commonStyles";
import ContractSuccessModal from "./ContractSuccessModal";
import CustomInput from "../../components/base/CustomInput";
import { CalendarIcon } from "../../assets/icons";
import ActionButton from "../../components/base/ActionButton";

export default function CreateContractModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
	const [stepVariant, setStepVariant] = React.useState<"hire" | "full">("hire");
	const [showSuccess, setShowSuccess] = React.useState(false);
	const [generatedLink, setGeneratedLink] = React.useState<string>("");
	const [selectedCustomer, setSelectedCustomer] = React.useState<string | undefined>(undefined);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const link = "https://docs.google.com/document/d/1y5xRJxMrQ72vCP2nwMff4gXlt-fca5iY_9UH";
		setGeneratedLink(link);
		onOpenChange(false);

		// open the success modal after a short delay so the create dialog closes cleanly
		setTimeout(() => setShowSuccess(true), 200);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="overflow-y-auto max-h-[90vh] md:max-w-3xl w-full">
					<DialogHeader className="justify-center flex flex-row mt-2 text-center">
						<DialogTitle>Create Contract</DialogTitle>
						<DialogClose />
					</DialogHeader>

					<form onSubmit={handleSubmit} className="grid max-w-2xl mx-auto items-end grid-cols-1 sm:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-5 py-4">
						<div>
							<Label className={labelStyle()}>Full name*</Label>
							<Select onValueChange={(v) => setSelectedCustomer(v)} value={selectedCustomer}>
								<SelectTrigger className={selectTriggerStyle()}>
									<SelectValue placeholder="Search customer" />
								</SelectTrigger>
								<SelectContent>
									<div className="p-1.5">
										<CustomInput placeholder="Search by name" className={inputStyle} />
									</div>
									<SelectItem value="tom">Tom Doe James</SelectItem>
									<SelectItem value="thomas">Thomas Doe James</SelectItem>
									<SelectItem value="ogun">Thomas James Ogun</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label className={labelStyle()}>Payment Type*</Label>
							<Select onValueChange={(v) => setStepVariant(v as any)} value={stepVariant}>
								<SelectTrigger className={selectTriggerStyle()}>
									<SelectValue placeholder="Select payment type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="hire">Hire purchase</SelectItem>
									<SelectItem value="full">Full payment</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{stepVariant !== "full" && (
							<>
								<CustomInput label="Property Name" required />
								<div>
									<Label className={labelStyle()}>Payment Interval*</Label>
									<Select defaultValue="monthly">
										<SelectTrigger className={selectTriggerStyle()}>
											<SelectValue placeholder="Select interval" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="monthly">Monthly</SelectItem>
											<SelectItem value="weekly">Weekly</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label className={labelStyle()}>Payment duration*</Label>
									<Select defaultValue="months">
										<SelectTrigger className={selectTriggerStyle()}>
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="months">Months</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label className={labelStyle()}>For How Many Months*</Label>
									<Select defaultValue="12">
										<SelectTrigger className={selectTriggerStyle()}>
											<SelectValue placeholder="12" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="12">12</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<CustomInput defaultValue="30,000" label="Amount available for down payment" required />

								<CustomInput type="date" defaultValue="12-3-2025" iconRight={<CalendarIcon />} label="Start Date" />

								<div className="col-span-2 flex items-center gap-4">
									{/* Generate link and cash payment checkboxes */}
									<CheckboxField id="gen" label="Generate Payment Link" wrapperClassName="" />
									<CheckboxField id="cash" label="Cash Payment" wrapperClassName="" />
								</div>
							</>
						)}

						{stepVariant === "full" && (
							<>
								<CustomInput label="Property Name" required />
								<CustomInput label="Amount Paid" />
								<CustomInput
									type="date"
									containerClassName="col-span-full"
									defaultValue="12-3-2025"
									iconRight={<CalendarIcon />}
									label="Start Date"
									required
								/>

								<div className="col-span-2">
									<CheckboxField id="gen2" label="Generate Payment Link" wrapperClassName="" />
								</div>
							</>
						)}

						<DialogFooter className="col-span-2 mt-5">
							<ActionButton fullWidth>Create Contract</ActionButton>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<ContractSuccessModal
				open={showSuccess}
				onOpenChange={setShowSuccess}
				link={generatedLink}
				onSend={(email) => console.log("send-email", email, generatedLink)}
			/>
		</>
	);
}
