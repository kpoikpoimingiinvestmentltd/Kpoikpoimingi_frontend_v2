import CustomInput from "@/components/base/CustomInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { inputStyle, labelStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import type { InstallmentPaymentForm } from "@/types/customerRegistration";

type Props = {
	form: InstallmentPaymentForm;
	handleChange: (key: string, value: any) => void;
	paymentFrequencyOptions: Array<{ key: string; value: string }>;
	durationUnitOptions: Array<{ key: string; value: string }>;
	employmentStatusOptions: Array<{ key: string; value: string }>;
	refLoading: boolean;
	paymentMethod?: "once" | "installment";
	centeredContainer: (additionalClasses?: string) => string;
	sectionTitle: (additionalClasses?: string) => string;
};

export default function PropertyDetailsSection({
	form,
	handleChange,
	paymentFrequencyOptions,
	durationUnitOptions,
	employmentStatusOptions,
	refLoading,
	paymentMethod,
	centeredContainer,
	sectionTitle,
}: Props) {
	const isSelfEmployed =
		form.employment.status &&
		(form.employment.status === "Self employer" ||
			employmentStatusOptions.some((o) => o.key === form.employment.status && o.value.toLowerCase().includes("self")));

	return (
		<div className={centeredContainer()}>
			<h3 className={sectionTitle()}>Property Details</h3>
			{paymentMethod && (
				<div className="mt-2 mb-6 p-3 bg-primary/10 border border-primary/30 rounded-md">
					<p className="text-sm text-primary font-medium">
						Selected Payment Method: <span className="font-semibold">{paymentMethod === "installment" ? "Pay Installmentally" : "Pay at Once"}</span>
					</p>
				</div>
			)}
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
								(() => {
									const filteredIntervals = paymentFrequencyOptions.filter((it) => {
										if (isSelfEmployed) {
											return it.value.toUpperCase().includes("WEEK");
										} else {
											return it.value.toUpperCase().includes("MONTH");
										}
									});

									return filteredIntervals.length === 0 ? (
										<>{isSelfEmployed ? <SelectItem value="1">Weekly</SelectItem> : <SelectItem value="2">Monthly</SelectItem>}</>
									) : (
										filteredIntervals.map((it) => (
											<SelectItem key={it.key} value={it.key}>
												{it.value}
											</SelectItem>
										))
									);
								})()
							)}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className={labelStyle()}>Duration Unit*</label>
					<Select value={form.paymentDurationUnit} onValueChange={(v) => handleChange("paymentDurationUnit", v)}>
						<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 cursor-pointer")}>
							<SelectValue placeholder="Select unit" />
						</SelectTrigger>
						<SelectContent>
							{refLoading ? (
								<div className="p-3 text-center">
									<Spinner className="size-4" />
								</div>
							) : (
								(() => {
									const filteredUnits = durationUnitOptions.filter((it) => {
										if (isSelfEmployed) {
											return it.value.toUpperCase().includes("WEEK");
										} else {
											return it.value.toUpperCase().includes("MONTH");
										}
									});

									return filteredUnits.length === 0 ? (
										<>{isSelfEmployed ? <SelectItem value="1">Weeks</SelectItem> : <SelectItem value="2">Months</SelectItem>}</>
									) : (
										filteredUnits.map((it) => (
											<SelectItem key={it.key} value={it.key}>
												{it.value}
											</SelectItem>
										))
									);
								})()
							)}
						</SelectContent>
					</Select>
				</div>
				<div>
					<label className={labelStyle()}>{isSelfEmployed ? "For how many weeks*" : "For how many months*"}</label>
					<Select value={form.paymentDuration} onValueChange={(v) => handleChange("paymentDuration", v)}>
						<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 cursor-pointer")}>
							<SelectValue placeholder="Select duration" />
						</SelectTrigger>
						<SelectContent>
							{isSelfEmployed
								? Array.from({ length: 52 }, (_, i) => i + 1).map((num) => (
										<SelectItem key={num} value={String(num)}>
											{num} week{num !== 1 ? "s" : ""}
										</SelectItem>
								  ))
								: Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
										<SelectItem key={num} value={String(num)}>
											{num} month{num !== 1 ? "s" : ""}
										</SelectItem>
								  ))}
						</SelectContent>
					</Select>
				</div>
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
	);
}
