import CustomInput from "../../components/base/CustomInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetReferenceData } from "@/api/reference";
import { twMerge } from "tailwind-merge";
import * as React from "react";
import { inputStyle } from "../../components/common/commonStyles";
import { media } from "../../resources/images";
import Avatar from "../../components/base/Avatar";
import { CalendarIcon, EmailIcon, PhoneIcon } from "../../assets/icons";

type FormShape = {
	username?: string;
	email?: string;
	phone?: string;
	houseAddress?: string;
	stateOfOrigin?: string;
	dob?: string;
	role?: string;
	salary?: string;
	accountNumber?: string;
	accountType?: string;
	bankName?: string;
	avatar?: string;
};

export default function UserForm({
	values,
	onChange = () => {},
	onSubmit = () => {},
	submitLabel = "Save Changes",
}: {
	values: FormShape;
	onChange?: (k: keyof FormShape, v: any) => void;
	onSubmit?: () => void;
	submitLabel?: string;
}) {
	const { data: refData } = useGetReferenceData(true, false);
	const roleCandidates: { key: string; value: string }[] = React.useMemo(() => {
		if (!refData) return [];

		const prefer = ["roles", "user_roles", "userRoles", "role", "roles_list"];
		for (const k of prefer) {
			const arr = (refData as any)[k];
			if (Array.isArray(arr) && arr.length) {
				return arr.map((it: any) => {
					const value =
						it.role ?? it.status ?? it.type ?? it.method ?? it.value ?? it.key ?? it.duration ?? it.intervals ?? it.percentage ?? it.rate ?? "";
					const key = String(it.id ?? value ?? "");
					return { key, value: String(value) };
				});
			}
		}

		for (const [k, v] of Object.entries(refData)) {
			if (Array.isArray(v) && v.length) {
				const sample = v[0] as any;
				const t = String(sample.type ?? sample.key ?? "").toLowerCase();
				if (t.includes("role") || k.toLowerCase().includes("role")) {
					return v.map((it: any) => {
						const value =
							it.role ?? it.status ?? it.type ?? it.method ?? it.value ?? it.key ?? it.duration ?? it.intervals ?? it.percentage ?? it.rate ?? "";
						const key = String(it.id ?? value ?? "");
						return { key, value: String(value) };
					});
				}
			}
		}

		return [];
	}, [refData]);
	return (
		<div className="max-w-4xl mx-auto">
			<div className="flex flex-col items-center mb-6">
				<Avatar
					src={values.avatar ?? media.images.avatar}
					alt="profile"
					size={128}
					variant="editable"
					onChange={(_, preview) => onChange("avatar", preview ?? null)}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<CustomInput
						label="User Name*"
						labelClassName="text-sm block mb-2"
						className={twMerge(inputStyle)}
						value={values.username ?? ""}
						onChange={(e) => onChange("username", e.target.value)}
					/>
				</div>
				<div>
					<CustomInput
						label="Email*"
						labelClassName="text-sm block mb-2"
						className={twMerge(inputStyle)}
						value={values.email ?? ""}
						onChange={(e) => onChange("email", e.target.value)}
						iconRight={<EmailIcon />}
					/>
				</div>

				<div>
					<CustomInput
						label="Phone Number*"
						labelClassName="text-sm block mb-2"
						className={twMerge(inputStyle)}
						value={values.phone ?? ""}
						onChange={(e) => onChange("phone", e.target.value)}
						iconRight={<PhoneIcon />}
					/>
				</div>
				<div>
					<CustomInput
						label="House Address*"
						labelClassName="text-sm block mb-2"
						className={twMerge(inputStyle)}
						value={values.houseAddress ?? ""}
						onChange={(e) => onChange("houseAddress", e.target.value)}
					/>
				</div>

				<div>
					<label className="text-sm block mb-2">State of Origin*</label>
					<Select value={values.stateOfOrigin} onValueChange={(v) => onChange("stateOfOrigin", v)}>
						<SelectTrigger className={twMerge(inputStyle, "min-h-11")}>
							<SelectValue placeholder="Select state" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="lagos">Lagos</SelectItem>
							<SelectItem value="abuja">Abuja</SelectItem>
							<SelectItem value="oyo">Oyo</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div>
					<CustomInput
						label="Date Of Birth*"
						labelClassName="text-sm block mb-2"
						className={twMerge(inputStyle, "")}
						type="date"
						value={values.dob ?? ""}
						onChange={(e) => onChange("dob", e.target.value)}
						iconRight={<CalendarIcon />}
					/>
				</div>

				<div className="md:col-span-2">
					<label className="text-sm block mb-2">User Role*</label>
					<Select value={values.role} onValueChange={(v) => onChange("role", v)}>
						<SelectTrigger className={twMerge(inputStyle, "min-h-11")}>
							<SelectValue placeholder="Select role" />
						</SelectTrigger>
						<SelectContent>
							{roleCandidates.length === 0 ? (
								<SelectItem value="admin">Admin</SelectItem>
							) : (
								roleCandidates.map((r) => (
									<SelectItem key={r.key} value={r.key}>
										{r.value}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				</div>

				<div>
					<CustomInput
						label="Salary Amount*"
						labelClassName="text-sm block mb-2"
						className={twMerge(inputStyle)}
						value={values.salary ?? ""}
						onChange={(e) => onChange("salary", e.target.value)}
					/>
				</div>
				<div>
					<CustomInput
						label="Account Number*"
						labelClassName="text-sm block mb-2"
						className={twMerge(inputStyle)}
						value={values.accountNumber ?? ""}
						onChange={(e) => onChange("accountNumber", e.target.value)}
					/>
				</div>

				<div>
					<label className="text-sm block mb-2">Account type*</label>
					<Select value={values.accountType} onValueChange={(v) => onChange("accountType", v)}>
						<SelectTrigger className={twMerge(inputStyle, "min-h-11")}>
							<SelectValue placeholder="Select account type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="savings">Savings</SelectItem>
							<SelectItem value="current">Current</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div>
					<CustomInput
						label="Bank Name*"
						labelClassName="text-sm block mb-2"
						className={twMerge(inputStyle)}
						value={values.bankName ?? ""}
						onChange={(e) => onChange("bankName", e.target.value)}
					/>
				</div>
			</div>

			<div className="mt-8 flex justify-center">
				<button type="button" className="w-3/5 mx-auto bg-primary text-white rounded-md py-3" onClick={onSubmit}>
					{submitLabel}
				</button>
			</div>
		</div>
	);
}
