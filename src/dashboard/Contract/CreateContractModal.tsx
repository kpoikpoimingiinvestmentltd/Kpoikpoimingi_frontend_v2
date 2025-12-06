import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { inputStyle, labelStyle, modalContentStyle, selectTriggerStyle, radioStyle } from "../../components/common/commonStyles";
import { useGetReferenceData } from "@/api/reference";
import { Spinner } from "@/components/ui/spinner";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useCreateContract, useGetAllCustomerRegistrations } from "@/api/contracts";
import ContractSuccessModal from "./ContractSuccessModal";
import CustomInput from "../../components/base/CustomInput";
import { CalendarIcon } from "../../assets/icons";
import ActionButton from "../../components/base/ActionButton";
import { extractPaymentFrequencyOptions, extractDurationUnitOptions } from "@/lib/referenceDataHelpers";
import type { RefOption } from "@/lib/referenceDataHelpers";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import type { Registration } from "@/types/customerRegistration";

export default function CreateContractModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
	const [showSuccess, setShowSuccess] = React.useState(false);
	const [generatedLink, setGeneratedLink] = React.useState<string>("");
	const [selectedCustomerData, setSelectedCustomerData] = React.useState<Registration | null>(null);
	const [searchQuery, setSearchQuery] = React.useState("");

	// Fetch customer registrations when modal opens
	const registrationsQuery = useGetAllCustomerRegistrations(open) as { data?: { data?: Registration[] } | Registration[] };
	const registrations = registrationsQuery?.data;

	const filteredRegistrations = React.useMemo<Registration[]>(() => {
		if (!registrations) return [];
		const list: Registration[] = Array.isArray(registrations)
			? (registrations as Registration[])
			: Array.isArray((registrations as { data?: Registration[] }).data)
			? ((registrations as { data?: Registration[] }).data as Registration[])
			: [];

		const currentRegistrations = list.filter((reg) => reg?.isCurrent === true);
		if (!searchQuery.trim()) return currentRegistrations;
		return currentRegistrations.filter((reg) =>
			String(reg.fullName || "")
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
		);
	}, [registrations, searchQuery]);

	React.useEffect(() => {
		if (!open) {
			setSearchQuery("");
			setSelectedCustomerData(null);
		}
	}, [open]);

	// Get default values based on selected customer
	const getDefaultValues = () => {
		if (!selectedCustomerData) {
			return {
				customerId: "",
				propertyId: "",
				paymentTypeId: "1",
				quantity: 1,
				downPayment: 0,
				intervalId: "",
				durationValue: 12,
				durationUnitId: "",
				startDate: "",
				remarks: "",
				paymentMethod: "",
			};
		}

		const propertyInterest = selectedCustomerData?.propertyInterestRequest?.[0];
		return {
			customerId: selectedCustomerData.customerId,
			propertyId: propertyInterest?.propertyId || "",
			paymentTypeId: String(selectedCustomerData.paymentTypeId || 1),
			quantity: propertyInterest?.quantity || 1,
			downPayment: Number(propertyInterest?.downPayment || 0),
			intervalId: String(propertyInterest?.paymentIntervalId || ""),
			durationValue: propertyInterest?.durationValue || 12,
			durationUnitId: String(propertyInterest?.durationUnitId || ""),
			startDate: "",
			remarks: "",
			paymentMethod: "",
		};
	};

	// use react-hook-form for all contract inputs
	const {
		control,
		handleSubmit: rhfHandleSubmit,
		reset,
		watch,
		setValue,
	} = useForm({
		defaultValues: getDefaultValues(),
	});

	const queryClient = useQueryClient();

	const paymentTypeId = watch("paymentTypeId");
	const watchedIntervalId = watch("intervalId");

	// Watch important fields to compute whether form is ready to submit
	const watchedCustomerId = watch("customerId");
	const watchedDurationValue = watch("durationValue");
	const watchedDurationUnitId = watch("durationUnitId");
	const watchedStartDate = watch("startDate");
	const watchedPaymentMethod = watch("paymentMethod");

	const canCreate = React.useMemo(() => {
		const hasCustomer = typeof watchedCustomerId === "string" && watchedCustomerId.trim() !== "";
		const hasPaymentType = paymentTypeId != null && String(paymentTypeId) !== "";
		const hasStartDate = typeof watchedStartDate === "string" && watchedStartDate.trim() !== "";
		const hasPaymentMethod = typeof watchedPaymentMethod === "string" && watchedPaymentMethod.trim() !== "";
		const isHire = String(paymentTypeId) === "1";
		const hireFieldsOk = !isHire || (String(watchedIntervalId) !== "" && watchedDurationValue != null && String(watchedDurationUnitId) !== "");
		return Boolean(hasCustomer && hasPaymentType && hasStartDate && hireFieldsOk && hasPaymentMethod);
	}, [watchedCustomerId, paymentTypeId, watchedStartDate, watchedIntervalId, watchedDurationValue, watchedDurationUnitId, watchedPaymentMethod]);

	// Reset form when customer is selected
	React.useEffect(() => {
		reset(getDefaultValues());
	}, [selectedCustomerData, reset]);

	// confirm / preview state
	type ContractPayload = {
		customerId?: string;
		propertyId?: string | undefined;
		paymentTypeId?: number;
		quantity?: number;
		downPayment?: number;
		intervalId?: number | undefined;
		durationValue?: number;
		durationUnitId?: number | undefined;
		startDate?: string | undefined;
		remarks?: string | undefined;
		isCash?: boolean;
		isPaymentLink?: boolean;
	};

	const [previewPayload, setPreviewPayload] = React.useState<ContractPayload | null>(null);
	const [confirmOpen, setConfirmOpen] = React.useState(false);

	const { data: refData, isLoading: refLoading } = useGetReferenceData();

	const intervalCandidates = React.useMemo<RefOption[]>(() => {
		return extractPaymentFrequencyOptions(refData);
	}, [refData]);

	const durationCandidates = React.useMemo<RefOption[]>(() => {
		return extractDurationUnitOptions(refData);
	}, [refData]);

	// Auto-sync duration unit with selected payment interval (weekly vs monthly)
	// Do not clear an already-provided `durationValue` (e.g., when selecting a customer with prefills).
	React.useEffect(() => {
		if (!watchedIntervalId) return;
		const selected = intervalCandidates.find((it) => String(it.key) === String(watchedIntervalId));
		const isWeekly = Boolean(selected && String(selected.value).toUpperCase().includes("WEEK"));

		// Try to find the matching duration unit key from durationCandidates
		let unitKey: string | undefined;
		if (isWeekly) {
			unitKey = durationCandidates.find((d) => String(d.value).toUpperCase().includes("WEEK"))?.key;
		} else {
			unitKey = durationCandidates.find((d) => String(d.value).toUpperCase().includes("MONTH"))?.key;
		}

		if (unitKey) {
			setValue("durationUnitId", String(unitKey));
			// Only clear durationValue if there was no existing value (preserve prefills)
			if (watchedDurationValue === undefined || watchedDurationValue === null || String(watchedDurationValue).trim() === "") {
				setValue("durationValue", undefined as unknown as number);
			}
		}
	}, [watchedIntervalId, intervalCandidates, durationCandidates, setValue, watchedDurationValue]);

	const onFormSubmit = (values: Record<string, unknown>) => {
		const payload: ContractPayload = {
			customerId: typeof values.customerId === "string" ? values.customerId : undefined,
			propertyId: typeof values.propertyId === "string" ? values.propertyId : undefined,
			paymentTypeId: Number(values.paymentTypeId),
			quantity: Number(values.quantity) || 1,
			downPayment: Number(values.downPayment) || 0,
			intervalId:
				values.intervalId !== undefined && values.intervalId !== null && String(values.intervalId).trim() !== ""
					? Number(values.intervalId)
					: undefined,
			durationValue:
				values.durationValue !== undefined && values.durationValue !== null && String(values.durationValue).trim() !== ""
					? Number(values.durationValue)
					: undefined,
			durationUnitId:
				values.durationUnitId !== undefined && values.durationUnitId !== null && String(values.durationUnitId).trim() !== ""
					? Number(values.durationUnitId)
					: undefined,
			startDate: typeof values.startDate === "string" && values.startDate ? new Date(values.startDate).toISOString() : undefined,
			remarks: typeof values.remarks === "string" ? values.remarks : undefined,
			isCash: values.paymentMethod === "cash",
			isPaymentLink: values.paymentMethod === "link",
		};

		// Client-side validation for hire-purchase contracts to avoid server 400s
		const resolvedPaymentType = Number(values.paymentTypeId);
		if (resolvedPaymentType === 1) {
			const missing: string[] = [];
			if (!payload.intervalId) missing.push("payment interval");
			if (!payload.durationValue && payload.durationValue !== 0) missing.push("duration value");
			if (!payload.durationUnitId) missing.push("duration unit");
			if (!payload.startDate) missing.push("start date");

			if (missing.length > 0) {
				toast.error(`Missing required fields for Hire Purchase: ${missing.join(", ")}`);
				console.debug("Contract payload blocked due to missing fields:", payload);
				return;
			}
		}

		console.debug("Contract payload preview:", payload);
		setPreviewPayload(payload);
		setConfirmOpen(true);
	};

	const createMutation = useCreateContract(
		(res: unknown) => {
			const r = (res as Record<string, unknown>) ?? {};
			let linkStr = "";
			if (typeof r.link === "string") {
				linkStr = r.link;
			} else if (r.data && typeof (r.data as Record<string, unknown>).link === "string") {
				linkStr = (r.data as Record<string, unknown>).link as string;
			} else if (typeof r.downPaymentLink === "string") {
				linkStr = r.downPaymentLink;
			} else if (r.data && typeof (r.data as Record<string, unknown>).downPaymentLink === "string") {
				linkStr = (r.data as Record<string, unknown>).downPaymentLink as string;
			}
			// Show success toast if server returned a friendly message
			const successMsg =
				typeof r.message === "string"
					? r.message
					: typeof (r.data as Record<string, unknown>)?.message === "string"
					? (r.data as Record<string, unknown>).message
					: "Contract created successfully";
			try {
				toast.success(String(successMsg));
			} catch (e) {
				// ignore toast failures
			}
			setGeneratedLink(linkStr);
			setConfirmOpen(false);
			onOpenChange(false);
			setSelectedCustomerData(null);
			try {
				queryClient.invalidateQueries({ queryKey: ["contracts"] });
			} catch {}
			setTimeout(() => setShowSuccess(true), 200);
		},
		(err: unknown) => {
			const msg = extractErrorMessage(err, "Failed to create contract");
			toast.error(msg);
		}
	);

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className={modalContentStyle("md:max-w-3xl")}>
					<DialogHeader className="justify-center flex flex-row mt-2 text-center">
						<DialogTitle>Create Contract</DialogTitle>
						<DialogClose />
					</DialogHeader>

					<form
						onSubmit={rhfHandleSubmit(onFormSubmit)}
						className="grid max-w-2xl mx-auto grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-5 py-4">
						{/* Customer Selection */}
						<div className="w-full">
							<Label className={labelStyle()}>Full name*</Label>
							<Controller
								control={control}
								name="customerId"
								render={({ field }) => (
									<Select
										onValueChange={(v) => {
											field.onChange(v);
											const val = v as string;
											const selected = filteredRegistrations.find((reg) => reg.customerId === val) ?? null;
											setSelectedCustomerData(selected);
										}}
										value={String(field.value)}>
										<SelectTrigger className={selectTriggerStyle()}>
											<SelectValue placeholder="Search customer" />
										</SelectTrigger>
										<SelectContent>
											<div className="p-1.5">
												<CustomInput
													placeholder="Search by name"
													className={inputStyle}
													value={searchQuery}
													onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
												/>
											</div>
											{filteredRegistrations && filteredRegistrations.length > 0
												? filteredRegistrations.map((reg) => (
														<SelectItem className="cursor-pointer" key={String(reg.id)} value={String(reg.customerId)}>
															{String(reg.fullName ?? "")}
														</SelectItem>
												  ))
												: searchQuery && <div className="p-3 text-center text-sm text-gray-500">No customers found</div>}
										</SelectContent>
									</Select>
								)}
							/>
						</div>

						{/* Payment Type */}
						<div className="w-full">
							<Label className={labelStyle()}>Payment Type*</Label>
							<Controller
								control={control}
								name="paymentTypeId"
								render={({ field }) => (
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger className={selectTriggerStyle()}>
											<SelectValue placeholder="Select payment type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="1">Hire Purchase</SelectItem>
											<SelectItem value="2">Full Payment</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
						</div>

						{/* Hire Purchase Fields */}
						{paymentTypeId === "1" && (
							<>
								{/* Quantity */}
								<Controller
									control={control}
									name="quantity"
									render={({ field }) => (
										<CustomInput
											label="Quantity"
											type="number"
											min="1"
											value={String(field.value)}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									)}
								/>

								{/* Payment Interval */}
								<div className="w-full">
									<Label className={labelStyle()}>Payment Interval*</Label>
									<Controller
										control={control}
										name="intervalId"
										render={({ field }) => (
											<Select onValueChange={field.onChange} value={field.value}>
												<SelectTrigger className={selectTriggerStyle()}>
													<SelectValue placeholder="Select interval" />
												</SelectTrigger>
												<SelectContent>
													{refLoading ? (
														<div className="p-3 text-center">
															<Spinner className="size-4" />
														</div>
													) : intervalCandidates.length === 0 ? (
														<>
															<SelectItem value="2">Monthly</SelectItem>
															<SelectItem value="1">Weekly</SelectItem>
														</>
													) : (
														intervalCandidates.map((it) => (
															<SelectItem key={it.key} value={it.key}>
																{it.value}
															</SelectItem>
														))
													)}
												</SelectContent>
											</Select>
										)}
									/>
								</div>

								{/* Duration Unit */}
								<div className="w-full">
									<Label className={labelStyle()}>Duration Unit*</Label>
									<Controller
										control={control}
										name="durationUnitId"
										render={({ field }) => (
											<Select onValueChange={field.onChange} value={field.value}>
												<SelectTrigger className={selectTriggerStyle()}>
													<SelectValue placeholder="Select unit" />
												</SelectTrigger>
												<SelectContent>
													{refLoading ? (
														<div className="p-3 text-center">
															<Spinner className="size-4" />
														</div>
													) : durationCandidates.length === 0 ? (
														<SelectItem value="3">Months</SelectItem>
													) : (
														durationCandidates.map((it) => (
															<SelectItem key={it.key} value={it.key}>
																{it.value}
															</SelectItem>
														))
													)}
												</SelectContent>
											</Select>
										)}
									/>
								</div>

								{/* Duration Value */}
								<div className="w-full">
									<Label className={labelStyle()}>
										{(() => {
											const sel = intervalCandidates.find((it) => String(it.key) === String(watchedIntervalId));
											const weekly = Boolean(sel && String(sel.value).toUpperCase().includes("WEEK"));
											return weekly ? "For How Many Weeks*" : "For How Many Months*";
										})()}
									</Label>
									<Controller
										control={control}
										name="durationValue"
										render={({ field }) => (
											<Select onValueChange={(v) => field.onChange(Number(v))} value={field.value != null ? String(field.value) : ""}>
												<SelectTrigger className={selectTriggerStyle()}>
													<SelectValue placeholder="Select duration" />
												</SelectTrigger>
												<SelectContent>
													{(() => {
														const sel = intervalCandidates.find((it) => String(it.key) === String(watchedIntervalId));
														const weekly = Boolean(sel && String(sel.value).toUpperCase().includes("WEEK"));
														const opts = weekly ? Array.from({ length: 52 }, (_, i) => i + 1) : Array.from({ length: 12 }, (_, i) => i + 1);
														return opts.map((n) => (
															<SelectItem key={n} value={String(n)}>
																{n} {weekly ? (n !== 1 ? "weeks" : "week") : `month${n !== 1 ? "s" : ""}`}
															</SelectItem>
														));
													})()}
												</SelectContent>
											</Select>
										)}
									/>
								</div>

								{/* Down Payment */}
								<Controller
									control={control}
									name="downPayment"
									render={({ field }) => (
										<CustomInput
											label="Amount available for down payment"
											type="number"
											min="0"
											value={String(field.value)}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									)}
								/>

								{/* Payment Method */}
								<div className="col-span-2">
									<Label className={labelStyle()}>Payment Method*</Label>
									<Controller
										control={control}
										name="paymentMethod"
										render={({ field }) => (
											<RadioGroup value={field.value} onValueChange={field.onChange} className="flex items-center gap-6 mt-2">
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="link" id="link" className={radioStyle} />
													<Label htmlFor="link" className="text-sm cursor-pointer">
														Generate Payment Link
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="cash" id="cash" className={radioStyle} />
													<Label htmlFor="cash" className="text-sm cursor-pointer">
														Cash Payment
													</Label>
												</div>
											</RadioGroup>
										)}
									/>
								</div>
							</>
						)}

						{/* Full Payment Fields */}
						{paymentTypeId === "2" && (
							<>
								{/* Down Payment for Full Payment */}
								<Controller
									control={control}
									name="downPayment"
									render={({ field }) => (
										<CustomInput
											label="Amount Paid"
											type="number"
											value={String(field.value)}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									)}
								/>

								{/* Payment Method */}
								<div className="col-span-2">
									<Label className={labelStyle()}>Payment Method*</Label>
									<Controller
										control={control}
										name="paymentMethod"
										render={({ field }) => (
											<RadioGroup value={field.value} onValueChange={field.onChange} className="flex items-center gap-6 mt-2">
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="link" id="link-full" className={radioStyle} />
													<Label htmlFor="link-full" className="text-sm cursor-pointer">
														Generate Payment Link
													</Label>
												</div>
												<div className="flex items-center space-x-2">
													<RadioGroupItem value="cash" id="cash-full" className={radioStyle} />
													<Label htmlFor="cash-full" className="text-sm cursor-pointer">
														Cash Payment
													</Label>
												</div>
											</RadioGroup>
										)}
									/>
								</div>
							</>
						)}

						{/* Start Date - Common to both */}
						<Controller
							control={control}
							name="startDate"
							render={({ field }) => (
								<CustomInput type="date" iconRight={<CalendarIcon />} label="Start Date" value={field.value} onChange={field.onChange} />
							)}
						/>

						{/* Remarks */}
						<Controller
							control={control}
							name="remarks"
							render={({ field }) => (
								<CustomInput
									label="Remarks (Optional)"
									placeholder="Enter any additional remarks"
									value={field.value}
									onChange={field.onChange}
									className="col-span-2"
								/>
							)}
						/>

						<DialogFooter className="col-span-2 mt-5">
							<ActionButton fullWidth type="submit" disabled={!canCreate}>
								Create Contract
							</ActionButton>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			<ConfirmModal
				open={confirmOpen}
				onOpenChange={(o) => setConfirmOpen(o)}
				title="Confirm Create Contract"
				subtitle={previewPayload ? "Please confirm the contract details before creating." : "Create contract"}
				actions={[
					{ label: "Cancel", onClick: () => true, variant: "ghost" },
					{
						label: createMutation.isPending ? "Creating..." : "Create",
						onClick: async () => {
							if (!previewPayload) return false;
							await createMutation.mutateAsync(previewPayload);
							return true;
						},
						loading: createMutation.isPending,
						variant: "primary",
					},
				]}
			/>

			<ContractSuccessModal
				open={showSuccess}
				onOpenChange={setShowSuccess}
				link={generatedLink}
				onSend={(email) => console.log("send-email", email, generatedLink)}
			/>
		</>
	);
}
