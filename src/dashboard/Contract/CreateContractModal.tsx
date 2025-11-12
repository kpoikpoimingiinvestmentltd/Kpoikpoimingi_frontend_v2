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
	const [stepVariant, setStepVariant] = React.useState<"hire" | "full">("hire");
	const [showSuccess, setShowSuccess] = React.useState(false);
	const [generatedLink, setGeneratedLink] = React.useState<string>("");
	const [selectedCustomer, setSelectedCustomer] = React.useState<string | undefined>(undefined);
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
		}
	}, [open, registrationsQuery]);

	// use react-hook-form for all contract inputs
	const { control, handleSubmit: rhfHandleSubmit } = useForm({
		defaultValues: {
			customerId: selectedCustomer ?? undefined,
			propertyId: "",
			paymentTypeId: stepVariant === "hire" ? "1" : "2",
			quantity: 1,
			downPayment: "",
			intervalId: "",
			durationValue: 12,
			durationUnitId: "",
			startDate: "",
			remarks: "",
			isCash: false,
			isPaymentLink: false,
			isCustomProperty: false,
			customPropertyName: "",
			customPropertyPrice: "",
		},
	});

	// NOTE: removed unused watchers; convert selects/checkboxes to Controller when ready

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
			customerId: values.customerId ?? null,
			propertyId: values.propertyId || undefined,
			paymentTypeId: Number(values.paymentTypeId) || (stepVariant === "hire" ? 1 : 2),
			quantity: Number(values.quantity) || 1,
			downPayment: Number(values.downPayment) || 0,
			intervalId: Number(values.intervalId) || undefined,
			durationValue: Number(values.durationValue) || undefined,
			durationUnitId: Number(values.durationUnitId) || undefined,
			startDate: values.startDate || undefined,
			remarks: values.remarks || undefined,
			isCash: !!values.isCash,
			isPaymentLink: !!values.isPaymentLink,
			isCustomProperty: !!values.isCustomProperty,
			customPropertyName: values.customPropertyName || undefined,
			customPropertyPrice: values.customPropertyPrice ? Number(values.customPropertyPrice) : undefined,
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
						<div>
							<Label className={labelStyle()}>Full name*</Label>
							<Controller
								control={control}
								name="customerId"
								render={({ field }) => (
									<Select
										onValueChange={(v) => {
											field.onChange(v);
											setSelectedCustomer(v as any);
										}}
										value={(field.value as any) ?? undefined}>
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
											{refLoading ? (
												<div className="p-3 text-center">
													<Spinner className="size-4" />
												</div>
											) : intervalCandidates.length === 0 ? (
												<>
													<SelectItem value="monthly">Monthly</SelectItem>
													<SelectItem value="weekly">Weekly</SelectItem>
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
								</div>

								<div>
									<Label className={labelStyle()}>Payment duration*</Label>
									<Select defaultValue="months">
										<SelectTrigger className={selectTriggerStyle()}>
											<SelectValue placeholder="Select" />
										</SelectTrigger>
										<SelectContent>
											{refLoading ? (
												<div className="p-3 text-center">
													<Spinner className="size-4" />
												</div>
											) : durationCandidates.length === 0 ? (
												<SelectItem value="months">Months</SelectItem>
											) : (
												durationCandidates.map((it) => (
													<SelectItem key={it.key} value={it.key}>
														{it.value}
													</SelectItem>
												))
											)}
										</SelectContent>
									</Select>
								</div>

								<div>
									<Label className={labelStyle()}>For How Many Months*</Label>
									<Controller
										control={control}
										name="durationValue"
										render={({ field }) => (
											<Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value ?? "12")}>
												<SelectTrigger className={selectTriggerStyle()}>
													<SelectValue placeholder="12" />
												</SelectTrigger>
												<SelectContent>
													{Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
														<SelectItem key={n} value={String(n)}>
															{n}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									/>
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
