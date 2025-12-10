import CustomInput from "@/components/base/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { inputStyle, labelStyle } from "@/components/common/commonStyles";
import ValidationErrorDisplay from "@/components/common/ValidationErrorDisplay";
import { twMerge } from "tailwind-merge";
import { PhoneIcon } from "@/assets/icons";
import type { InstallmentPaymentForm } from "@/types/customerRegistration";

type Props = {
	form: InstallmentPaymentForm;
	handleChange: (key: string, value: unknown) => void;
	relationshipOptions: Array<{ key: string; value: string }>;
	refLoading: boolean;
	centeredContainer: (additionalClasses?: string) => string;
	sectionTitle: (additionalClasses?: string) => string;
	missingFields?: string[];
};

export default function NextOfKinSection({
	form,
	handleChange,
	relationshipOptions,
	refLoading,
	centeredContainer,
	sectionTitle,
	missingFields = [],
}: Props) {
	const isSpouse =
		form.nextOfKin.relationship &&
		(form.nextOfKin.relationship === "Spouse" ||
			relationshipOptions.some((o) => o.key === form.nextOfKin.relationship && o.value.toLowerCase().includes("spouse")));

	return (
		<>
			<div className={centeredContainer()}>
				<h3 className={sectionTitle()}>Next Of Kin Details</h3>

				{isSpouse ? (
					<>
						<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
							<CustomInput
								label="Spouse Name"
								required
								labelClassName={labelStyle()}
								value={form.nextOfKin.spouseName}
								onChange={(e) => handleChange("nextOfKin", { ...form.nextOfKin, spouseName: e.target.value })}
								className={twMerge(inputStyle)}
							/>
							<CustomInput
								label="Phone number"
								required
								labelClassName={labelStyle()}
								type="tel"
								inputMode="numeric"
								pattern="\d*"
								maxLength={11}
								value={form.nextOfKin.spousePhone}
								onKeyDown={(e) => {
									if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
								}}
								onChange={(e) => handleChange("nextOfKin", { ...form.nextOfKin, spousePhone: e.target.value })}
								className={twMerge(inputStyle)}
								iconRight={<PhoneIcon />}
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

						<div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-4">
							<div>
								<label className={labelStyle()}>Relationship*</label>
								<Select value={form.nextOfKin.relationship} onValueChange={(v) => handleChange("nextOfKin", { ...form.nextOfKin, relationship: v })}>
									<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 cursor-pointer")}>
										<SelectValue placeholder="Select relationship" />
									</SelectTrigger>
									<SelectContent>
										{refLoading ? (
											<div className="p-3 text-center">
												<Spinner className="size-4" />
											</div>
										) : relationshipOptions.length === 0 ? (
											<>
												<SelectItem value="Spouse">Spouse</SelectItem>
												<SelectItem value="Father">Father</SelectItem>
												<SelectItem value="Mother">Mother</SelectItem>
												<SelectItem value="Son">Son</SelectItem>
												<SelectItem value="Daughter">Daughter</SelectItem>
												<SelectItem value="Brother">Brother</SelectItem>
												<SelectItem value="Sister">Sister</SelectItem>
												<SelectItem value="Grandfather">Grandfather</SelectItem>
												<SelectItem value="Grandmother">Grandmother</SelectItem>
												<SelectItem value="Uncle">Uncle</SelectItem>
												<SelectItem value="Aunt">Aunt</SelectItem>
												<SelectItem value="Cousin">Cousin</SelectItem>
												<SelectItem value="Friend">Friend</SelectItem>
											</>
										) : (
											relationshipOptions.map((it) => (
												<SelectItem key={it.key} value={it.key}>
													{it.value}
												</SelectItem>
											))
										)}
									</SelectContent>
								</Select>
							</div>
						</div>
					</>
				) : (
					// NON-SPOUSE MODE: Show basic next of kin fields
					<>
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
								type="tel"
								inputMode="numeric"
								pattern="\d*"
								maxLength={11}
								value={form.nextOfKin.phone}
								onKeyDown={(e) => {
									if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
								}}
								onChange={(e) => handleChange("nextOfKin", { ...form.nextOfKin, phone: e.target.value })}
								className={twMerge(inputStyle)}
								iconRight={<PhoneIcon />}
							/>
						</div>

						<div className="mt-4 grid grid-cols-1 md:grid-cols-1 gap-4">
							<div>
								<label className={labelStyle()}>Relationship*</label>
								<Select value={form.nextOfKin.relationship} onValueChange={(v) => handleChange("nextOfKin", { ...form.nextOfKin, relationship: v })}>
									<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 cursor-pointer")}>
										<SelectValue placeholder="Select relationship" />
									</SelectTrigger>
									<SelectContent>
										{refLoading ? (
											<div className="p-3 text-center">
												<Spinner className="size-4" />
											</div>
										) : relationshipOptions.length === 0 ? (
											<>
												<SelectItem value="Spouse">Spouse</SelectItem>
												<SelectItem value="Father">Father</SelectItem>
												<SelectItem value="Mother">Mother</SelectItem>
												<SelectItem value="Son">Son</SelectItem>
												<SelectItem value="Daughter">Daughter</SelectItem>
												<SelectItem value="Brother">Brother</SelectItem>
												<SelectItem value="Sister">Sister</SelectItem>
												<SelectItem value="Grandfather">Grandfather</SelectItem>
												<SelectItem value="Grandmother">Grandmother</SelectItem>
												<SelectItem value="Uncle">Uncle</SelectItem>
												<SelectItem value="Aunt">Aunt</SelectItem>
												<SelectItem value="Cousin">Cousin</SelectItem>
												<SelectItem value="Friend">Friend</SelectItem>
											</>
										) : (
											relationshipOptions.map((it) => (
												<SelectItem key={it.key} value={it.key}>
													{it.value}
												</SelectItem>
											))
										)}
									</SelectContent>
								</Select>
							</div>
						</div>

						<ValidationErrorDisplay
							missingFields={missingFields}
							filter={(field) => ["Next of Kin", "Spouse", "relationship"].some((keyword) => field.toLowerCase().includes(keyword.toLowerCase()))}
						/>
					</>
				)}
			</div>
			<hr className="my-6" />
		</>
	);
}
