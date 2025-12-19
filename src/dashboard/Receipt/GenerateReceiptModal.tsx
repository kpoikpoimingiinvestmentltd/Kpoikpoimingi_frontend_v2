import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import CustomInput from "@/components/base/CustomInput";
import { inputStyle, labelStyle, modalContentStyle, selectTriggerStyle } from "@/components/common/commonStyles";
import ActionButton from "@/components/base/ActionButton";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useGetAllCustomers } from "@/api/customer";
import { useGenerateReceipt, getReceiptById } from "@/api/receipt";
import ReceiptDisplayModal from "./ReceiptDisplayModal";
import { toast } from "sonner";
import type { ReceiptDetail } from "@/types/receipt";
import { useForm, Controller } from "react-hook-form";

interface GenerateReceiptFormData {
	customerId: string;
	paymentMethodId: string;
	amountPaid: string;
	paymentDate: string;
	notes?: string;
}

export default function GenerateReceiptModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
	const [customerSearch, setCustomerSearch] = React.useState("");
	const [currentPage, setCurrentPage] = React.useState(1);
	const [showReceiptDisplay, setShowReceiptDisplay] = React.useState(false);
	const [generatedReceipt, setGeneratedReceipt] = React.useState<ReceiptDetail | null>(null);

	const { control, handleSubmit, watch, setValue, reset } = useForm<GenerateReceiptFormData>({
		defaultValues: {
			customerId: "",
			paymentMethodId: "",
			amountPaid: "",
			paymentDate: "",
			notes: "",
		},
	});

	const selectedCustomerId = watch("customerId");

	const { data: customersData, isLoading: customersLoading } = useGetAllCustomers(currentPage, 50, customerSearch, "name", "asc");
	const { mutate: generateReceiptMutation, isPending } = useGenerateReceipt();

	React.useEffect(() => {
		if (!selectedCustomerId || !customersData?.data) return;

		const selectedCustomer = customersData.data.find((c: any) => c.id === selectedCustomerId);
		if (selectedCustomer?.registrations?.[0]?.paymentType?.id) {
			setValue("paymentMethodId", String(selectedCustomer.registrations[0].paymentType.id));
		}
	}, [selectedCustomerId, customersData, setValue]);

	const handleFormSubmit = (data: GenerateReceiptFormData) => {
		// Validation
		if (!data.customerId) {
			toast.error("Please select a customer");
			return;
		}
		if (!data.paymentMethodId) {
			toast.error("Please select a payment method");
			return;
		}
		if (!data.amountPaid || Number(data.amountPaid) <= 0) {
			toast.error("Please enter a valid amount");
			return;
		}
		if (!data.paymentDate) {
			toast.error("Please select a payment date");
			return;
		}

		generateReceiptMutation(
			{
				customerId: data.customerId,
				amount: data.amountPaid,
				paymentMethodId: Number(data.paymentMethodId),
				paymentDate: data.paymentDate,
				notes: data.notes,
			},
			{
				onSuccess: async (response: any) => {
					toast.success(response.message || "Receipt generated successfully");

					// Fetch the complete receipt details
					const fullReceipt = await getReceiptById(response.receipt.id);

					setGeneratedReceipt(fullReceipt);
					setShowReceiptDisplay(true);

					// Reset form
					reset();
					onOpenChange(false);
				},
				onError: (error: any) => {
					let message = "Failed to generate receipt";

					// Handle array of messages (from validation errors)
					if (error?.response?.data?.message && Array.isArray(error.response.data.message)) {
						message = error.response.data.message.join("\n");
					}
					// Handle single message
					else if (error?.response?.data?.message) {
						message = error.response.data.message;
					}
					// Fallback to error description
					else if (error?.response?.data?.error) {
						message = error.response.data.error;
					}

					toast.error(message);
				},
			}
		);
	};

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className={modalContentStyle("md:max-w-2xl")}>
					<DialogHeader className="justify-center flex flex-row mt-2 text-center">
						<DialogTitle>Generate Receipt</DialogTitle>
						<DialogClose />
					</DialogHeader>

					<form onSubmit={handleSubmit(handleFormSubmit)} className="">
						<div className="grid max-w-lg grid-cols-1 md:grid-cols-2 gap-4 mx-auto md:gap-x-8 md:gap-y-5 py-4 mt-4">
							<Controller
								name="customerId"
								control={control}
								rules={{ required: "Customer is required" }}
								render={({ field }) => (
									<div className="w-full">
										<Label className={labelStyle()}>Full name*</Label>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className={selectTriggerStyle()}>
												<SelectValue placeholder="Search customer" />
											</SelectTrigger>
											<SelectContent>
												<div className="p-1.5">
													<CustomInput
														placeholder="Search by name"
														className={inputStyle}
														value={customerSearch}
														onChange={(e) => {
															setCustomerSearch((e.target as HTMLInputElement).value);
															setCurrentPage(1);
														}}
													/>
												</div>
												{customersLoading ? (
													<div className="p-2 text-center text-sm text-gray-500">Loading...</div>
												) : (
													<>
														{customersData?.data?.map((customer: any) => (
															<SelectItem key={customer.id} value={customer.id}>
																{customer.fullName}
															</SelectItem>
														)) || []}
														{customersData?.pagination && (
															<div className="flex items-center justify-between p-2 border-t">
																<button
																	type="button"
																	onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
																	disabled={currentPage === 1}
																	className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded">
																	Prev
																</button>
																<span className="text-xs text-gray-500">
																	Page {currentPage} of {customersData.pagination.totalPages}
																</span>
																<button
																	type="button"
																	onClick={() => setCurrentPage((prev) => Math.min(customersData.pagination.totalPages, prev + 1))}
																	disabled={currentPage === customersData.pagination.totalPages}
																	className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded">
																	Next
																</button>
															</div>
														)}
													</>
												)}
											</SelectContent>
										</Select>
									</div>
								)}
							/>

							<Controller
								name="paymentMethodId"
								control={control}
								rules={{ required: "Payment method is required" }}
								render={({ field }) => (
									<div>
										<Label className={labelStyle()}>Payment Method*</Label>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className={selectTriggerStyle()}>
												<SelectValue placeholder="Select payment method" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="1">Hire Purchase</SelectItem>
												<SelectItem value="2">Full Payment</SelectItem>
											</SelectContent>
										</Select>
									</div>
								)}
							/>

							<Controller
								name="amountPaid"
								control={control}
								rules={{ required: "Amount is required", min: { value: 0, message: "Amount must be greater than 0" } }}
								render={({ field }) => <CustomInput label="Amount Paid" required type="number" step="0.01" {...field} className={inputStyle} />}
							/>

							<Controller
								name="paymentDate"
								control={control}
								rules={{ required: "Payment date is required" }}
								render={({ field }) => <CustomInput label="Payment Date" required type="date" {...field} className={inputStyle} />}
							/>

							<Controller
								name="notes"
								control={control}
								render={({ field }) => (
									<div className="col-span-2">
										<Label className={labelStyle()}>Note / Remark</Label>
										<Textarea className={inputStyle} rows={3} {...field} placeholder="Optional notes or remarks" />
									</div>
								)}
							/>
							<DialogFooter className="col-span-2 mt-5">
								<ActionButton fullWidth className="py-3" type="submit" disabled={isPending}>
									{isPending ? (
										<>
											<Spinner className="size-4" />
											<span>Generating...</span>
										</>
									) : (
										"Generate Receipt"
									)}
								</ActionButton>
							</DialogFooter>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			<ReceiptDisplayModal open={showReceiptDisplay} onOpenChange={setShowReceiptDisplay} receipt={generatedReceipt} />
		</>
	);
}
