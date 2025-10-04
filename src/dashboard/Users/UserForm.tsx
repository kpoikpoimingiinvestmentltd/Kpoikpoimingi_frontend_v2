import CustomInput from "../../components/base/CustomInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { twMerge } from "tailwind-merge";
import { inputStyle } from "../../components/common/commonStyles";
import { IconWrapper, UploadCloudIcon } from "../../assets/icons";
import Image from "../../components/base/Image";
import { media } from "../../resources/images";

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
	return (
		<div className="max-w-4xl mx-auto">
			<div className="flex flex-col items-center mb-6">
				<div className="w-32 h-32 bg-card rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden">
					<Image src={media.images.avatar} alt="avatar" />
					<button type="button" className={"flex items-center text-center flex-col gap-y-2 absolute justify-center inset-0 bg-black/50 text-white"}>
						<IconWrapper className="text-lg">
							<UploadCloudIcon />
						</IconWrapper>
						<div className="text-sm">Upload Profile</div>
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="text-sm block mb-2">User Name*</label>
					<CustomInput className={twMerge(inputStyle)} value={values.username ?? ""} onChange={(e) => onChange("username", e.target.value)} />
				</div>
				<div>
					<label className="text-sm block mb-2">Email*</label>
					<CustomInput className={twMerge(inputStyle)} value={values.email ?? ""} onChange={(e) => onChange("email", e.target.value)} />
				</div>

				<div>
					<label className="text-sm block mb-2">Phone Number*</label>
					<CustomInput className={twMerge(inputStyle)} value={values.phone ?? ""} onChange={(e) => onChange("phone", e.target.value)} />
				</div>
				<div>
					<label className="text-sm block mb-2">House Address*</label>
					<CustomInput className={twMerge(inputStyle)} value={values.houseAddress ?? ""} onChange={(e) => onChange("houseAddress", e.target.value)} />
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
					<label className="text-sm block mb-2">Date Of Birth*</label>
					<CustomInput className={twMerge(inputStyle, "")} type="date" value={values.dob ?? ""} onChange={(e) => onChange("dob", e.target.value)} />
				</div>

				<div className="md:col-span-2">
					<label className="text-sm block mb-2">User Role*</label>
					<Select value={values.role} onValueChange={(v) => onChange("role", v)}>
						<SelectTrigger className={twMerge(inputStyle, "min-h-11")}>
							<SelectValue placeholder="Select role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="admin">Admin</SelectItem>
							<SelectItem value="sales">Sales Person</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<label className="text-sm block mb-2">Salary Amount*</label>
					<CustomInput className={twMerge(inputStyle)} value={values.salary ?? ""} onChange={(e) => onChange("salary", e.target.value)} />
				</div>
				<div>
					<label className="text-sm block mb-2">Account Number*</label>
					<CustomInput
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
					<label className="text-sm block mb-2">Bank Name*</label>
					<CustomInput className={twMerge(inputStyle)} value={values.bankName ?? ""} onChange={(e) => onChange("bankName", e.target.value)} />
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
