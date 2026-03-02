import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ChevronDownIcon } from "lucide-react";
import CustomInput from "@/components/base/CustomInput";
import { inputStyle, labelStyle, modalContentStyle, selectTriggerStyle } from "@/components/common/commonStyles";
import ActionButton from "@/components/base/ActionButton";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useGetCustomersWithActiveContract } from "@/api/customer";
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
	const [customerOpen, setCustomerOpen] = React.useState(false);
	const [selectedCustomerName, setSelectedCustomerName] = React.useState<string | null>(null);
	const [showReceiptDisplay, setShowReceiptDisplay] = React.useState(false);
	const [generatedReceipt, setGeneratedReceipt] = React.useState<ReceiptDetail | null>(null);

	const { control, handleSubmit, watch, setValue, reset } = useForm<GenerateReceiptFormData>({
		defaultValues: {
			customerId: "",
			paymentMethodId: "",
			amountPaid: "",
			paymentDate: new Date().toISOString().split("T")[0],
			notes: "",
		},
	});

	const selectedCustomerId = watch("customerId");

	React.useEffect(() => {
		if (!open) {
			setCustomerSearch("");
			setCurrentPage(1);
			setCustomerOpen(false);
			setSelectedCustomerName(null);
		}
	}, [open]);

	const { data: activeContractCustomers, isLoading: activeContractLoading } = useGetCustomersWithActiveContract(
		currentPage,
		10,
		customerSearch,
		"name",
		"asc",
	);
	const { mutate: generateReceiptMutation, isPending } = useGenerateReceipt();

	// Prefill payment method when customer is selected
	React.useEffect(() => {
		if (!selectedCustomerId || !activeContractCustomers?.data) return;

		const selectedCustomer = activeContractCustomers.data.find((c: any) => c.id === selectedCustomerId) as any;
		if (selectedCustomer?.paymentType?.id) {
			setValue("paymentMethodId", String(selectedCustomer.paymentType.id));
		}
	}, [selectedCustomerId, activeContractCustomers, setValue]);

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
			},
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
						<div className="flex flex-col md:grid md:max-w-lg grid-cols-1 md:grid-cols-2 gap-4 mx-auto md:gap-x-8 md:gap-y-5 py-4 mt-4">
							<Controller
								name="customerId"
								control={control}
								rules={{ required: "Customer is required" }}
								render={({ field }) => (
									<div className="w-full">
										<Label className={labelStyle()}>Full name*</Label>
										<DropdownMenu open={customerOpen} onOpenChange={setCustomerOpen}>
											<DropdownMenuTrigger asChild>
												<button
													type="button"
													className={selectTriggerStyle(
														"flex items-center justify-between px-3 text-left text-sm w-full min-w-0 bg-[#13121205] dark:bg-input/30",
													)}>
													<span className="truncate">{selectedCustomerName ?? "Search customer"}</span>
													<ChevronDownIcon className="size-4 shrink-0 opacity-50" />
												</button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												className="min-w-[16rem] w-52 p-0 overflow-y-auto overflow-x-hidden flex flex-col max-h-[280px] scrollbar-hide"
												align="start"
												onCloseAutoFocus={(e) => e.preventDefault()}>
												<div
													className="sticky top-0 z-10 shrink-0 border-b bg-popover p-1.5"
													onPointerDown={(e) => e.stopPropagation()}
													onKeyDown={(e) => e.stopPropagation()}>
													<Input
														placeholder="Search by name"
														className={inputStyle}
														value={customerSearch}
														onChange={(e) => {
															setCustomerSearch(e.target.value);
															setCurrentPage(1);
														}}
														onPointerDown={(e) => e.stopPropagation()}
														onClick={(e) => e.stopPropagation()}
														autoFocus
													/>
												</div>
												<div className="min-h-0 flex-1 p-1" style={{ WebkitOverflowScrolling: "touch" }}>
													{activeContractLoading ? (
														<div className="p-2 text-center text-sm text-muted-foreground">Loading...</div>
													) : (
														<>
															{activeContractCustomers?.data?.map((customer: any) => (
																<DropdownMenuItem
																	key={customer.id}
																	className="cursor-pointer my-3"
																	onSelect={() => {
																		field.onChange(customer.id);
																		setSelectedCustomerName(customer.fullName ?? null);
																		setCustomerOpen(false);
																	}}
																	onClick={() => {
																		setCustomerSearch("");
																	}}>
																	{customer.fullName}
																</DropdownMenuItem>
															)) ?? null}
															{/* {activeContractCustomers?.pagination &&
                                activeContractCustomers.pagination.totalPages >
                                  1 && (
                                  <div className="flex items-center justify-between p-2 border-t">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setCurrentPage((prev) =>
                                          Math.max(1, prev - 1)
                                        )
                                      }
                                      disabled={currentPage === 1}
                                      className="px-2 py-1 text-xs dark:bg-neutral-800 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                                    >
                                      Prev
                                    </button>
                                    <span className="text-xs text-gray-500">
                                      Page {currentPage} of{" "}
                                      {
                                        activeContractCustomers.pagination
                                          .totalPages
                                      }
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setCurrentPage((prev) =>
                                          Math.min(
                                            activeContractCustomers.pagination
                                              .totalPages,
                                            prev + 1
                                          )
                                        )
                                      }
                                      disabled={
                                        currentPage ===
                                        activeContractCustomers.pagination
                                          .totalPages
                                      }
                                      className="px-2 py-1 text-xs dark:bg-neutral-800 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                                    >
                                      Next
                                    </button>
                                  </div> */}
															{/* )} */}
														</>
													)}
												</div>
											</DropdownMenuContent>
										</DropdownMenu>
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
								rules={{
									required: "Amount is required",
									min: { value: 0, message: "Amount must be greater than 0" },
								}}
								render={({ field }) => <CustomInput label="Amount Paid" required type="number" step="0.01" {...field} className={inputStyle} />}
							/>

							<Controller
								name="paymentDate"
								control={control}
								rules={{ required: "Payment date is required" }}
								render={({ field }) => (
									<CustomInput label="Payment Date" required containerClassName="w-full" type="date" {...field} className={inputStyle} />
								)}
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
