import React from "react";
import CustomInput from "@/components/base/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { inputStyle, labelStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import UploadBox from "@/components/base/UploadBox";
import { WhatsappIcon, CalendarIcon, PhoneIcon, EmailIcon } from "../../assets/icons";
import CheckboxField from "@/components/base/CheckboxField";
import ActionButton from "../../components/base/ActionButton";

type Props = {
	onSubmit?: (data: any) => void;
	initial?: any;
	sectionTitle?: (additionalClasses?: string) => string;
	centeredContainer?: (additionalClasses?: string) => string;
};

export default function CustomerForm({ onSubmit, initial, sectionTitle: sectionTitleProp, centeredContainer: centeredContainerProp }: Props) {
	const baseEachSectionTitle = "text-lg font-normal";
	const baseCenteredContainer = "mx-auto w-full md:w-2/3 w-full";

	const sectionTitle = sectionTitleProp || ((additionalClasses?: string) => twMerge(baseEachSectionTitle, additionalClasses));
	const centeredContainer = centeredContainerProp || ((additionalClasses?: string) => twMerge(baseCenteredContainer, additionalClasses));
	const [form, setForm] = React.useState(() => ({
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
	}));

	const handleChange = (key: string, value: any) => setForm((s) => ({ ...s, [key]: value }));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit?.(form);
	};

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
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
					<CustomInput
						label="Whatsapp number"
						required
						labelClassName={labelStyle()}
						value={form.whatsapp}
						onChange={(e) => handleChange("whatsapp", e.target.value)}
						className={twMerge(inputStyle)}
						iconRight={<WhatsappIcon />}
					/>
					<CustomInput
						label="Date of birth"
						required
						labelClassName={labelStyle()}
						value={form.dob}
						type="date"
						onChange={(e) => handleChange("dob", e.target.value)}
						className={twMerge(inputStyle)}
						iconRight={<CalendarIcon />}
					/>
				</div>

				<div className="mt-4">
					<label className={labelStyle()}>Home Address*</label>
					<Textarea
						value={form.address}
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
							className={form.isDriver ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
							Yes
						</button>
						<button
							type="button"
							onClick={() => handleChange("isDriver", false)}
							className={!form.isDriver ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
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
						value={form.nextOfKin.fullName}
						onChange={(e) => handleChange("nextOfKin", { ...form.nextOfKin, fullName: e.target.value })}
						className={twMerge(inputStyle)}
					/>
					<CustomInput
						label="Phone number"
						required
						labelClassName={labelStyle()}
						value={form.nextOfKin.phone}
						onChange={(e) => handleChange("nextOfKin", { ...form.nextOfKin, phone: e.target.value })}
						className={twMerge(inputStyle)}
					/>
				</div>

				<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="col-span-full">
						<label className={labelStyle()}>Relationship*</label>
						<Select value={form.nextOfKin.relationship} onValueChange={(v) => handleChange("nextOfKin", { ...form.nextOfKin, relationship: v })}>
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
						value={form.nextOfKin.spouseName}
						onChange={(e) => handleChange("nextOfKin", { ...form.nextOfKin, spouseName: e.target.value })}
						className={twMerge(inputStyle)}
					/>
				</div>

				<div className="mt-4">
					<label className={labelStyle()}>Address*</label>
					<Textarea
						value={form.nextOfKin.address}
						onChange={(e) => handleChange("nextOfKin", { ...form.nextOfKin, address: e.target.value })}
						className={twMerge(inputStyle)}
					/>
				</div>
			</div>

			<hr className="my-6" />

			{/* Property Details */}
			<div className={centeredContainer()}>
				<h3 className={sectionTitle()}>Property Details</h3>
				<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<CustomInput
						label="Property Name"
						required
						labelClassName={labelStyle()}
						value={form.propertyName}
						onChange={(e) => handleChange("propertyName", e.target.value)}
						className={twMerge(inputStyle)}
					/>
					<div>
						<label className={labelStyle()}>Payment frequency*</label>
						<Select value={form.paymentFrequency} onValueChange={(v) => handleChange("paymentFrequency", v)}>
							<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11")}>
								<SelectValue placeholder="Select frequency" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Monthly">Monthly</SelectItem>
								<SelectItem value="Weekly">Weekly</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<CustomInput
						label="Payment duration"
						required
						labelClassName={labelStyle()}
						value={form.paymentDuration}
						onChange={(e) => handleChange("paymentDuration", e.target.value)}
						className={twMerge(inputStyle)}
					/>
					<CustomInput
						label="Down payment amount"
						required
						labelClassName={labelStyle()}
						value={form.downPayment}
						onChange={(e) => handleChange("downPayment", e.target.value)}
						className={twMerge(inputStyle)}
					/>
				</div>

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
						value={form.amountAvailable}
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
								onClick={() => handleChange("clarification", { ...form.clarification, previousAgreement: true })}
								className={form.clarification.previousAgreement ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
								Yes
							</button>
							<button
								type="button"
								onClick={() => handleChange("clarification", { ...form.clarification, previousAgreement: false })}
								className={!form.clarification.previousAgreement ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
								No
							</button>
						</div>
					</div>

					<div className="my-4 flex items-center gap-4">
						<div className="flex items-center gap-2">
							<label className="text-sm">Have you completed that agreement?</label>
							<button
								type="button"
								onClick={() => handleChange("clarification", { ...form.clarification, completedAgreement: true })}
								className={form.clarification.completedAgreement ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
								Yes
							</button>
							<button
								type="button"
								onClick={() => handleChange("clarification", { ...form.clarification, completedAgreement: false })}
								className={!form.clarification.completedAgreement ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
								No
							</button>
						</div>
					</div>

					<CustomInput
						label="Previous Company"
						required
						labelClassName={labelStyle()}
						value={form.clarification.prevCompany}
						onChange={(e) => handleChange("clarification", { ...form.clarification, prevCompany: e.target.value })}
						className={twMerge(inputStyle)}
					/>
				</div>

				<hr className="my-6" />

				<div className={centeredContainer()}>
					<h3 className={sectionTitle()}>Employment Details</h3>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className={labelStyle()}>Employment status*</label>
							<Select value={form.employment.status} onValueChange={(v) => handleChange("employment", { ...form.employment, status: v })}>
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
							value={form.employment.employerName}
							onChange={(e) => handleChange("employment", { ...form.employment, employerName: e.target.value })}
							className={twMerge(inputStyle)}
						/>
					</div>

					<div className="mt-4">
						<label className={labelStyle()}>Employer address*</label>
						<Textarea
							value={form.employment.employerAddress}
							onChange={(e) => handleChange("employment", { ...form.employment, employerAddress: e.target.value })}
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
				{form.guarantors.map((g: any, idx: number) => (
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
									const next = [...form.guarantors];
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
									const next = [...form.guarantors];
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
									const next = [...form.guarantors];
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
									const next = [...form.guarantors];
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
										const next = [...form.guarantors];
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
									const next = [...form.guarantors];
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
									const next = [...form.guarantors];
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
									const next = [...form.guarantors];
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
