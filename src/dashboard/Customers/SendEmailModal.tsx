import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { modalContentStyle, tabListStyle, tabStyle, labelStyle, inputStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";
import { useSendEmailToSpecificCustomers, useSendEmailBroadcast } from "@/api/customer";
import type { SendEmailResponse } from "@/types/email";
import ConfirmModal from "@/components/common/ConfirmModal";
import type { SendEmailModalProps, SendEmailFormData } from "@/types/email";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";

export default function SendEmailModal({ open, onOpenChange, customers = [], onSend }: SendEmailModalProps) {
	const [activeTab, setActiveTab] = useState<"specific" | "all">("specific");
	const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
	const [showEmailDropdown, setShowEmailDropdown] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
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
		}
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
		}
	);

	const handleSelectEmail = (email: string) => {
		if (!selectedEmails.includes(email)) {
			setSelectedEmails([...selectedEmails, email]);
		}
		setShowEmailDropdown(false);
	};

	const handleRemoveEmail = (email: string) => {
		setSelectedEmails(selectedEmails.filter((e) => e !== email));
	};

	const resetForm = () => {
		reset();
		setSelectedEmails([]);
		setPreviewData(null);
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
				emailAddresses: activeTab === "all" ? customers.map((c) => c.email) : selectedEmails,
				subject: data.subject,
				details: data.details,
			});
		} catch (error) {
			console.error("Error sending email:", error);
		}
	};

	const handleOpenConfirm = () => {
		const emailCount = activeTab === "specific" ? selectedEmails.length : customers.length;
		setPreviewData({
			tab: activeTab,
			emailCount,
			subject,
			details,
			recipients: activeTab === "specific" ? selectedEmails : ["All customers"],
		});
		setConfirmOpen(true);
	};

	const getAvailableEmails = () => {
		return customers.filter((c) => !selectedEmails.includes(c.email));
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
										<div>
											<label className={labelStyle()}>User Email Addresses*</label>
											<div className="relative">
												<DropdownMenu open={showEmailDropdown} onOpenChange={setShowEmailDropdown}>
													<DropdownMenuTrigger asChild>
														<div className={twMerge(inputStyle, "cursor-pointer flex flex-wrap gap-2 items-start min-h-20 p-2 overflow-y-auto")}>
															{selectedEmails.length === 0 ? (
																<span className="text-stone-400 text-sm">Select email addresses</span>
															) : (
																selectedEmails.map((email) => (
																	<div key={email} className="bg-primary/20 text-primary px-2 py-1 rounded text-xs flex items-center gap-2">
																		{email}
																		<button
																			type="button"
																			onClick={(e) => {
																				e.stopPropagation();
																				handleRemoveEmail(email);
																			}}
																			className="text-primary hover:text-primary/80">
																			×
																		</button>
																	</div>
																))
															)}
														</div>
													</DropdownMenuTrigger>
													{getAvailableEmails().length > 0 && (
														<DropdownMenuContent className="w-full min-w-80">
															{getAvailableEmails().map((customer) => (
																<DropdownMenuItem key={customer.id} onClick={() => handleSelectEmail(customer.email)}>
																	{customer.email}
																</DropdownMenuItem>
															))}
														</DropdownMenuContent>
													)}
												</DropdownMenu>
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
