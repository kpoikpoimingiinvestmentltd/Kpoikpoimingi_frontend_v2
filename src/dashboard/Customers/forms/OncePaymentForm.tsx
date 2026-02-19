import React from "react";
import CustomInput from "@/components/base/CustomInput";
import { Spinner } from "@/components/ui/spinner";
import { inputStyle, labelStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import ActionButton from "@/components/base/ActionButton";
import { EmailIcon, WhatsappIcon, TrashIcon, IconWrapper, PlusIcon, MinusIcon, SwitchIcon } from "@/assets/icons";
import type { OncePaymentForm } from "@/types/customerRegistration";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetAllProperties } from "@/api/property";
import type { PropertyData } from "@/types/property";

type Props = {
	form: OncePaymentForm;
	handleChange: (key: string, value: unknown) => void;
	isSubmitting: boolean;
	onSubmit: (e: React.FormEvent) => void;
	centeredContainer: (additionalClasses?: string) => string;
	sectionTitle: (additionalClasses?: string) => string;
	isValid: boolean;
	submitButtonText?: string;
};

export default function OncePaymentFormComponent({
	form,
	handleChange,
	isSubmitting,
	onSubmit,
	centeredContainer,
	sectionTitle,
	isValid,
	submitButtonText,
}: Props) {
	const { data: propertiesData, isLoading: propertiesLoading } = useGetAllProperties(1, 100);
	const properties: PropertyData[] = React.useMemo(() => {
		if (!propertiesData || typeof propertiesData !== "object") return [];
		if (Array.isArray(propertiesData)) return propertiesData as PropertyData[];
		const dataObj = propertiesData as Record<string, unknown>;
		if (Array.isArray(dataObj.data as unknown)) return dataObj.data as unknown as PropertyData[];
		if (Array.isArray(dataObj.items as unknown)) return dataObj.items as unknown as PropertyData[];
		return [];
	}, [propertiesData]);

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			<div className={centeredContainer()}>
				<div className="mb-10 text-center">
					<h3 className={sectionTitle("font-medium")}>Request Details</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
					<CustomInput
						label="Full name"
						required
						labelClassName={labelStyle()}
						value={form.fullName}
						onChange={(e) => handleChange("fullName", e.target.value)}
						className={twMerge(inputStyle)}
					/>

					<CustomInput
						label="Email"
						required
						labelClassName={labelStyle()}
						value={form.email}
						onChange={(e) => handleChange("email", e.target.value)}
						className={twMerge(inputStyle)}
						iconRight={<EmailIcon />}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
					<CustomInput
						label="Whatsapp number"
						required
						labelClassName={labelStyle()}
						value={form.whatsapp}
						type="tel"
						inputMode="numeric"
						pattern="\d*"
						maxLength={11}
						onKeyDown={(e) => {
							if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
						}}
						onChange={(e) => handleChange("whatsapp", e.target.value)}
						className={twMerge(inputStyle)}
						iconRight={<WhatsappIcon />}
					/>
					<CustomInput
						label="Number of properties"
						required
						type="number"
						labelClassName={labelStyle()}
						value={form.properties.filter((p) => p.propertyName && String(p.propertyName).trim() !== "").length}
						className={twMerge(inputStyle)}
						readOnly
					/>
				</div>

				{/* Properties list */}
				<div className="mt-6">
					<h4 className="text-sm font-medium mb-4">Properties</h4>

					{/* Headers */}
					<div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-2 items-center">
						<label className={labelStyle("col-span-3")}>Product Name</label>
						<label className={labelStyle("col-span-3")}>Quantity</label>
					</div>

					{/* Properties rows */}
					{form.properties
						.map((property, idx) => ({ property, idx }))
						.filter((item) => {
							if (item.idx === 0 && !item.property.propertyName && !item.property.isPrefilled && form.properties.length > 1) {
								const hasOtherProperties = form.properties.slice(1).some((p) => p.propertyName);
								if (hasOtherProperties) return false;
							}
							return true;
						})
						.map(({ property, idx }) => (
							<div key={idx} className="grid relative grid-cols-1 md:grid-cols-6 items-stretch gap-4 mb-4">
								{/* Product Name - with select or custom input */}
								<div className="col-span-3">
									{!property.isCustomProperty ? (
										<Select
											value={property.propertyId || ""}
											onValueChange={(val) => {
												const updated = [...form.properties];
												if (val === "custom") {
													updated[idx] = {
														...updated[idx],
														propertyId: "",
														propertyName: "",
														isCustomProperty: true,
													};
												} else {
													const sel = properties.find((p) => p.id === val);
													updated[idx] = {
														...updated[idx],
														propertyId: sel?.id || val,
														propertyName: sel?.name || "",
														isCustomProperty: false,
													};
												}
												handleChange("properties", updated);
											}}>
											<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 cursor-pointer !text-sm")}>
												<SelectValue placeholder="Select a property">{property.propertyName || undefined}</SelectValue>
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
														{!property.isPrefilled && (
															<>
																<div className="border-t my-2" />
																<SelectItem value="custom">+ Enter Custom Property</SelectItem>
															</>
														)}
													</>
												) : (
													<SelectItem value="custom">+ Enter Custom Property</SelectItem>
												)}
											</SelectContent>
										</Select>
									) : (
										<div className="relative flex-grow">
											<CustomInput
												placeholder="Enter property name"
												value={property.propertyName}
												onChange={(e) => {
													const updated = [...form.properties];
													updated[idx] = { ...updated[idx], propertyName: e.target.value };
													handleChange("properties", updated);
												}}
												className={twMerge(inputStyle, "w-full")}
											/>
											<button
												type="button"
												onClick={() => {
													const updated = [...form.properties];
													updated[idx] = {
														...updated[idx],
														propertyId: "",
														propertyName: "",
														isCustomProperty: false,
													};
													handleChange("properties", updated);
												}}
												className="absolute flex items-center -left-10 top-1/2 -translate-y-1/2 bg-primary text-white rounded-sm p-1.5 gap-1"
												title="Switch to property selector">
												<IconWrapper className="text-xl">
													<SwitchIcon />
												</IconWrapper>
											</button>
										</div>
									)}
								</div>
								{/* Quantity Controls */}
								<div className="col-span-3 flex items-stretch gap-2">
									<button
										type="button"
										onClick={() => {
											const updatedProperties = [...form.properties];
											const current = Number(updatedProperties[idx].quantity) || 0;
											if (current > 1) {
												updatedProperties[idx].quantity = current - 1;
												handleChange("properties", updatedProperties);
											}
										}}
										className="bg-red-500 text-white px-3 py-2 rounded font-bold hover:bg-red-600">
										<IconWrapper>
											<MinusIcon />
										</IconWrapper>
									</button>
									<input
										type="number"
										value={String(property.quantity)}
										onChange={(e) => {
											const updatedProperties = [...form.properties];
											updatedProperties[idx].quantity = e.target.value;
											handleChange("properties", updatedProperties);
										}}
										onBlur={() => {
											const updatedProperties = [...form.properties];
											const coerced = Math.max(1, Number(updatedProperties[idx].quantity) || 1);
											updatedProperties[idx].quantity = coerced;
											handleChange("properties", updatedProperties);
										}}
										className={twMerge(inputStyle, "w-full shrink-1 text-center")}
										min="1"
									/>
									<button
										type="button"
										onClick={() => {
											const updatedProperties = [...form.properties];
											const current = Number(updatedProperties[idx].quantity) || 0;
											updatedProperties[idx].quantity = current + 1;
											handleChange("properties", updatedProperties);
										}}
										className="bg-primary text-white px-3 py-2 rounded font-bold hover:bg-primary/50 active-scale">
										<IconWrapper>
											<PlusIcon />
										</IconWrapper>
									</button>
								</div>

								{/* Remove button */}
								{form.properties.length > 1 && (
									<button
										type="button"
										onClick={() => {
											const updatedProperties = form.properties.filter((_, i) => i !== idx);
											handleChange("properties", updatedProperties);
										}}
										className="bg-red-500 md:absolute md:-right-14 shrink-0 w-max text-white px-3 py-2 rounded font-bold hover:bg-red-600 h-11 col-span-1 md:ml-auto active-scale">
										<IconWrapper>
											<TrashIcon />
										</IconWrapper>
									</button>
								)}
							</div>
						))}

					<button
						type="button"
						onClick={() => {
							const updatedProperties = [...form.properties, { propertyName: "", quantity: 1 }];
							handleChange("properties", updatedProperties);
						}}
						className="mt-4 text-sm px-4 active-scale py-2 bg-primary text-white rounded">
						+ Add Property
					</button>
				</div>
			</div>

			<div className="flex justify-center mt-8">
				<ActionButton type="submit" className="w-full md:w-2/3 bg-primary text-white py-3" disabled={!isValid || isSubmitting}>
					{isSubmitting ? (
						<>
							<Spinner className="size-4" />
							<span>Processing...</span>
						</>
					) : (
						submitButtonText || "Send Request"
					)}
				</ActionButton>
			</div>
		</form>
	);
}
