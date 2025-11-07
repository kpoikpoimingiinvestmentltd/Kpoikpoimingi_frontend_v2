import React from "react";
import CustomInput from "@/components/base/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { inputStyle, labelStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import UploadBox from "@/components/base/UploadBox";
import { WhatsappIcon, CalendarIcon, PhoneIcon, EmailIcon, TrashIcon, IconWrapper, PlusIcon, MinusIcon } from "../../assets/icons";
import CheckboxField from "@/components/base/CheckboxField";
import ActionButton from "../../components/base/ActionButton";

type Props = {
	onSubmit?: (data: any) => void;
	initial?: any;
	sectionTitle?: (additionalClasses?: string) => string;
	centeredContainer?: (additionalClasses?: string) => string;
	paymentMethod?: "once" | "installment";
};

type PropertyItem = {
	propertyName: string;
	quantity: number;
};

type OncePaymentForm = {
	fullName: string;
	email: string;
	whatsapp: string;
	numberOfProperties: string;
	properties: PropertyItem[];
};

type InstallmentPaymentForm = {
	fullName: string;
	email: string;
	whatsapp: string;
	dob: string;
	address: string;
	isDriver: boolean;
	ninUploaded: boolean;
	driverLicenseUploaded: boolean;
	contractUploaded: boolean;
	nextOfKin: { fullName: string; phone: string; relationship: string; spouseName: string; spousePhone: string; address: string };
	propertyName: string;
	paymentFrequency: string;
	paymentDuration: string;
	downPayment: string;
	amountAvailable: string;
	clarification: { previousAgreement: boolean; completedAgreement: boolean; prevCompany: string; reason: string };
	employment: { status: string; employerName: string; employerAddress: string };
	guarantors: Array<{
		fullName: string;
		occupation: string;
		phone: string;
		email: string;
		employmentStatus: string;
		homeAddress: string;
		businessAddress: string;
		stateOfOrigin: string;
		votersUploaded: number;
	}>;
};

