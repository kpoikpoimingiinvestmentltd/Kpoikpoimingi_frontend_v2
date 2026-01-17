import CustomInput from "@/components/base/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { inputStyle, labelStyle } from "@/components/common/commonStyles";
import ValidationErrorDisplay from "@/components/common/ValidationErrorDisplay";
import { twMerge } from "tailwind-merge";
import type { InstallmentPaymentForm } from "@/types/customerRegistration";

type Props = {
	form: InstallmentPaymentForm;
	handleChange: (key: string, value: unknown) => void;
	employmentStatusOptions: Array<{ key: string; value: string }>;
	refLoading: boolean;
	centeredContainer: (additionalClasses?: string) => string;
	sectionTitle: (additionalClasses?: string) => string;
	missingFields?: string[];
};

export default function EmploymentDetailsSection({
	form,
	handleChange,
	employmentStatusOptions,
	centeredContainer,
	sectionTitle,
	missingFields = [],
}: Props) {
	const isSelfEmployed =
		form.employment.status &&
		(form.employment.status === "Self employer" ||
			employmentStatusOptions.some((o) => o.key === form.employment.status && o.value.toLowerCase().includes("self")));

	return (
		<div className={centeredContainer()}>
			<h3 className={sectionTitle()}>Employment Details</h3>
			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className={isSelfEmployed ? "col-span-2" : ""}>
					<label className={labelStyle()}>Employment status*</label>
					<Select value={form.employment.status} onValueChange={(v) => handleChange("employment", { ...form.employment, status: v })}>
						<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 cursor-pointer")}>
							<SelectValue placeholder="Select status" />
						</SelectTrigger>
						<SelectContent>
							{employmentStatusOptions.length === 0 ? (
								<>
									<SelectItem value="1">EMPLOYED</SelectItem>
									<SelectItem value="2">SELF EMPLOYED</SelectItem>
								</>
							) : (
								employmentStatusOptions.map((it) => (
									<SelectItem key={it.key} value={it.key}>
										{it.value}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				</div>

				{isSelfEmployed ? (
					<>
						<div className="mt-4 col-span-full">
							<label className={labelStyle()}>Home address*</label>
							<Textarea
								value={form.employment.homeAddress}
								onChange={(e) => handleChange("employment", { ...form.employment, homeAddress: e.target.value })}
								className={twMerge(inputStyle)}
							/>
						</div>
					</>
				) : (
					<>
						<CustomInput
							label="Company name"
							required
							labelClassName={labelStyle()}
							value={form.employment.companyName}
							onChange={(e) => handleChange("employment", { ...form.employment, companyName: e.target.value })}
							className={twMerge(inputStyle)}
						/>

						<div className="mt-4 col-span-full">
							<label className={labelStyle()}>Company address*</label>
							<Textarea
								value={form.employment.businessAddress}
								onChange={(e) => handleChange("employment", { ...form.employment, businessAddress: e.target.value })}
								className={twMerge(inputStyle)}
							/>
						</div>
					</>
				)}
			</div>

			<ValidationErrorDisplay
				missingFields={missingFields}
				filter={(field) => ["Employment status"].some((keyword) => field.toLowerCase().includes(keyword.toLowerCase()))}
			/>
		</div>
	);
}
