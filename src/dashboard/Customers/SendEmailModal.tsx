import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { modalContentStyle, tabListStyle, tabStyle, labelStyle, inputStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";
import { useSendEmailToSpecificCustomers, useSendEmailBroadcast, useGetAllCustomers } from "@/api/customer";
import type { SendEmailResponse } from "@/types/email";
import ConfirmModal from "@/components/common/ConfirmModal";
import type { SendEmailModalProps, SendEmailFormData } from "@/types/email";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SendEmailModal({ open, onOpenChange, onSend }: SendEmailModalProps) {
	const [activeTab, setActiveTab] = useState<"specific" | "all">("specific");
	const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [customerSearch, setCustomerSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [customerSelectModalOpen, setCustomerSelectModalOpen] = useState(false);
	const [previewData, setPreviewData] = useState<{
		tab: "specific" | "all";
		emailCount: number;
		subject: string;
		details: string;
		recipients: string[];
	} | null>(null);

	const { control, handleSubmit, reset, watch } = useForm<SendEmailFormData>({
		defaultValues: {
			subject: "",
			details: "",
		},
	});

	const subject = watch("subject");
	const details = watch("details");

	const { data: customersData, isLoading: customersLoading } = useGetAllCustomers(currentPage, 50, customerSearch, "name", "asc");

	const sendSpecificMutation = useSendEmailToSpecificCustomers(
		(res: SendEmailResponse) => {
			console.log("Email sent successfully:", res);
			const message = res?.message || "Email sent successfully!";
			toast.success(message);
			resetForm();
			onOpenChange(false);
			setConfirmOpen(false);
		},
		(err: unknown) => {
			console.error("Error sending specific email:", err);
			toast.error(extractErrorMessage(err, "Failed to send email"));
		},
	);

	const sendBroadcastMutation = useSendEmailBroadcast(
		(res: SendEmailResponse) => {
			console.log("Broadcast email sent successfully:", res);
			const message = res?.message || "Broadcast email sent successfully!";
			toast.success(message);
			resetForm();
			onOpenChange(false);
			setConfirmOpen(false);
		},
		(err: unknown) => {
			console.error("Error sending broadcast email:", err);
			toast.error(extractErrorMessage(err, "Failed to send broadcast email"));
		},
	);

	const handleSelectEmail = (email: string) => {
		setSelectedEmails((prev) => (prev.includes(email) ? prev : [...prev, email]));
	};

	const handleRemoveEmail = (email: string) => {
		setSelectedEmails((prev) => prev.filter((e) => e !== email));
	};

	const resetForm = () => {
		reset();
		setSelectedEmails([]);
		setPreviewData(null);
		setCustomerSearch("");
		setCurrentPage(1);
		setCustomerSelectModalOpen(false);
	};

	const onFormSubmit = async (data: SendEmailFormData) => {
		try {
			const payload = {
				subject: data.subject,
				message: data.details,
			};

			if (activeTab === "specific") {
				await sendSpecificMutation.mutateAsync({
					...payload,
					emailAddresses: selectedEmails,
				});
			} else {
				await sendBroadcastMutation.mutateAsync({
					...payload,
					filterApprovedOnly: true,
				});
			}

			await onSend?.({
				tab: activeTab,
				emailAddresses: activeTab === "all" ? customersData?.data?.map((c: any) => c.email) || [] : selectedEmails,
				subject: data.subject,
				details: data.details,
			});
		} catch (error) {
			console.error("Error sending email:", error);
		}
	};

	const handleOpenConfirm = () => {
		const emailCount = activeTab === "specific" ? selectedEmails.length : customersData?.data?.length || 0;
		setPreviewData({
			tab: activeTab,
			emailCount,
			subject,
			details,
			recipients: activeTab === "specific" ? selectedEmails : ["All customers"],
		});
		setConfirmOpen(true);
	};

	const isLoading_pending = sendSpecificMutation.isPending || sendBroadcastMutation.isPending;

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className={modalContentStyle("md:max-w-2xl")}>
					<DialogHeader>
						<DialogTitle className="text-center">Send Email</DialogTitle>
					</DialogHeader>

					<div className="max-w-lg w-full mt-5 mx-auto">
						<form onSubmit={handleSubmit(onFormSubmit)}>
							<Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "specific" | "all")}>
								<TabsList className={twMerge(tabListStyle, "justify-center w-full")}>
									<TabsTrigger value="specific" className={twMerge(tabStyle, "justify-center")}>
										Send One /Specific Customers
									</TabsTrigger>
									<TabsTrigger value="all" className={twMerge(tabStyle, "justify-center")}>
										Send All Customers
									</TabsTrigger>
								</TabsList>

								<div className="mt-6">
									{/* Specific Customers Tab */}
									<TabsContent value="specific" className="space-y-4">
										<div className="relative">
											<label className={labelStyle()}>User Email Addresses*</label>
											{selectedEmails.length > 0 && (
												<button
													type="button"
													onClick={() => setSelectedEmails([])}
													className="absolute right-2 top-1 text-sm text-destructive hover:text-destructive/80">
													Remove all
												</button>
											)}
											<div className="relative">
												<Button
													type="button"
													variant="outline"
													onClick={() => setCustomerSelectModalOpen(true)}
													className={twMerge(inputStyle, "justify-start h-auto min-h-20 p-2")}>
													{selectedEmails.length === 0 ? (
														<span className="text-muted-foreground text-sm">Select email addresses</span>
													) : (
														<div className="flex flex-wrap items-center gap-2 w-full">
															{selectedEmails.map((email) => (
																<div key={email} className="bg-primary/20 text-primary px-2 py-1 rounded text-xs flex items-center gap-2">
																	{email}
																	<button
																		type="button"
																		onPointerDown={(e) => {
																			e.stopPropagation();
																			e.preventDefault();
																		}}
																		onClick={(e) => {
																			e.stopPropagation();
																			handleRemoveEmail(email);
																		}}
																		className="text-destructive hover:text-destructive/80">
																		×
																	</button>
																</div>
															))}
														</div>
													)}
												</Button>
											</div>
										</div>

										<div>
											<label className={labelStyle()}>Input Email Sub Heading*</label>
											<Controller
												control={control}
												name="subject"
												rules={{ required: "Subject is required" }}
												render={({ field }) => <CustomInput {...field} placeholder="Enter Here" className={twMerge(inputStyle)} />}
											/>
										</div>

										<div>
											<label className={labelStyle()}>Input Email Details*</label>
											<Controller
												control={control}
												name="details"
												rules={{ required: "Details are required" }}
												render={({ field }) => <Textarea {...field} placeholder="Enter Here" className={twMerge(inputStyle, "min-h-24")} />}
											/>
										</div>
									</TabsContent>

									{/* All Customers Tab */}
									<TabsContent value="all" className="space-y-4">
										<div>
											<label className={labelStyle()}>Input Email Sub Heading*</label>
											<Controller
												control={control}
												name="subject"
												rules={{ required: "Subject is required" }}
												render={({ field }) => <CustomInput {...field} placeholder="Enter Here" className={twMerge(inputStyle)} />}
											/>
										</div>

										<div>
											<label className={labelStyle()}>Input Email Details*</label>
											<Controller
												control={control}
												name="details"
												rules={{ required: "Details are required" }}
												render={({ field }) => <Textarea {...field} placeholder="Enter Here" className={twMerge(inputStyle, "min-h-24")} />}
											/>
										</div>
									</TabsContent>
								</div>
							</Tabs>
							<div className="mt-10 mb-8 flex justify-center">
								<Button
									type="button"
									onClick={handleOpenConfirm}
									disabled={isLoading_pending || !subject || !details || (activeTab === "specific" && selectedEmails.length === 0)}
									className="w-full bg-primary text-white min-h-11 hover:bg-primary/90 py-2 h-auto">
									Send Email Now
								</Button>
							</div>
						</form>
					</div>
				</DialogContent>
			</Dialog>

			{/* Customer Selection Modal */}
			<Dialog open={customerSelectModalOpen} onOpenChange={setCustomerSelectModalOpen}>
				<DialogContent className={modalContentStyle("md:max-w-2xl")}>
					<DialogHeader>
						<DialogTitle>Select Customer Emails</DialogTitle>
					</DialogHeader>

					<div className="space-y-4">
						<div>
							<label className={labelStyle()}>Search Customers</label>
							<CustomInput
								placeholder="Search by name or email..."
								value={customerSearch}
								onChange={(e) => {
									setCustomerSearch(e.target.value);
									setCurrentPage(1);
								}}
								className={inputStyle}
							/>
						</div>

						<div className="max-h-96 overflow-y-auto border border-border rounded-md p-2 bg-background">
							{customersLoading ? (
								<div className="text-center text-sm text-muted-foreground py-4">Loading customers...</div>
							) : customersData?.data?.length === 0 ? (
								<div className="text-center text-sm text-muted-foreground py-4">No customers found.</div>
							) : (
								<div className="space-y-2">
									{customersData?.data?.map((customer: any) => (
										<div
											key={customer.id}
											onClick={() => handleSelectEmail(customer.email)}
											className={cn(
												"flex items-center justify-between p-3 rounded-md border cursor-pointer transition-colors",
												selectedEmails.includes(customer.email)
													? "bg-primary/10 border-primary dark:bg-primary/20"
													: "border-border hover:bg-accent hover:text-accent-foreground bg-card",
											)}>
											<div className="flex items-center gap-3">
												<Check className={cn("h-4 w-4", selectedEmails.includes(customer.email) ? "text-primary opacity-100" : "opacity-0")} />
												<div>
													<div className="font-medium text-sm text-foreground">{customer.fullName || customer.name}</div>
													<div className="text-xs text-muted-foreground">{customer.email}</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{customersData?.pagination && (
							<div className="flex items-center justify-between">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
									disabled={currentPage === 1}>
									Previous
								</Button>
								<span className="text-sm text-muted-foreground">
									Page {currentPage} of {customersData.pagination.totalPages}
								</span>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage((prev) => Math.min(customersData.pagination.totalPages, prev + 1))}
									disabled={currentPage === customersData.pagination.totalPages}>
									Next
								</Button>
							</div>
						)}

						<div className="flex justify-end gap-2 pt-4 border-t">
							<Button type="button" variant="outline" onClick={() => setCustomerSelectModalOpen(false)}>
								Cancel
							</Button>
							<Button type="button" onClick={() => setCustomerSelectModalOpen(false)}>
								Done ({selectedEmails.length} selected)
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Confirmation Modal */}
			<ConfirmModal
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Confirm Send Email"
				subtitle={`Send email to ${previewData?.emailCount || 0} ${previewData?.tab === "specific" ? "selected" : "all"} customers?`}
				actions={[
					{ label: "Cancel", onClick: () => true, variant: "ghost" },
					{
						label: isLoading_pending ? "Sending..." : "Send",
						onClick: async () => {
							await handleSubmit(onFormSubmit)();
							return true;
						},
						loading: isLoading_pending,
						variant: "primary",
					},
				]}
			/>
		</>
	);
}