export default function CustomerForm({
	onSubmit,
	initial,
	sectionTitle: sectionTitleProp,
	centeredContainer: centeredContainerProp,
	paymentMethod,
}: Props) {
	const baseEachSectionTitle = "text-lg font-normal";
	const baseCenteredContainer = "mx-auto w-full md:w-2/3 w-full";

	const sectionTitle = sectionTitleProp || ((additionalClasses?: string) => twMerge(baseEachSectionTitle, additionalClasses));
	const centeredContainer = centeredContainerProp || ((additionalClasses?: string) => twMerge(baseCenteredContainer, additionalClasses));

	// Initialize form based on payment method
	const initializeForm = () => {
		if (paymentMethod === "once") {
			return {
				fullName: initial?.fullName ?? "",
				email: initial?.email ?? "",
				whatsapp: initial?.whatsapp ?? "",
				numberOfProperties: initial?.numberOfProperties ?? "",
				properties: initial?.properties ?? [{ propertyName: "", quantity: 1 }],
			} as OncePaymentForm;
		}

		return {
			fullName: initial?.fullName ?? "",
			email: initial?.email ?? "",
			whatsapp: initial?.whatsapp ?? "",
			dob: initial?.dob ?? "",
			address: initial?.address ?? "",
			isDriver: initial?.isDriver ?? false,
			ninUploaded: initial?.ninUploaded ?? false,
			driverLicenseUploaded: initial?.driverLicenseUploaded ?? false,
			contractUploaded: initial?.contractUploaded ?? false,
			nextOfKin: initial?.nextOfKin ?? { fullName: "", phone: "", relationship: "", spouseName: "", spousePhone: "", address: "" },
			propertyName: initial?.propertyName ?? "",
			paymentFrequency: initial?.paymentFrequency ?? "Monthly",
			paymentDuration: initial?.paymentDuration ?? "",
			downPayment: initial?.downPayment ?? "",
			amountAvailable: initial?.amountAvailable ?? "",
			clarification: initial?.clarification ?? { previousAgreement: false, completedAgreement: false, prevCompany: "", reason: "" },
			employment: initial?.employment ?? { status: "", employerName: "", employerAddress: "" },
			guarantors: initial?.guarantors ?? [
				{
					fullName: "",
					occupation: "",
					phone: "",
					email: "",
					employmentStatus: "",
					homeAddress: "",
					businessAddress: "",
					stateOfOrigin: "",
					votersUploaded: 0,
				},
				{
					fullName: "",
					occupation: "",
					phone: "",
					email: "",
					employmentStatus: "",
					homeAddress: "",
					businessAddress: "",
					stateOfOrigin: "",
					votersUploaded: 0,
				},
			],
		} as InstallmentPaymentForm;
	};

	const [form, setForm] = React.useState(initializeForm);

	const handleChange = (key: string, value: any) => setForm((s) => ({ ...s, [key]: value }));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit?.(form);
	};

	// Render the "Once" payment form (simplified form)
	if (paymentMethod === "once") {
		const onceForm = form as OncePaymentForm;
		return (
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className={centeredContainer()}>
					<div className="mb-10 text-center">
						<h3 className={sectionTitle("font-medium")}>Request Details</h3>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
						<CustomInput
							label="Full name"
							required
							labelClassName={labelStyle()}
							value={onceForm.fullName}
							onChange={(e) => handleChange("fullName", e.target.value)}
							className={twMerge(inputStyle)}
						/>

						<CustomInput
							label="Email"
							required
							labelClassName={labelStyle()}
							value={onceForm.email}
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
							value={onceForm.whatsapp}
							onChange={(e) => handleChange("whatsapp", e.target.value)}
							className={twMerge(inputStyle)}
							iconRight={<WhatsappIcon />}
						/>
						<CustomInput
							label="Number of properties"
							required
							type="number"
							labelClassName={labelStyle()}
							value={onceForm.numberOfProperties}
							onChange={(e) => handleChange("numberOfProperties", e.target.value)}
							className={twMerge(inputStyle)}
						/>
					</div>

					{/* Properties list */}
					<div className="mt-6">
						<h4 className="text-sm font-medium mb-4">Properties</h4>
						{onceForm.properties.map((property, idx) => (
							<div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
								<CustomInput
									label={`Property Name${idx > 0 ? ` ${idx + 1}` : ""}`}
									required
									labelClassName={labelStyle()}
									value={property.propertyName}
									onChange={(e) => {
										const updatedProperties = [...onceForm.properties];
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
													const updatedProperties = [...onceForm.properties];
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
													const updatedProperties = [...onceForm.properties];
													updatedProperties[idx].quantity = Math.max(1, parseInt(e.target.value) || 1);
													handleChange("properties", updatedProperties);
												}}
												className={twMerge(inputStyle, "flex-1 text-center")}
												min="1"
											/>
											<button
												type="button"
												onClick={() => {
													const updatedProperties = [...onceForm.properties];
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
									{onceForm.properties.length > 1 && (
										<button
											type="button"
											onClick={() => {
												const updatedProperties = onceForm.properties.filter((_, i) => i !== idx);
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
								const updatedProperties = [...onceForm.properties, { propertyName: "", quantity: 1 }];
								handleChange("properties", updatedProperties);
							}}
							className="mt-4 px-4 py-2 bg-primary text-white rounded">
							+ Add Property
						</button>
					</div>
				</div>

				<div className="flex justify-center mt-8">
					<ActionButton type="submit" className="w-full md:w-2/3 bg-primary text-white py-3">
						Send Request
					</ActionButton>
				</div>
			</form>
		);
	}

	// Render the installment payment form (full form)
	const installmentForm = form as InstallmentPaymentForm;
	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Personal details - centered half width */}
			<div className={centeredContainer()}>
				<h3 className={sectionTitle()}>Personal details</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
					<CustomInput
						label="Full name"
						required
						labelClassName={labelStyle()}
						value={installmentForm.fullName}
						onChange={(e) => handleChange("fullName", e.target.value)}
						className={twMerge(inputStyle)}
					/>

					<CustomInput
						label="Email"
						required
						labelClassName={labelStyle()}
						value={installmentForm.email}
						onChange={(e) => handleChange("email", e.target.value)}
						className={twMerge(inputStyle)}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
					<CustomInput
						label="Whatsapp number"
						required
						labelClassName={labelStyle()}
						value={installmentForm.whatsapp}
						onChange={(e) => handleChange("whatsapp", e.target.value)}
						className={twMerge(inputStyle)}
						iconRight={<WhatsappIcon />}
					/>
					<CustomInput
						label="Date of birth"
						required
						labelClassName={labelStyle()}
						value={installmentForm.dob}
						type="date"
						onChange={(e) => handleChange("dob", e.target.value)}
						className={twMerge(inputStyle)}
						iconRight={<CalendarIcon />}
					/>
				</div>

				<div className="mt-4">
					<label className={labelStyle()}>Home Address*</label>
					<Textarea
						value={installmentForm.address}
						onChange={(e) => handleChange("address", e.target.value)}
						className={twMerge(inputStyle, "h-auto min-h-24")}
					/>
				</div>
				<div className="mt-6">
					<UploadBox placeholder="Upload Indigene certificate" />
				</div>
			</div>

			<hr className="my-6" />

			{/* Identification Document section */}
			<div className={centeredContainer()}>
				<h3 className={sectionTitle()}>Identification Document</h3>
				<div className="mt-4 flex items-center gap-4">
					<div className="flex items-center gap-2">
						<label className="text-sm mr-2">Are you a driver?</label>
						<button
							type="button"
							onClick={() => handleChange("isDriver", true)}
							className={installmentForm.isDriver ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
							Yes
						</button>
						<button
							type="button"
							onClick={() => handleChange("isDriver", false)}
							className={!installmentForm.isDriver ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
							No
						</button>
					</div>
				</div>

				<hr className="my-6" />

				<div className="mt-4 space-y-4">
					<UploadBox placeholder="Upload NIN or Voters Card" />
					<UploadBox placeholder="Upload Drivers License" />
					<UploadBox placeholder="Upload signed contract" />
				</div>
			</div>
			<hr className="my-6" />
			{/* Next of Kin Details */}
			<div className={centeredContainer()}>
				<h3 className={sectionTitle()}>Next Of Kin Details</h3>
				<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<CustomInput
						label="Full Name"
						required
						labelClassName={labelStyle()}
						value={installmentForm.nextOfKin.fullName}
						onChange={(e) => handleChange("nextOfKin", { ...installmentForm.nextOfKin, fullName: e.target.value })}
						className={twMerge(inputStyle)}
					/>
					<CustomInput
						label="Phone number"
						required
						labelClassName={labelStyle()}
						value={installmentForm.nextOfKin.phone}
						onChange={(e) => handleChange("nextOfKin", { ...installmentForm.nextOfKin, phone: e.target.value })}
						className={twMerge(inputStyle)}
					/>
				</div>

				<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="col-span-full">
						<label className={labelStyle()}>Relationship*</label>
						<Select
							value={installmentForm.nextOfKin.relationship}
							onValueChange={(v) => handleChange("nextOfKin", { ...installmentForm.nextOfKin, relationship: v })}>
							<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11")}>
								<SelectValue placeholder="Select relationship" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Brother">Brother</SelectItem>
								<SelectItem value="Sister">Sister</SelectItem>
								<SelectItem value="Spouse">Spouse</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="mt-4">
					<CustomInput
						label="Spouse Name"
						required
						labelClassName={labelStyle()}
						value={installmentForm.nextOfKin.spouseName}
						onChange={(e) => handleChange("nextOfKin", { ...installmentForm.nextOfKin, spouseName: e.target.value })}
						className={twMerge(inputStyle)}
					/>
				</div>

				<div className="mt-4">
					<label className={labelStyle()}>Address*</label>
					<Textarea
						value={installmentForm.nextOfKin.address}
						onChange={(e) => handleChange("nextOfKin", { ...installmentForm.nextOfKin, address: e.target.value })}
						className={twMerge(inputStyle)}
					/>
				</div>
			</div>

			<hr className="my-6" />

			{/* Property Details */}
			<div className={centeredContainer()}>
				<h3 className={sectionTitle()}>Property Details</h3>
				{paymentMethod && (
					<div className="mt-2 mb-6 p-3 bg-primary/10 border border-primary/30 rounded-md">
						<p className="text-sm text-primary font-medium">
							Selected Payment Method:{" "}
							<span className="font-semibold">{paymentMethod === "installment" ? "Pay Installmentally" : "Pay at Once"}</span>
						</p>
					</div>
				)}
				<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<CustomInput
						label="Property Name"
						required
						labelClassName={labelStyle()}
						value={installmentForm.propertyName}
						onChange={(e) => handleChange("propertyName", e.target.value)}
						className={twMerge(inputStyle)}
					/>
					<div>
						<label className={labelStyle()}>Payment frequency*</label>
						<Select value={installmentForm.paymentFrequency} onValueChange={(v) => handleChange("paymentFrequency", v)}>
							<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11")}>
								<SelectValue placeholder="Select frequency" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Monthly">Monthly</SelectItem>
								<SelectItem value="Weekly">Weekly</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>{" "}
				<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<CustomInput
						label="Payment duration"
						required
						labelClassName={labelStyle()}
						value={installmentForm.paymentDuration}
						onChange={(e) => handleChange("paymentDuration", e.target.value)}
						className={twMerge(inputStyle)}
					/>
					<CustomInput
						label="Down payment amount"
						required
						labelClassName={labelStyle()}
						value={installmentForm.downPayment}
						onChange={(e) => handleChange("downPayment", e.target.value)}
						className={twMerge(inputStyle)}
					/>
				</div>
				<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<CustomInput
						label="Why do you need this property"
						required
						labelClassName={labelStyle()}
						value={installmentForm.clarification.reason}
						onChange={(e) => handleChange("clarification", { ...installmentForm.clarification, reason: e.target.value })}
						className={twMerge(inputStyle)}
					/>
					<CustomInput
						label="Amount available for down payment"
						required
						labelClassName={labelStyle()}
						value={installmentForm.amountAvailable}
						onChange={(e) => handleChange("amountAvailable", e.target.value)}
						className={twMerge(inputStyle)}
					/>
				</div>
			</div>

			<hr className="my-6" />

			{/* Clarification & Employment & Guarantor sections */}
			<div className="mt-6 space-y-6">
				<div className={centeredContainer()}>
					<h3 className={sectionTitle()}>Clarification Details</h3>
					<div className="mt-4 flex items-center gap-4">
						<div className="flex items-center gap-2">
							<label className="text-sm">Have you previously entered hire purchase agreement?</label>
							<button
								type="button"
								onClick={() => handleChange("clarification", { ...installmentForm.clarification, previousAgreement: true })}
								className={installmentForm.clarification.previousAgreement ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
								Yes
							</button>
							<button
								type="button"
								onClick={() => handleChange("clarification", { ...installmentForm.clarification, previousAgreement: false })}
								className={!installmentForm.clarification.previousAgreement ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
								No
							</button>
						</div>
					</div>

					<div className="my-4 flex items-center gap-4">
						<div className="flex items-center gap-2">
							<label className="text-sm">Have you completed that agreement?</label>
							<button
								type="button"
								onClick={() => handleChange("clarification", { ...installmentForm.clarification, completedAgreement: true })}
								className={installmentForm.clarification.completedAgreement ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
								Yes
							</button>
							<button
								type="button"
								onClick={() => handleChange("clarification", { ...installmentForm.clarification, completedAgreement: false })}
								className={
									!installmentForm.clarification.completedAgreement ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"
								}>
								No
							</button>
						</div>
					</div>

					<CustomInput
						label="Previous Company"
						required
						labelClassName={labelStyle()}
						value={installmentForm.clarification.prevCompany}
						onChange={(e) => handleChange("clarification", { ...installmentForm.clarification, prevCompany: e.target.value })}
						className={twMerge(inputStyle)}
					/>
				</div>

				<hr className="my-6" />

				<div className={centeredContainer()}>
					<h3 className={sectionTitle()}>Employment Details</h3>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className={labelStyle()}>Employment status*</label>
							<Select
								value={installmentForm.employment.status}
								onValueChange={(v) => handleChange("employment", { ...installmentForm.employment, status: v })}>
								<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11")}>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Civil servant">Civil servant</SelectItem>
									<SelectItem value="Self employer">Self employer</SelectItem>
									<SelectItem value="Unemployed">Unemployed</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<CustomInput
							label="Employer name"
							required
							labelClassName={labelStyle()}
							value={installmentForm.employment.employerName}
							onChange={(e) => handleChange("employment", { ...installmentForm.employment, employerName: e.target.value })}
							className={twMerge(inputStyle)}
						/>
					</div>

					<div className="mt-4">
						<label className={labelStyle()}>Employer address*</label>
						<Textarea
							value={installmentForm.employment.employerAddress}
							onChange={(e) => handleChange("employment", { ...installmentForm.employment, employerAddress: e.target.value })}
							className={twMerge(inputStyle)}
						/>
					</div>
				</div>

				{/* Guarantors */}
				<div className={centeredContainer()}>
					<CheckboxField
						labelClassName="font-normal text-stone-600"
						wrapperClassName="items-start mb-4 gap-3"
						id="authorization_agree"
						label={
							<span className="text-sm">
								I hereby authorise <span className="font-medium">Kpoi Kpoi Mingi Investments Ltd</span> to retrieve the electrical appliance from me,
								or any other person at my or any other place it may be found in the event of my default in paying the Hire Purchase sum as agreed.
							</span>
						}
						labelPosition="right"
					/>
				</div>
				{installmentForm.guarantors.map((g: any, idx: number) => (
					<div key={idx} className={centeredContainer()}>
						<h3 className="text-lg font-medium">Guarantor ({idx + 1})</h3>

						<div className="mt-4">
							<CheckboxField
								wrapperClassName="items-start mb-4 gap-3"
								labelClassName="font-normal text-stone-600"
								id={`guarantor_agree_${idx}`}
								label={
									<div>
										<span className="text-sm">
											As a guarantor, I hereby guaranty to pay all sums due under the Hire Purchase Agreement in the event of default by the
											Applicant.
										</span>
										<p className="text-sm mt-3">
											I accept that messages, notices, processes and other correspondences where necessary, sent to my WhatsApp number as shown herein
											are properly delivered and served on me.
										</p>
									</div>
								}
								labelPosition="right"
							/>
						</div>

						<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
							<CustomInput
								label="Full name"
								required
								labelClassName={labelStyle()}
								value={g.fullName}
								onChange={(e) => {
									const next = [...installmentForm.guarantors];
									next[idx] = { ...next[idx], fullName: e.target.value };
									handleChange("guarantors", next);
								}}
								className={twMerge(inputStyle)}
							/>
							<CustomInput
								label="Occupation"
								required
								labelClassName={labelStyle()}
								value={g.occupation}
								onChange={(e) => {
									const next = [...installmentForm.guarantors];
									next[idx] = { ...next[idx], occupation: e.target.value };
									handleChange("guarantors", next);
								}}
								className={twMerge(inputStyle)}
							/>
						</div>

						<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
							<CustomInput
								label="Phone number"
								required
								labelClassName={labelStyle()}
								value={g.phone}
								onChange={(e) => {
									const next = [...installmentForm.guarantors];
									next[idx] = { ...next[idx], phone: e.target.value };
									handleChange("guarantors", next);
								}}
								className={twMerge(inputStyle)}
								iconRight={<PhoneIcon />}
							/>

							<CustomInput
								label="Email"
								required
								labelClassName={labelStyle()}
								value={g.email}
								onChange={(e) => {
									const next = [...installmentForm.guarantors];
									next[idx] = { ...next[idx], email: e.target.value };
									handleChange("guarantors", next);
								}}
								className={twMerge(inputStyle)}
								iconRight={<EmailIcon />}
							/>
						</div>

						<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className={labelStyle()}>Employment status*</label>
								<Select
									value={g.employmentStatus}
									onValueChange={(v) => {
										const next = [...installmentForm.guarantors];
										next[idx] = { ...next[idx], employmentStatus: v };
										handleChange("guarantors", next);
									}}>
									<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11")}>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Civil servant">Civil servant</SelectItem>
										<SelectItem value="Self employer">Self employer</SelectItem>
										<SelectItem value="Unemployed">Unemployed</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<CustomInput
								label="Home address"
								required
								labelClassName={labelStyle()}
								value={g.homeAddress}
								onChange={(e) => {
									const next = [...installmentForm.guarantors];
									next[idx] = { ...next[idx], homeAddress: e.target.value };
									handleChange("guarantors", next);
								}}
								className={twMerge(inputStyle)}
							/>
						</div>

						<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
							<CustomInput
								label="Business address"
								required
								labelClassName={labelStyle()}
								value={g.businessAddress}
								onChange={(e) => {
									const next = [...installmentForm.guarantors];
									next[idx] = { ...next[idx], businessAddress: e.target.value };
									handleChange("guarantors", next);
								}}
								className={twMerge(inputStyle)}
							/>

							<CustomInput
								label="State of origin"
								required
								labelClassName={labelStyle()}
								value={g.stateOfOrigin}
								onChange={(e) => {
									const next = [...installmentForm.guarantors];
									next[idx] = { ...next[idx], stateOfOrigin: e.target.value };
									handleChange("guarantors", next);
								}}
								className={twMerge(inputStyle)}
							/>
						</div>

						<div className="mt-7">
							<UploadBox
								placeholder="1 voters card uploaded"
								hint={g.votersUploaded ? `${g.votersUploaded} voters card uploaded` : "PNG, JPG, PDF Only"}
							/>
						</div>
					</div>
				))}
			</div>

			<div className="flex justify-center mt-8">
				<ActionButton type="submit" className="w-full md:w-2/3 bg-primary text-white py-3">
					Save Changes
				</ActionButton>
			</div>
		</form>
	);
}
