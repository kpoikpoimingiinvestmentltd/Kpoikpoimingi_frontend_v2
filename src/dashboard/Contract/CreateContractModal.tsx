import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import CheckboxField from "@/components/base/CheckboxField";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { inputStyle, labelStyle, modalContentStyle, selectTriggerStyle } from "../../components/common/commonStyles";
import { useGetReferenceData } from "@/api/reference";
import { Spinner } from "@/components/ui/spinner";
import { useForm, Controller } from "react-hook-form";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useCreateContract, useGetAllCustomerRegistrations } from "@/api/contracts";
import ContractSuccessModal from "./ContractSuccessModal";
import CustomInput from "../../components/base/CustomInput";
import { CalendarIcon } from "../../assets/icons";
import ActionButton from "../../components/base/ActionButton";
import { extractPaymentFrequencyOptions, extractDurationUnitOptions } from "@/lib/referenceDataHelpers";

export default function CreateContractModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
	const [showSuccess, setShowSuccess] = React.useState(false);
	const [generatedLink, setGeneratedLink] = React.useState<string>("");
	const [selectedCustomerData, setSelectedCustomerData] = React.useState<any | null>(null);
	const [searchQuery, setSearchQuery] = React.useState("");

	// Fetch customer registrations when modal opens
	const registrationsQuery = useGetAllCustomerRegistrations(open) as any;
	const registrations = registrationsQuery?.data;

	const filteredRegistrations = React.useMemo(() => {
		if (!registrations?.data || !Array.isArray(registrations.data)) return [];
		const currentRegistrations = registrations.data.filter((reg: any) => reg.isCurrent === true);
		if (!searchQuery.trim()) return currentRegistrations;
		return currentRegistrations.filter((reg: any) => reg.fullName?.toLowerCase().includes(searchQuery.toLowerCase()));
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
				isCash: false,
				isPaymentLink: false,
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
			isCash: false,
			isPaymentLink: false,
		};
	};

	// use react-hook-form for all contract inputs
	const {
		control,
		handleSubmit: rhfHandleSubmit,
		reset,
		watch,
	} = useForm({
		defaultValues: getDefaultValues(),
	});

	const paymentTypeId = watch("paymentTypeId");

	// Reset form when customer is selected
	React.useEffect(() => {
		reset(getDefaultValues());
	}, [selectedCustomerData, reset]);

	// confirm / preview state
	const [previewPayload, setPreviewPayload] = React.useState<any | null>(null);
	const [confirmOpen, setConfirmOpen] = React.useState(false);

	const { data: refData, isLoading: refLoading } = useGetReferenceData();

	const intervalCandidates = React.useMemo(() => {
		return extractPaymentFrequencyOptions(refData);
	}, [refData]);

	const durationCandidates = React.useMemo(() => {
		return extractDurationUnitOptions(refData);
	}, [refData]);

	const onFormSubmit = (values: any) => {
		const payload = {
			customerId: values.customerId,
			propertyId: values.propertyId || undefined,
			paymentTypeId: Number(values.paymentTypeId),
			quantity: Number(values.quantity) || 1,
			downPayment: Number(values.downPayment) || 0,
			intervalId: Number(values.intervalId) || undefined,
			durationValue: Number(values.durationValue),
			durationUnitId: Number(values.durationUnitId) || undefined,
			startDate: values.startDate ? new Date(values.startDate).toISOString() : undefined,
			remarks: values.remarks || undefined,
			isCash: !!values.isCash,
			isPaymentLink: !!values.isPaymentLink,
		};

		setPreviewPayload(payload);
		setConfirmOpen(true);
	};

	const createMutation = useCreateContract(
		(res) => {
			const link = (res as any)?.link ?? (res as any)?.data?.link ?? "";
			setGeneratedLink(link);
			setConfirmOpen(false);
			onOpenChange(false);
			setSelectedCustomerData(null);
			setTimeout(() => setShowSuccess(true), 200);
		},
		(err) => {
			console.error("Create contract failed", err);
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
						className="grid max-w-2xl mx-auto items-end grid-cols-1 sm:grid-cols-2 gap-4 md:gap-x-8 md:gap-y-5 py-4">
						{/* Customer Selection */}
						<div>
							<Label className={labelStyle()}>Full name*</Label>
							<Controller
								control={control}
								name="customerId"
								render={({ field }) => (
									<Select
										onValueChange={(v) => {
											field.onChange(v);
											const selected = filteredRegistrations.find((reg: any) => reg.customerId === v);
											setSelectedCustomerData(selected || null);
										}}
										value={field.value as any}>
										<SelectTrigger className={selectTriggerStyle()}>
											<SelectValue placeholder="Search customer" />
										</SelectTrigger>
										<SelectContent>
											<div className="p-1.5">
												<CustomInput
													placeholder="Search by name"
													className={inputStyle}
													value={searchQuery}
													onChange={(e: any) => setSearchQuery(e.target.value)}
												/>
											</div>
											{filteredRegistrations && filteredRegistrations.length > 0
												? filteredRegistrations.map((reg: any) => (
														<SelectItem className="cursor-pointer" key={reg.id} value={reg.customerId}>
															{reg.fullName}
														</SelectItem>
												  ))
												: searchQuery && <div className="p-3 text-center text-sm text-gray-500">No customers found</div>}
										</SelectContent>
									</Select>
								)}
							/>
						</div>

						{/* Payment Type */}
						<div>
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
											value={String(field.value)}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									)}
								/>

								{/* Payment Interval */}
								<div>
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
								<div>
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
								<div>
									<Label className={labelStyle()}>For How Many Months*</Label>
									<Controller
										control={control}
										name="durationValue"
										render={({ field }) => (
											<Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}>
												<SelectTrigger className={selectTriggerStyle()}>
													<SelectValue placeholder="Select duration" />
												</SelectTrigger>
												<SelectContent>
													{Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
														<SelectItem key={n} value={String(n)}>
															{n} month{n !== 1 ? "s" : ""}
														</SelectItem>
													))}
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
											value={String(field.value)}
											onChange={(e) => field.onChange(Number(e.target.value))}
										/>
									)}
								/>

								{/* Checkboxes */}
								<div className="col-span-2 flex items-center gap-4">
									<Controller
										control={control}
										name="isPaymentLink"
										render={({ field }) => (
											<CheckboxField
												id="payment-link"
												label="Generate Payment Link"
												checked={field.value}
												onCheckedChange={field.onChange}
												wrapperClassName=""
											/>
										)}
									/>
									<Controller
										control={control}
										name="isCash"
										render={({ field }) => (
											<CheckboxField
												id="cash-payment"
												label="Cash Payment"
												checked={field.value}
												onCheckedChange={field.onChange}
												wrapperClassName=""
											/>
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

								{/* Generate Link Checkbox */}
								<div className="col-span-2">
									<Controller
										control={control}
										name="isPaymentLink"
										render={({ field }) => (
											<CheckboxField
												id="payment-link-full"
												label="Generate Payment Link"
												checked={field.value}
												onCheckedChange={field.onChange}
												wrapperClassName=""
											/>
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
							<ActionButton fullWidth type="submit">
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
