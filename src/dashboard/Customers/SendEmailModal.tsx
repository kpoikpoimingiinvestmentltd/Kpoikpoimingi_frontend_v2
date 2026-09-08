import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { extractErrorMessage, cn } from "@/lib/utils";
import { Check, Search, Users, UserRound, X } from "lucide-react";

type SelectedCustomer = { email: string; name: string };

export default function SendEmailModal({ open, onOpenChange, onSend }: SendEmailModalProps) {
	const [activeTab, setActiveTab] = useState<"specific" | "all">("specific");
	const [selected, setSelected] = useState<SelectedCustomer[]>([]);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [customerSearch, setCustomerSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [pickerOpen, setPickerOpen] = useState(false);

	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm<SendEmailFormData>({
		defaultValues: { subject: "", details: "" },
	});

	const subject = watch("subject");
	const details = watch("details");

	const { data: customersData, isLoading: customersLoading } = useGetAllCustomers(
		currentPage,
		50,
		customerSearch || undefined,
		"name",
		"asc",
		open && pickerOpen,
	);

	const selectedEmails = useMemo(() => selected.map((s) => s.email), [selected]);

	const sendSpecificMutation = useSendEmailToSpecificCustomers(
		(res: SendEmailResponse) => {
			toast.success(res?.message || `Email queued for ${selected.length} customer${selected.length === 1 ? "" : "s"}`);
			resetForm();
			onOpenChange(false);
			setConfirmOpen(false);
		},
		(err: unknown) => toast.error(extractErrorMessage(err, "Failed to send email")),
	);

	const sendBroadcastMutation = useSendEmailBroadcast(
		(res: SendEmailResponse) => {
			const count = res?.totalCustomers;
			toast.success(
				res?.message ||
					(count != null ? `Broadcast queued for ${count} customers` : "Broadcast email queued"),
			);
			resetForm();
			onOpenChange(false);
			setConfirmOpen(false);
		},
		(err: unknown) => toast.error(extractErrorMessage(err, "Failed to send broadcast email")),
	);

	const isSending = sendSpecificMutation.isPending || sendBroadcastMutation.isPending;

	const resetForm = () => {
		reset();
		setSelected([]);
		setCustomerSearch("");
		setCurrentPage(1);
		setPickerOpen(false);
		setActiveTab("specific");
	};

	useEffect(() => {
		if (!open) resetForm();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	const toggleCustomer = (customer: { email?: string; fullName?: string; name?: string }) => {
		const email = customer.email?.trim();
		if (!email) return;
		const name = customer.fullName || customer.name || email;
		setSelected((prev) => {
			if (prev.some((s) => s.email === email)) return prev.filter((s) => s.email !== email);
			return [...prev, { email, name }];
		});
	};

	const removeSelected = (email: string) => {
		setSelected((prev) => prev.filter((s) => s.email !== email));
	};

	const pageCustomers = customersData?.data ?? [];
	const allOnPageSelected =
		pageCustomers.length > 0 && pageCustomers.every((c: { email?: string }) => c.email && selectedEmails.includes(c.email));

	const toggleSelectPage = () => {
		if (allOnPageSelected) {
			const pageEmails = new Set(pageCustomers.map((c: { email?: string }) => c.email).filter(Boolean));
			setSelected((prev) => prev.filter((s) => !pageEmails.has(s.email)));
			return;
		}
		setSelected((prev) => {
			const map = new Map(prev.map((s) => [s.email, s]));
			for (const c of pageCustomers) {
				if (!c.email) continue;
				map.set(c.email, { email: c.email, name: c.fullName || c.email });
			}
			return Array.from(map.values());
		});
	};

	const canSubmit =
		!!subject?.trim() &&
		!!details?.trim() &&
		!isSending &&
		(activeTab === "all" || selected.length > 0);

	const onFormSubmit = async (data: SendEmailFormData) => {
		const payload = { subject: data.subject.trim(), message: data.details.trim() };
		try {
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
				emailAddresses: activeTab === "all" ? [] : selectedEmails,
				subject: data.subject,
				details: data.details,
			});
		} catch {
			/* toasts handled in mutation callbacks */
		}
	};

	const recipientSummary =
		activeTab === "specific"
			? `${selected.length} selected customer${selected.length === 1 ? "" : "s"}`
			: "All approved customers";

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className={modalContentStyle("md:max-w-2xl")}>
					<DialogHeader className="space-y-1.5 text-left sm:text-left">
						<DialogTitle>Send email to customers</DialogTitle>
						<DialogDescription className="text-sm text-muted-foreground">
							Write a clear subject and message, choose who should receive it, then confirm before sending.
						</DialogDescription>
					</DialogHeader>

					<form
						onSubmit={(e) => {
							e.preventDefault();
							if (!canSubmit) return;
							setConfirmOpen(true);
						}}
						className="mt-2 space-y-5">
						<Tabs
							value={activeTab}
							onValueChange={(v) => setActiveTab(v as "specific" | "all")}>
							<TabsList className={twMerge(tabListStyle, "w-full justify-start gap-6 text-foreground")}>
								<TabsTrigger value="specific" className={twMerge(tabStyle, "dark:text-slate-300")}>
									<span className="inline-flex items-center gap-1.5">
										<UserRound className="h-3.5 w-3.5" />
										Selected customers
									</span>
								</TabsTrigger>
								<TabsTrigger value="all" className={twMerge(tabStyle, "dark:text-slate-300")}>
									<span className="inline-flex items-center gap-1.5">
										<Users className="h-3.5 w-3.5" />
										All customers
									</span>
								</TabsTrigger>
							</TabsList>
						</Tabs>

						{activeTab === "specific" ? (
							<div className="space-y-2">
								<div className="flex items-center justify-between gap-2">
									<label className={labelStyle("mb-0")}>Recipients *</label>
									{selected.length > 0 && (
										<button
											type="button"
											onClick={() => setSelected([])}
											className="text-xs text-destructive hover:underline">
											Clear all
										</button>
									)}
								</div>
								<button
									type="button"
									onClick={() => setPickerOpen(true)}
									className={twMerge(
										inputStyle,
										"min-h-[4.5rem] h-auto w-full text-left px-3 py-2.5 flex flex-wrap gap-2 items-start content-start",
									)}>
									{selected.length === 0 ? (
										<span className="text-sm text-muted-foreground">Click to choose customers…</span>
									) : (
										selected.map((s) => (
											<span
												key={s.email}
												className="inline-flex items-center gap-1.5 max-w-full rounded bg-primary/10 text-primary px-2 py-1 text-xs">
												<span className="truncate font-medium">{s.name}</span>
												<span
													role="button"
													tabIndex={0}
													aria-label={`Remove ${s.name}`}
													onClick={(e) => {
														e.stopPropagation();
														removeSelected(s.email);
													}}
													onKeyDown={(e) => {
														if (e.key === "Enter" || e.key === " ") {
															e.preventDefault();
															e.stopPropagation();
															removeSelected(s.email);
														}
													}}
													className="shrink-0 rounded hover:bg-primary/20 p-0.5">
													<X className="h-3 w-3" />
												</span>
											</span>
										))
									)}
								</button>
								<p className="text-xs text-muted-foreground">{selected.length} recipient{selected.length === 1 ? "" : "s"} selected</p>
							</div>
						) : (
							<div className="rounded-md border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
								<p className="font-medium">This will email every approved customer</p>
								<p className="mt-1 text-xs opacity-90 leading-relaxed">
									Everyone with an approved registration gets this message. Migrated or email-excluded
									accounts are skipped automatically.
								</p>
							</div>
						)}

						<div>
							<label className={labelStyle()}>Subject *</label>
							<Controller
								control={control}
								name="subject"
								rules={{
									required: "Subject is required",
									maxLength: { value: 120, message: "Keep the subject under 120 characters" },
								}}
								render={({ field }) => (
									<CustomInput
										{...field}
										placeholder="e.g. Important update about your payment plan"
										className={inputStyle}
										maxLength={120}
									/>
								)}
							/>
							<div className="mt-1 flex items-center justify-between gap-2">
								{errors.subject ? (
									<p className="text-xs text-destructive">{errors.subject.message}</p>
								) : (
									<span />
								)}
								<span className="text-[11px] text-muted-foreground">{(subject || "").length}/120</span>
							</div>
						</div>

						<div>
							<label className={labelStyle()}>Message *</label>
							<Controller
								control={control}
								name="details"
								rules={{
									required: "Message is required",
									minLength: { value: 10, message: "Write at least a short message" },
								}}
								render={({ field }) => (
									<Textarea
										{...field}
										placeholder="Write the email body customers will read…"
										className={twMerge(inputStyle, "min-h-32 resize-y")}
										rows={6}
									/>
								)}
							/>
							{errors.details && <p className="mt-1 text-xs text-destructive">{errors.details.message}</p>}
						</div>

						{(subject?.trim() || details?.trim()) && (
							<div className="rounded-md border border-[#D5F3FF] bg-[#F1FBFF] p-3.5 dark:border-neutral-700 dark:bg-neutral-900/60">
								<p className="text-[11px] font-semibold uppercase tracking-wide text-[#0BA7E5] mb-2">Preview</p>
								<p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
									{subject?.trim() || "(No subject)"}
								</p>
								<p className="mt-2 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap line-clamp-4">
									{details?.trim() || "(No message)"}
								</p>
								<p className="mt-3 text-xs text-muted-foreground">To: {recipientSummary}</p>
							</div>
						)}

						<div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
							<Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSending} className="h-11 px-6">
								Cancel
							</Button>
							<Button type="submit" disabled={!canSubmit} className="bg-primary text-white h-11 px-6">
								Review & send
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>

			{/* Customer picker */}
			<Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
				<DialogContent className={modalContentStyle("md:max-w-xl")}>
					<DialogHeader className="text-left space-y-1">
						<DialogTitle>Choose recipients</DialogTitle>
						<DialogDescription>Search and tap customers to add or remove them.</DialogDescription>
					</DialogHeader>

					<div className="space-y-3">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<CustomInput
								placeholder="Search by name or email…"
								value={customerSearch}
								onChange={(e) => {
									setCustomerSearch(e.target.value);
									setCurrentPage(1);
								}}
								className={twMerge(inputStyle, "pl-9")}
							/>
						</div>

						<div className="flex items-center justify-between text-xs text-muted-foreground">
							<span>{selected.length} selected</span>
							<button type="button" onClick={toggleSelectPage} className="text-primary hover:underline" disabled={!pageCustomers.length}>
								{allOnPageSelected ? "Deselect this page" : "Select this page"}
							</button>
						</div>

						<div className="max-h-80 overflow-y-auto rounded-md border border-border divide-y divide-border">
							{customersLoading ? (
								<p className="text-center text-sm text-muted-foreground py-8">Loading customers…</p>
							) : pageCustomers.length === 0 ? (
								<p className="text-center text-sm text-muted-foreground py-8">No customers found</p>
							) : (
								pageCustomers.map((customer: { id: string; email?: string; fullName?: string; name?: string }) => {
									const isSelected = !!customer.email && selectedEmails.includes(customer.email);
									return (
										<button
											key={customer.id}
											type="button"
											onClick={() => toggleCustomer(customer)}
											className={cn(
												"w-full flex items-center gap-3 px-3 py-3 text-left transition-colors",
												isSelected ? "bg-primary/10" : "hover:bg-accent/60",
											)}>
											<span
												className={cn(
													"flex h-5 w-5 shrink-0 items-center justify-center rounded border",
													isSelected ? "border-primary bg-primary text-white" : "border-muted-foreground/40",
												)}>
												{isSelected && <Check className="h-3.5 w-3.5" />}
											</span>
											<span className="min-w-0">
												<span className="block text-sm font-medium truncate">{customer.fullName || customer.name || "Customer"}</span>
												<span className="block text-xs text-muted-foreground truncate">{customer.email}</span>
											</span>
										</button>
									);
								})
							)}
						</div>

						{customersData?.pagination && customersData.pagination.totalPages > 1 && (
							<div className="flex items-center justify-between gap-2">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
									disabled={currentPage === 1}>
									Previous
								</Button>
								<span className="text-xs text-muted-foreground">
									Page {currentPage} of {customersData.pagination.totalPages}
								</span>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage((p) => Math.min(customersData.pagination.totalPages, p + 1))}
									disabled={currentPage >= customersData.pagination.totalPages}>
									Next
								</Button>
							</div>
						)}

						<div className="flex justify-end gap-2 pt-2 border-t">
							<Button type="button" variant="outline" onClick={() => setPickerOpen(false)}>
								Cancel
							</Button>
							<Button type="button" onClick={() => setPickerOpen(false)} className="bg-primary text-white">
								Done ({selected.length})
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			<ConfirmModal
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Send this email?"
				subtitle={
					activeTab === "specific"
						? `It will go to ${selected.length} selected customer${selected.length === 1 ? "" : "s"}.`
						: "This broadcasts to all approved customers. Migrated or excluded accounts are skipped."
				}
				footerAlign="center"
				actions={[
					{ label: "Go back", onClick: () => true, variant: "outline" },
					{
						label: isSending ? "Sending…" : "Yes, send now",
						loading: isSending,
						variant: activeTab === "all" ? "danger" : "primary",
						onClick: async () => {
							await handleSubmit(onFormSubmit)();
							return true;
						},
					},
				]}>
				<div className="mx-auto max-w-md text-left rounded-md border bg-muted/30 p-3 mb-2">
					<p className="text-xs text-muted-foreground mb-1">Subject</p>
					<p className="text-sm font-medium break-words">{subject}</p>
					<p className="text-xs text-muted-foreground mt-3 mb-1">Message</p>
					<p className="text-sm whitespace-pre-wrap break-words line-clamp-6">{details}</p>
					{activeTab === "specific" && selected.length > 0 && (
						<>
							<p className="text-xs text-muted-foreground mt-3 mb-1">Recipients</p>
							<p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
								{selected.map((s) => s.name).join(", ")}
							</p>
						</>
					)}
				</div>
			</ConfirmModal>
		</>
	);
}
