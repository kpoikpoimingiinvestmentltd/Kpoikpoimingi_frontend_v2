import React from "react";
import CustomInput from "@/components/base/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { inputStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import ImageGallery from "@/components/base/ImageGallery";

type Props = {
	onSubmit?: (data: any) => void;
	initial?: any;
};

export default function CustomerForm({ onSubmit, initial }: Props) {
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
		clarification: initial?.clarification ?? { previousAgreement: false, completedAgreement: false, prevCompany: "" },
		employment: initial?.employment ?? { status: "", employerName: "", employerAddress: "" },
		guarantors: initial?.guarantors ?? [
			{ fullName: "", occupation: "", phone: "", email: "", employmentStatus: "", homeAddress: "", businessAddress: "", stateOfOrigin: "" },
		],
	}));

	const handleChange = (key: string, value: any) => setForm((s) => ({ ...s, [key]: value }));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit?.(form);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium mb-2">Full name*</label>
					<CustomInput value={form.fullName} onChange={(e) => handleChange("fullName", e.target.value)} className={twMerge(inputStyle)} />
				</div>
				<div>
					<label className="block text-sm font-medium mb-2">Email*</label>
					<CustomInput value={form.email} onChange={(e) => handleChange("email", e.target.value)} className={twMerge(inputStyle)} />
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium mb-2">Whatsapp number*</label>
					<CustomInput value={form.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} className={twMerge(inputStyle)} />
				</div>
				<div>
					<label className="block text-sm font-medium mb-2">Date of birth*</label>
					<CustomInput value={form.dob} onChange={(e) => handleChange("dob", e.target.value)} className={twMerge(inputStyle)} />
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium mb-2">Home Address*</label>
				<Textarea value={form.address} onChange={(e) => handleChange("address", e.target.value)} className={twMerge(inputStyle, "h-auto min-h-24")} />
			</div>

			{/* Identification Document section */}
			<div>
				<h3 className="text-lg font-medium">Identification Document</h3>
				<div className="mt-3 flex items-center gap-4">
					<div className="flex items-center gap-2">
						<label className="text-sm mr-2">Are you a driver?</label>
						<button
							type="button"
							onClick={() => handleChange("isDriver", true)}
							className={form.isDriver ? "bg-sky-500 text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
							Yes
						</button>
						<button
							type="button"
							onClick={() => handleChange("isDriver", false)}
							className={!form.isDriver ? "bg-gray-100 px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
							No
						</button>
					</div>
				</div>

				<div className="mt-4 space-y-4">
					<ImageGallery mode="upload" containerBorder="dashed" placeholderText="NIN" uploadButtonText="Upload" />
					<ImageGallery mode="upload" containerBorder="dashed" placeholderText="Drivers license" uploadButtonText="Upload" />
					<ImageGallery mode="upload" containerBorder="dashed" placeholderText="Signed Contract" uploadButtonText="Upload" />
				</div>
			</div>

			{/* Next of Kin Details */}
			<div>
				<h3 className="text-lg font-medium">Next Of Kin Details</h3>
				<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium mb-2">Full Name*</label>
						<CustomInput
							value={form.nextOfKin.fullName}
							onChange={(e) => handleChange("nextOfKin", { ...form.nextOfKin, fullName: e.target.value })}
							className={twMerge(inputStyle)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">Phone number*</label>
						<CustomInput
							value={form.nextOfKin.phone}
							onChange={(e) => handleChange("nextOfKin", { ...form.nextOfKin, phone: e.target.value })}
							className={twMerge(inputStyle)}
						/>
					</div>
				</div>

				<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium mb-2">Relationship*</label>
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
					<label className="block text-sm font-medium mb-2">Spouse Name*</label>
					<CustomInput
						value={form.nextOfKin.spouseName}
						onChange={(e) => handleChange("nextOfKin", { ...form.nextOfKin, spouseName: e.target.value })}
						className={twMerge(inputStyle)}
					/>
				</div>

				<div className="mt-4">
					<label className="block text-sm font-medium mb-2">Address*</label>
					<Textarea
						value={form.nextOfKin.address}
						onChange={(e) => handleChange("nextOfKin", { ...form.nextOfKin, address: e.target.value })}
						className={twMerge(inputStyle)}
					/>
				</div>
			</div>

			{/* Property Details */}
			<div>
				<h3 className="text-lg font-medium">Property Details</h3>
				<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium mb-2">Property Name*</label>
						<CustomInput value={form.propertyName} onChange={(e) => handleChange("propertyName", e.target.value)} className={twMerge(inputStyle)} />
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">Payment frequency*</label>
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
					<div>
						<label className="block text-sm font-medium mb-2">Payment duration*</label>
						<CustomInput
							value={form.paymentDuration}
							onChange={(e) => handleChange("paymentDuration", e.target.value)}
							className={twMerge(inputStyle)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">Down payment amount*</label>
						<CustomInput value={form.downPayment} onChange={(e) => handleChange("downPayment", e.target.value)} className={twMerge(inputStyle)} />
					</div>
				</div>

				<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium mb-2">Why do you need this property*</label>
						<CustomInput
							value={form.clarification.reason}
							onChange={(e) => handleChange("clarification", { ...form.clarification, reason: e.target.value })}
							className={twMerge(inputStyle)}
						/>
					</div>
					<div>
						<label className="block text-sm font-medium mb-2">Amount available for down payment*</label>
						<CustomInput
							value={form.amountAvailable}
							onChange={(e) => handleChange("amountAvailable", e.target.value)}
							className={twMerge(inputStyle)}
						/>
					</div>
				</div>
			</div>

			{/* Clarification & Employment & Guarantor sections */}
			<div className="mt-6 space-y-6">
				<div>
					<h3 className="text-lg font-medium">Clarification Details</h3>
					<div className="mt-3 flex items-center gap-4">
						<div className="flex items-center gap-2">
							<label className="text-sm">Have you previously entered hire purchase agreement?</label>
							<button
								type="button"
								onClick={() => handleChange("clarification", { ...form.clarification, previousAgreement: true })}
								className={form.clarification.previousAgreement ? "bg-sky-500 text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
								Yes
							</button>
							<button
								type="button"
								onClick={() => handleChange("clarification", { ...form.clarification, previousAgreement: false })}
								className={!form.clarification.previousAgreement ? "bg-gray-100 px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
								No
							</button>
						</div>
					</div>
				</div>

				<div>
					<h3 className="text-lg font-medium">Employment Details</h3>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2">Employment status*</label>
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
						<div>
							<label className="block text-sm font-medium mb-2">Employer name *</label>
							<CustomInput
								value={form.employment.employerName}
								onChange={(e) => handleChange("employment", { ...form.employment, employerName: e.target.value })}
								className={twMerge(inputStyle)}
							/>
						</div>
					</div>

					<div className="mt-4">
						<label className="block text-sm font-medium mb-2">Employer address*</label>
						<Textarea
							value={form.employment.employerAddress}
							onChange={(e) => handleChange("employment", { ...form.employment, employerAddress: e.target.value })}
							className={twMerge(inputStyle)}
						/>
					</div>
				</div>

				<div>
					<h3 className="text-lg font-medium">Guarantor (1)</h3>
					<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2">Full name*</label>
							<CustomInput
								value={form.guarantors[0].fullName}
								onChange={(e) => handleChange("guarantors", [{ ...form.guarantors[0], fullName: e.target.value }])}
								className={twMerge(inputStyle)}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2">Occupation *</label>
							<CustomInput
								value={form.guarantors[0].occupation}
								onChange={(e) => handleChange("guarantors", [{ ...form.guarantors[0], occupation: e.target.value }])}
								className={twMerge(inputStyle)}
							/>
						</div>
					</div>

					<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2">Phone number*</label>
							<CustomInput
								value={form.guarantors[0].phone}
								onChange={(e) => handleChange("guarantors", [{ ...form.guarantors[0], phone: e.target.value }])}
								className={twMerge(inputStyle)}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2">Email *</label>
							<CustomInput
								value={form.guarantors[0].email}
								onChange={(e) => handleChange("guarantors", [{ ...form.guarantors[0], email: e.target.value }])}
								className={twMerge(inputStyle)}
							/>
						</div>
					</div>

					<div className="mt-4">
						<label className="block text-sm font-medium mb-2">Business address*</label>
						<CustomInput
							value={form.guarantors[0].businessAddress}
							onChange={(e) => handleChange("guarantors", [{ ...form.guarantors[0], businessAddress: e.target.value }])}
							className={twMerge(inputStyle)}
						/>
					</div>
				</div>
			</div>

			<div className="flex justify-center mt-8">
				<Button type="submit" className="w-full md:w-1/2 bg-sky-500 text-white py-3">
					Save Changes
				</Button>
			</div>
		</form>
	);
}
