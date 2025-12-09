import CustomInput from "@/components/base/CustomInput";
import { inputStyle, labelStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import { CalendarIcon, EmailIcon, WhatsappIcon } from "@/assets/icons";
import ValidationErrorDisplay from "@/components/common/ValidationErrorDisplay";
import type { InstallmentPaymentForm } from "@/types/customerRegistration";

type Props = {
	form: InstallmentPaymentForm;
	handleChange: (key: string, value: unknown) => void;
	centeredContainer: (additionalClasses?: string) => string;
	sectionTitle: (additionalClasses?: string) => string;
	missingFields?: string[];
};

export default function PersonalDetailsSection({ form, handleChange, centeredContainer, sectionTitle, missingFields = [] }: Props) {
	return (
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
					iconRight={<EmailIcon />}
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
				<CustomInput value={form.address} onChange={(e) => handleChange("address", e.target.value)} className={twMerge(inputStyle)} />
			</div>

			<ValidationErrorDisplay
				missingFields={missingFields}
				filter={(field) =>
					["Full name", "Email", "WhatsApp", "Date of birth", "Home address"].some((keyword) => field.toLowerCase().includes(keyword.toLowerCase()))
				}
			/>
		</div>
	);
}
