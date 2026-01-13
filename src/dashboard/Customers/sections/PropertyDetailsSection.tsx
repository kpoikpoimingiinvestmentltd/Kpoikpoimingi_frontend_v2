import React from "react";
import CustomInput from "@/components/base/CustomInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { inputStyle, labelStyle } from "@/components/common/commonStyles";
import ValidationErrorDisplay from "@/components/common/ValidationErrorDisplay";
import { twMerge } from "tailwind-merge";
import { useGetAllProperties } from "@/api/property";
import type { InstallmentPaymentForm } from "@/types/customerRegistration";
import type { PropertyData } from "@/types/property";

type Props = {
	form: InstallmentPaymentForm;
	handleChange: (key: string, value: unknown) => void;
	paymentFrequencyOptions: Array<{ key: string; value: string }>;
	durationUnitOptions: Array<{ key: string; value: string }>;
	refLoading: boolean;
	employmentStatusOptions?: Array<{ key: string; value: string }>;
	paymentMethod?: "once" | "installment";
	centeredContainer: (additionalClasses?: string) => string;
	sectionTitle: (additionalClasses?: string) => string;
	missingFields?: string[];
	isPropertyPrefilled?: boolean;
};

export default function PropertyDetailsSection({
	form,
	handleChange,
	paymentFrequencyOptions,
	durationUnitOptions,
	refLoading,
	employmentStatusOptions,
	centeredContainer,
	sectionTitle,
	missingFields = [],
	isPropertyPrefilled = false,
}: Props) {
	void employmentStatusOptions;
	const { data: propertiesData, isLoading: propertiesLoading } = useGetAllProperties();
	const properties: PropertyData[] = React.useMemo(() => {
		if (!propertiesData || typeof propertiesData !== "object") return [];
		if (Array.isArray(propertiesData)) return propertiesData as PropertyData[];
		const dataObj = propertiesData as Record<string, unknown>;
		if (Array.isArray(dataObj.data as unknown)) return dataObj.data as unknown as PropertyData[];
		if (Array.isArray(dataObj.items as unknown)) return dataObj.items as unknown as PropertyData[];
		return [];
	}, [propertiesData]);

	React.useEffect(() => {
		if (form.paymentFrequency) {
			const selectedFrequency = paymentFrequencyOptions.find((o) => o.key === form.paymentFrequency);
			if (selectedFrequency) {
				const isWeekly = selectedFrequency.value.toUpperCase().includes("WEEK");
				const unitToSet = isWeekly ? "1" : "2";
				if (form.paymentDurationUnit !== unitToSet) {
					handleChange("paymentDurationUnit", unitToSet);
					if (!form.paymentDuration) {
						handleChange("paymentDuration", "");
					}
				}
			}
		}
	}, [form.paymentFrequency]);

	const getDurationLabel = () => {
		const selectedFrequency = paymentFrequencyOptions.find((o) => o.key === form.paymentFrequency);
		if (selectedFrequency) {
			const isWeekly = selectedFrequency.value.toUpperCase().includes("WEEK");
			return isWeekly ? "For how many weeks*" : "For how many months*";
		}
		return "For how many months*";
	};

	const getDurationOptions = () => {
		const selectedFrequency = paymentFrequencyOptions.find((o) => o.key === form.paymentFrequency);
		if (selectedFrequency) {
			const isWeekly = selectedFrequency.value.toUpperCase().includes("WEEK");
			if (isWeekly) {
				return Array.from({ length: 52 }, (_, i) => i + 1);
			}
		}
		return Array.from({ length: 12 }, (_, i) => i + 1);
	};

	const handlePropertySelect = (propertyId: string) => {
		const selectedProperty = properties.find((p) => p.id === propertyId);
		if (selectedProperty) {
			handleChange("propertyId", selectedProperty.id);
			handleChange("propertyName", selectedProperty.name);
			handleChange("isCustomProperty", false);
		}
	};

	return (
		<div className={centeredContainer()}>
			<h3 className={sectionTitle()}>Property Details</h3>
			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className={labelStyle()}>Property Name*</label>
					{isPropertyPrefilled ? (
						// Show prefilled property as read-only
						<div className={twMerge(inputStyle, "flex items-center px-3 py-2 bg-gray-50 rounded border border-gray-200")}>
							<span className="text-gray-700">{form.propertyName}</span>
						</div>
					) : !form.isCustomProperty ? (
						<>
							<Select value={form.propertyId} onValueChange={handlePropertySelect}>
								<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 cursor-pointer")}>
									<SelectValue placeholder="Select property or enter custom" />
								</SelectTrigger>
								<SelectContent>
									{propertiesLoading ? (
										<div className="p-3 text-center">
											<Spinner className="size-4" />
										</div>
									) : properties.length > 0 ? (
										<>
											{properties.map((prop) => (
												<SelectItem key={prop.id} value={prop.id}>
													{prop.name}
												</SelectItem>
											))}
											<div className="border-t my-2" />
											<SelectItem value="custom">+ Enter Custom Property</SelectItem>
										</>
									) : (
										<SelectItem value="custom">+ Enter Custom Property</SelectItem>
									)}
								</SelectContent>
							</Select>
							{/* Button to switch to custom entry */}
							{form.propertyId && (
								<button
									type="button"
									onClick={() => {
										handleChange("propertyId", "");
										handleChange("propertyName", "");
										handleChange("isCustomProperty", true);
									}}
									className="text-xs text-primary mt-2 hover:underline">
									Switch to manual entry
								</button>
							)}
						</>
					) : (
						<>
							<CustomInput
								placeholder="Enter property name"
								value={form.propertyName}
								onChange={(e) => handleChange("propertyName", e.target.value)}
								labelClassName={labelStyle()}
								className={twMerge(inputStyle)}
							/>
							{/* Button to switch back to select */}
							<button
								type="button"
								onClick={() => {
									handleChange("propertyId", "");
									handleChange("propertyName", "");
									handleChange("isCustomProperty", false);
								}}
								className="text-xs text-primary mt-2 hover:underline">
								Select from list instead
							</button>
						</>
					)}
				</div>

				{/* Payment Interval */}
				<div>
					<label className={labelStyle()}>Payment Interval*</label>
					<Select value={form.paymentFrequency} onValueChange={(v) => handleChange("paymentFrequency", v)}>
						<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 cursor-pointer")}>
							<SelectValue placeholder="Select interval" />
						</SelectTrigger>
						<SelectContent>
							{refLoading ? (
								<div className="p-3 text-center">
									<Spinner className="size-4" />
								</div>
							) : (
								paymentFrequencyOptions.map((it) => (
									<SelectItem key={it.key} value={it.key}>
										{it.value}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Custom property details (shown when custom property is selected) */}
			{form.isCustomProperty && (
				<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<CustomInput
						label="Property Name"
						placeholder="Enter property name"
						value={form.propertyName}
						onChange={(e) => handleChange("propertyName", e.target.value)}
						labelClassName={labelStyle()}
						className={twMerge(inputStyle)}
					/>
					<CustomInput
						label="Property Price"
						placeholder="Enter property price"
						type="number"
						value={form.customPropertyPrice}
						onChange={(e) => handleChange("customPropertyPrice", e.target.value)}
						labelClassName={labelStyle()}
						className={twMerge(inputStyle)}
					/>
				</div>
			)}

			{/* Duration Unit and Duration */}
			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Duration Unit (auto-synced with payment frequency) */}
				<div>
					<label className={labelStyle()}>Duration Unit*</label>
					<Select value={form.paymentDurationUnit} onValueChange={(v) => handleChange("paymentDurationUnit", v)}>
						<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 cursor-pointer")} disabled>
							<SelectValue placeholder="Select unit" />
						</SelectTrigger>
						<SelectContent>
							{refLoading ? (
								<div className="p-3 text-center">
									<Spinner className="size-4" />
								</div>
							) : (
								durationUnitOptions.map((it) => (
									<SelectItem key={it.key} value={it.key}>
										{it.value}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
					<p className="text-xs text-stone-500 mt-1">{form.paymentFrequency && "Automatically synced with payment interval"}</p>
				</div>

				{/* Duration (dynamic range based on frequency) */}
				<div>
					<label className={labelStyle()}>{getDurationLabel()}</label>
					<Select value={form.paymentDuration} onValueChange={(v) => handleChange("paymentDuration", v)}>
						<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 cursor-pointer")}>
							<SelectValue placeholder="Select duration" />
						</SelectTrigger>
						<SelectContent>
							{getDurationOptions().map((num) => {
								const isWeekly =
									form.paymentFrequency &&
									paymentFrequencyOptions
										.find((o) => o.key === form.paymentFrequency)
										?.value.toUpperCase()
										.includes("WEEK");
								return (
									<SelectItem key={num} value={String(num)}>
										{num} {isWeekly ? "week" : "month"}
										{num !== 1 ? "s" : ""}
									</SelectItem>
								);
							})}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Other fields */}
			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<CustomInput
					label="Why do you need this property"
					required
					labelClassName={labelStyle()}
					value={form.clarification.reason}
					onChange={(e) => handleChange("clarification", { ...form.clarification, reason: e.target.value })}
					className={twMerge(inputStyle)}
				/>
				<CustomInput
					label="Amount available for down payment"
					required
					labelClassName={labelStyle()}
					value={form.downPayment}
					onChange={(e) => handleChange("downPayment", e.target.value)}
					className={twMerge(inputStyle)}
				/>
			</div>

			<ValidationErrorDisplay
				missingFields={missingFields}
				filter={(field) => ["Property name", "Payment duration"].some((keyword) => field.toLowerCase().includes(keyword.toLowerCase()))}
			/>
		</div>
	);
}
