import CustomInput from "@/components/base/CustomInput";
import { inputStyle, labelStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import type { InstallmentPaymentForm } from "@/types/customerRegistration";

type Props = {
	form: InstallmentPaymentForm;
	handleChange: (key: string, value: any) => void;
	centeredContainer: (additionalClasses?: string) => string;
	sectionTitle: (additionalClasses?: string) => string;
};

export default function ClarificationDetailsSection({ form, handleChange, centeredContainer, sectionTitle }: Props) {
	return (
		<div className={centeredContainer()}>
			<h3 className={sectionTitle()}>Clarification Details</h3>
			<div className="mt-4 flex items-center gap-4">
				<div className="flex items-center gap-2">
					<label className="text-sm">Have you previously entered hire purchase agreement?</label>
					<button
						type="button"
						onClick={() => handleChange("clarification", { ...form.clarification, previousAgreement: true })}
						className={form.clarification.previousAgreement === true ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
						Yes
					</button>
					<button
						type="button"
						onClick={() => handleChange("clarification", { ...form.clarification, previousAgreement: false })}
						className={form.clarification.previousAgreement === false ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
						No
					</button>
				</div>
			</div>

			{form.clarification.previousAgreement === true && (
				<>
					<div className="my-4 flex items-center gap-4">
						<div className="flex items-center gap-2">
							<label className="text-sm">Have you completed that agreement?</label>
							<button
								type="button"
								onClick={() => handleChange("clarification", { ...form.clarification, completedAgreement: true })}
								className={form.clarification.completedAgreement === true ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
								Yes
							</button>
							<button
								type="button"
								onClick={() => handleChange("clarification", { ...form.clarification, completedAgreement: false })}
								className={form.clarification.completedAgreement === false ? "bg-primary text-white px-3 py-1 rounded" : "border px-3 py-1 rounded"}>
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
				</>
			)}
		</div>
	);
}
