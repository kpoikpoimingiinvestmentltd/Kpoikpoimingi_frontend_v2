import CustomInput from "../../components/base/CustomInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetReferenceData } from "@/api/reference";
import { twMerge } from "tailwind-merge";
import * as React from "react";
import { inputStyle } from "../../components/common/commonStyles";
import { media } from "../../resources/images";
import Avatar from "../../components/base/Avatar";
import { usePresignUploadMutation } from "@/api/presign-upload.api";
import { uploadFileToPresignedUrl } from "@/utils/media-upload";
import { toast } from "sonner";
import { CalendarIcon, EmailIcon, PhoneIcon } from "../../assets/icons";
import { Spinner } from "@/components/ui/spinner";

type FormShape = {
	fullName?: string;
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
	onAvatarUploaded,
	isLoading = false,
}: {
	values: FormShape;
	onChange?: (k: keyof FormShape, v: any) => void;
	onSubmit?: () => void;
	submitLabel?: string;
	onAvatarUploaded?: (key: string) => void;
	isLoading?: boolean;
}) {
	const { data: refData } = useGetReferenceData(true, false);
	const [presignUpload] = usePresignUploadMutation();

	const roleCandidates: { key: string; value: string }[] = React.useMemo(() => {
		if (!refData) return [];

		const prefer = ["roles", "user_roles", "userRoles", "role", "roles_list"];
		for (const k of prefer) {
			const arr = (refData as any)[k];
			if (Array.isArray(arr) && arr.length) {
				return arr.map((it: any) => {
					const value = it.role;
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
						const value = it.role;
						const key = String(it.id ?? value ?? "");
						return { key, value: String(value) };
					});
				}
			}
		}

		return [];
	}, [refData]);

	const bankCandidates: { key: string; value: string }[] = React.useMemo(() => {
		if (!refData) return [];
		const prefer = ["bankNames", "banks", "bank_list", "banks_list"];
		for (const k of prefer) {
			const arr = (refData as any)[k];
			if (Array.isArray(arr) && arr.length) {
				return arr.map((it: any) => {
					const value = String(it.name ?? it.bank ?? it.value ?? it.key ?? "");
					const key = String(it.id ?? value ?? "");
					return { key, value };
				});
			}
		}
		// fallback: scan entries for a likely banks list
		for (const [k, v] of Object.entries(refData)) {
			if (Array.isArray(v) && v.length) {
				const sample = v[0] as any;
				if (String(sample.name ?? sample.bank ?? "").length > 0 && k.toLowerCase().includes("bank")) {
					return (v as any[]).map((it: any) => ({
						key: String(it.id ?? it.name ?? it.bank ?? ""),
						value: String(it.name ?? it.bank ?? it.value ?? ""),
					}));
				}
			}
		}
		return [];
	}, [refData]);

	const accountCandidates: { key: string; value: string }[] = React.useMemo(() => {
		if (!refData) return [];
		const prefer = ["accountTypes", "account_types", "account_type", "accountType"];
		for (const k of prefer) {
			const arr = (refData as any)[k];
			if (Array.isArray(arr) && arr.length) {
				return arr.map((it: any) => {
					const value = String(it.type ?? it.name ?? it.accountType ?? it.value ?? it.key ?? "");
					const key = String(it.id ?? value ?? "");
					return { key, value };
				});
			}
		}

		for (const [, v] of Object.entries(refData)) {
			if (Array.isArray(v) && v.length) {
				const sample = v[0] as any;
				if (
					String(sample.type ?? sample.name ?? "")
						.toLowerCase()
						.includes("account")
				) {
					return (v as any[]).map((it: any) => ({
						key: String(it.id ?? it.name ?? it.type ?? ""),
						value: String(it.name ?? it.type ?? it.value ?? ""),
					}));
				}
			}
		}

		return [];
	}, [refData]);

	const stateCandidates: { key: string; value: string }[] = React.useMemo(() => {
		if (!refData) return [];
		const prefer = ["stateOfOrigins", "state_of_origins", "states", "state_list", "stateOfOrigin"];
		for (const k of prefer) {
			const arr = (refData as any)[k];
			if (Array.isArray(arr) && arr.length) {
				return arr.map((it: any) => {
					const value = String(it.state ?? it.name ?? it.value ?? "");
					const key = String(it.id ?? value ?? "");
					return { key, value };
				});
			}
		}
		// fallback: scan entries for state-like lists
		for (const [k, v] of Object.entries(refData)) {
			if (Array.isArray(v) && v.length) {
				const sample = v[0] as any;
				const t = String(sample.state ?? sample.name ?? "").toLowerCase();
				if (t.length > 0 && (t.includes("state") || k.toLowerCase().includes("state"))) {
					return (v as any[]).map((it: any) => ({
						key: String(it.id ?? it.state ?? it.name ?? ""),
						value: String(it.state ?? it.name ?? it.value ?? ""),
					}));
				}
			}
		}
		return [];
	}, [refData]);

	async function handleAvatarFile(file: File | null, preview?: string) {
		onChange("avatar" as any, preview ?? null);
		if (!file) return;

		try {
			// Step 1: Get presigned URL (adapted from purchase-policy.tsx uploadFile)
			const presignResult = await presignUpload({
				filename: file.name,
				contentType: file.type,
				relatedTable: "user",
			}).unwrap();

			const uploadUrl = (presignResult as any)?.url;
			if (!uploadUrl) {
				throw new Error("Presign upload did not return an uploadUrl");
			}

			// Step 2: Upload file to presigned URL
			const uploadResult = await uploadFileToPresignedUrl(uploadUrl, file);
			if (!uploadResult.success) {
				throw new Error(uploadResult.error ?? "Upload failed");
			}

			// Step 3: Get the key and store it in form state (for payload inclusion, like mediaKeys in purchase-policy.tsx)
			const mediaKey = (presignResult as any)?.key ?? (presignResult as any)?.data?.key;
			if (mediaKey) {
				onChange("avatar", mediaKey); // Store key in values.avatar for submission
				// Optionally fetch view URL for preview
				try {
					const resp = await fetch(`/api/media/get-url-by-key?key=${encodeURIComponent(mediaKey)}`);
					if (resp.ok) {
						const json = await resp.json().catch(() => ({}));
						const viewUrl = (json as any)?.url ?? (json as any)?.uploadUrl;
						if (viewUrl) onChange("avatar" as any, viewUrl); // Update preview
					}
				} catch (err) {
					console.error("Failed to fetch view URL", err);
				}
				// Notify parent if needed
				if (typeof onAvatarUploaded === "function") onAvatarUploaded(mediaKey);
			}
		} catch (err: any) {
			console.error("Avatar upload failed", err);
			let message = "Unknown error";
			if (err instanceof Error) message = err.message;
			else if (typeof err === "string") message = err;
			else if (err && typeof (err as any).message === "string") message = (err as any).message;
			else message = String(err);
			toast.error(`Avatar upload failed: ${message}`);
		}
	}

	return (
		<div className="max-w-4xl mx-auto">
			<div className="flex flex-col items-center mb-6">
				<Avatar
					src={values.avatar ?? media.images.avatar}
					alt="profile"
					size={128}
					variant="editable"
					onChange={(file, preview) => {
						// preview immediate; then attempt presign+upload in background
						handleAvatarFile(file ?? null, preview);
					}}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<CustomInput
						label="Full Name*"
						labelClassName="text-sm block mb-2"
						className={twMerge(inputStyle)}
						value={values.fullName ?? ""}
						onChange={(e) => onChange("fullName" as any, e.target.value)}
					/>
				</div>

				<div>
					<CustomInput
						label="Username*"
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
							{stateCandidates.length === 0 ? (
								<SelectItem value="none">Select</SelectItem>
							) : (
								// use id (s.key) as the Select value so parent receives the id string
								stateCandidates.map((s) => (
									<SelectItem key={s.key} value={s.key}>
										{s.value}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				</div>
				<div className="">
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

				<div>
					<label className="text-sm block mb-2">User Role*</label>
					<Select value={values.role} onValueChange={(v) => onChange("role", v)}>
						<SelectTrigger className={twMerge(inputStyle, "min-h-11")}>
							<SelectValue placeholder="Select role" />
						</SelectTrigger>
						<SelectContent>
							{roleCandidates.length === 0 ? (
								<SelectItem value="1">Admin</SelectItem>
							) : (
								roleCandidates.map((r) => (
									// use id (r.key) as the Select value so callers receive the numeric id as a string
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
							{accountCandidates.length === 0 ? (
								<>
									<SelectItem value="savings">Savings</SelectItem>
									<SelectItem value="current">Current</SelectItem>
								</>
							) : (
								accountCandidates.map((a) => (
									<SelectItem key={a.key} value={a.key}>
										{a.value}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				</div>
				<div>
					<label className="text-sm block mb-2">Bank Name*</label>
					<Select value={values.bankName} onValueChange={(v) => onChange("bankName", v)}>
						<SelectTrigger className={twMerge(inputStyle, "min-h-11")}>
							<SelectValue placeholder="Select bank" />
						</SelectTrigger>
						<SelectContent>
							{bankCandidates.length === 0 ? (
								<SelectItem value="none">Select</SelectItem>
							) : (
								bankCandidates.map((b) => (
									<SelectItem key={b.key} value={b.key}>
										{b.value}
									</SelectItem>
								))
							)}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="mt-8 flex justify-center">
				<button
					type="button"
					className="w-full md:w-3/5 mx-auto bg-primary text-white rounded-md py-3 flex items-center justify-center gap-2 disabled:opacity-60"
					onClick={onSubmit}
					disabled={isLoading}>
					{isLoading ? (
						<>
							<Spinner className="size-4" />
							<span>Processing...</span>
						</>
					) : (
						submitLabel
					)}
				</button>
			</div>
		</div>
	);
}
