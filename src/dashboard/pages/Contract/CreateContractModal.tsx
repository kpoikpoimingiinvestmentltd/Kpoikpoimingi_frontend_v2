import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// calendar icon not available in icons export; we'll use text placeholder

export default function CreateContractModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
	const [stepVariant, setStepVariant] = React.useState<"hire" | "full" | "hireAlt">("hire");
	const [showSuccess, setShowSuccess] = React.useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// simulate creation
		setShowSuccess(true);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create Contract</DialogTitle>
						<DialogClose />
					</DialogHeader>

					<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
						<div>
							<Label>Full name*</Label>
							<select className="w-full rounded border p-2" defaultValue="tom">
								<option value="tom">Tom Doe James</option>
								<option value="thomas">Thomas Doe James</option>
							</select>
						</div>

						<div>
							<Label>Payment Type*</Label>
							<select
								className="w-full rounded border p-2"
								defaultValue="hire"
								onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStepVariant(e.target.value === "full" ? "full" : "hire")}>
								<option value="hire">Hire purchase</option>
								<option value="full">Full payment</option>
							</select>
						</div>

						{stepVariant !== "full" && (
							<>
								<div>
									<Label>Property Name*</Label>
									<Input defaultValue="25kg gas cylinder" />
								</div>
								<div>
									<Label>Payment Interval*</Label>
									<select className="w-full rounded border p-2" defaultValue="monthly">
										<option value="monthly">Monthly</option>
										<option value="weekly">Weekly</option>
									</select>
								</div>

								<div>
									<Label>Payment duration*</Label>
									<select className="w-full rounded border p-2" defaultValue="months">
										<option value="months">Months</option>
									</select>
								</div>

								<div>
									<Label>For How Many Months*</Label>
									<select className="w-full rounded border p-2" defaultValue="12">
										<option value="12">12</option>
									</select>
								</div>

								<div>
									<Label>Amount available for down payment*</Label>
									<Input defaultValue="30,000" />
								</div>

								<div>
									<Label>Start Date*</Label>
									<div className="relative">
										<Input defaultValue="12-3-2025" />
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
									<Input defaultValue="25kg gas cylinder" />
								</div>
								<div>
									<Label>Amount Paid*</Label>
									<Input defaultValue="30,000" />
								</div>
								<div className="col-span-2">
									<Label>Start Date*</Label>
									<div className="relative">
										<Input defaultValue="12-3-2025" />
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
							<Button type="submit" className="w-full">
								Create Contract
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Success dialog variant */}
			<Dialog open={showSuccess} onOpenChange={setShowSuccess}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Payment Link Generated</DialogTitle>
					</DialogHeader>
					<div className="py-4 text-center">
						<div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">✓</div>
						<p className="mt-4 text-sm">Link</p>
						<p className="break-all text-xs text-muted-foreground">https://docs.google.com/document/d/1y5xRJxMrQ72vCP2nwMff4gXlt-fca5iY_9UH</p>
						<div className="mt-4 flex gap-3 justify-center">
							<Button>Send Via Email</Button>
							<Button variant="outline">Copy Link</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
