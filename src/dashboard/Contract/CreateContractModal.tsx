import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { inputStyle } from "../../components/common/commonStyles";
import SuccessModal from "@/components/common/SuccessModal";
// calendar icon not available in icons export; we'll use text placeholder

export default function CreateContractModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
	const [stepVariant, setStepVariant] = React.useState<"hire" | "full">("hire");
	const [showSuccess, setShowSuccess] = React.useState(false);
	const [generatedLink, setGeneratedLink] = React.useState<string>("");
	const [selectedCustomer, setSelectedCustomer] = React.useState<string | undefined>(undefined);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// simulate creation and generate a link
		const link = "https://docs.google.com/document/d/1y5xRJxMrQ72vCP2nwMff4gXlt-fca5iY_9UH";
		setGeneratedLink(link);
		setShowSuccess(true);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className="overflow-y-auto max-h-[90vh] md:max-w-2xl w-full">
					<DialogHeader>
						<DialogTitle>Create Contract</DialogTitle>
						<DialogClose />
					</DialogHeader>

					<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
						<div>
							<Label>Full name*</Label>
							<Select onValueChange={(v) => setSelectedCustomer(v)} value={selectedCustomer}>
								<SelectTrigger className={inputStyle}>
									<SelectValue placeholder="Search customer" />
								</SelectTrigger>
								<SelectContent>
									<div className="p-2">
										<Input placeholder="Search by name" className={inputStyle} />
									</div>
									<SelectItem value="tom">Tom Doe James</SelectItem>
									<SelectItem value="thomas">Thomas Doe James</SelectItem>
									<SelectItem value="ogun">Thomas James Ogun</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<Label>Payment Type*</Label>
							<Select onValueChange={(v) => setStepVariant(v as any)} value={stepVariant}>
								<SelectTrigger className={inputStyle}>
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
								<div>
									<Label>Property Name*</Label>
									<Input defaultValue="25kg gas cylinder" className={inputStyle} />
								</div>
								<div>
									<Label>Payment Interval*</Label>
									<Select defaultValue="monthly">
										<SelectTrigger className={inputStyle}>
											<SelectValue placeholder="Select interval" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="monthly">Monthly</SelectItem>
											<SelectItem value="weekly">Weekly</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label>Payment duration*</Label>
									<Select defaultValue="months">
										<SelectTrigger className={inputStyle}>
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="months">Months</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label>For How Many Months*</Label>
									<Select defaultValue="12">
										<SelectTrigger className={inputStyle}>
											<SelectValue placeholder="12" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="12">12</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label>Amount available for down payment*</Label>
									<Input defaultValue="30,000" className={inputStyle} />
								</div>

								<div>
									<Label>Start Date*</Label>
									<div className="relative">
										<Input defaultValue="12-3-2025" className={inputStyle} />
										<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">📅</span>
									</div>
								</div>

								<div className="col-span-2 flex items-center gap-4">
									<Checkbox id="gen" />
									<Label htmlFor="gen">Generate Payment Link</Label>
									<Checkbox id="cash" />
									<Label htmlFor="cash">Cash Payment</Label>
								</div>
							</>
						)}

						{stepVariant === "full" && (
							<>
								<div>
									<Label>Property Name*</Label>
									<Input defaultValue="25kg gas cylinder" className={inputStyle} />
								</div>
								<div>
									<Label>Amount Paid*</Label>
									<Input defaultValue="30,000" className={inputStyle} />
								</div>
								<div className="col-span-2">
									<Label>Start Date*</Label>
									<div className="relative">
										<Input defaultValue="12-3-2025" className={inputStyle} />
										<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">📅</span>
									</div>
								</div>
								<div className="col-span-2">
									<Checkbox id="gen2" />
									<Label htmlFor="gen2">Generate Payment Link</Label>
								</div>
							</>
						)}

						<DialogFooter className="col-span-2">
							<Button type="submit" className={inputStyle}>
								Create Contract
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<SuccessModal
				open={showSuccess}
				onOpenChange={setShowSuccess}
				title="Payment Link Generated"
				subtitle="Link"
				fields={[{ label: "Link", value: generatedLink, variant: "block" }]}
				actions={[
					{
						label: "Send Via Email",
						onClick: () => {
							// placeholder: implement email sending
							console.log("send email", generatedLink);
						},
						variant: "primary",
						fullWidth: false,
					},
					{
						label: "Copy Link",
						onClick: () => {
							if (generatedLink && navigator?.clipboard) navigator.clipboard.writeText(generatedLink);
						},
						variant: "outline",
						fullWidth: false,
					},
				]}
			/>
		</>
	);
}
