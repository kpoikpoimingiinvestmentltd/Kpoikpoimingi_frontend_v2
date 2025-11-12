import React from "react";
import CustomInput from "@/components/base/CustomInput";
import { Spinner } from "@/components/ui/spinner";
import { inputStyle, labelStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import ActionButton from "@/components/base/ActionButton";
import { EmailIcon, WhatsappIcon, TrashIcon, IconWrapper, PlusIcon, MinusIcon } from "@/assets/icons";
import type { OncePaymentForm } from "@/types/customerRegistration";

type Props = {
	form: OncePaymentForm;
	handleChange: (key: string, value: any) => void;
	isSubmitting: boolean;
	onSubmit: (e: React.FormEvent) => void;
	centeredContainer: (additionalClasses?: string) => string;
	sectionTitle: (additionalClasses?: string) => string;
	isValid: boolean;
};

export default function OncePaymentFormComponent({ form, handleChange, isSubmitting, onSubmit, centeredContainer, sectionTitle, isValid }: Props) {
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
						value={form.numberOfProperties}
						onChange={(e) => handleChange("numberOfProperties", e.target.value)}
						className={twMerge(inputStyle)}
					/>
				</div>

				{/* Properties list */}
				<div className="mt-6">
					<h4 className="text-sm font-medium mb-4">Properties</h4>
					{form.properties.map((property, idx) => (
						<div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
							<CustomInput
								label={`Property Name${idx > 0 ? ` ${idx + 1}` : ""}`}
								required
								labelClassName={labelStyle()}
								value={property.propertyName}
								onChange={(e) => {
									const updatedProperties = [...form.properties];
									updatedProperties[idx].propertyName = e.target.value;
									handleChange("properties", updatedProperties);
								}}
								className={twMerge(inputStyle)}
							/>

							<div className="flex gap-2 items-end">
								<div className="flex-1">
									<label className={labelStyle()}>Quantity</label>
									<div className="flex items-stretch gap-2 mt-1">
										<button
											type="button"
											onClick={() => {
												const updatedProperties = [...form.properties];
												if (updatedProperties[idx].quantity > 1) {
													updatedProperties[idx].quantity--;
													handleChange("properties", updatedProperties);
												}
											}}
											className="bg-red-500 text-white px-3 py-2 rounded font-bold">
											<IconWrapper>
												<MinusIcon />
											</IconWrapper>
										</button>
										<input
											type="number"
											value={property.quantity}
											onChange={(e) => {
												const updatedProperties = [...form.properties];
												updatedProperties[idx].quantity = Math.max(1, parseInt(e.target.value) || 1);
												handleChange("properties", updatedProperties);
											}}
											className={twMerge(inputStyle, "flex-1 text-center")}
											min="1"
										/>
										<button
											type="button"
											onClick={() => {
												const updatedProperties = [...form.properties];
												updatedProperties[idx].quantity++;
												handleChange("properties", updatedProperties);
											}}
											className="bg-primary text-white px-3 py-2 rounded font-bold">
											<IconWrapper>
												<PlusIcon />
											</IconWrapper>
										</button>
									</div>
								</div>
								{form.properties.length > 1 && (
									<button
										type="button"
										onClick={() => {
											const updatedProperties = form.properties.filter((_, i) => i !== idx);
											handleChange("properties", updatedProperties);
										}}
										className="bg-red-500 text-white px-3 py-3 rounded font-bold">
										<IconWrapper>
											<TrashIcon />
										</IconWrapper>
									</button>
								)}
							</div>
						</div>
					))}

					<button
						type="button"
						onClick={() => {
							const updatedProperties = [...form.properties, { propertyName: "", quantity: 1 }];
							handleChange("properties", updatedProperties);
						}}
						className="mt-4 px-4 py-2 bg-primary text-white rounded">
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
						"Send Request"
					)}
				</ActionButton>
			</div>
		</form>
	);
}
