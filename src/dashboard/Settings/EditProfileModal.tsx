import { useEffect, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CustomInput from "@/components/base/CustomInput";
import CustomCard from "@/components/base/CustomCard";
import Avatar from "../../components/base/Avatar";
import { useGetCurrentUser } from "@/api/user";
import { useForm, Controller } from "react-hook-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetReferenceData } from "@/api/reference";
import { extractAccountTypeOptions, extractBankOptions, extractStateOptions } from "@/lib/referenceDataHelpers";
import { inputStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import ActionButton from "../../components/base/ActionButton";
import { usePresignUploadMutation } from "@/api/presign-upload.api";
import { uploadFileToPresignedUrl } from "@/utils/media-upload";
import { useUpdateUser, useUploadUserProfile } from "@/api/user";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { modalContentStyle } from "../../components/common/commonStyles";

interface EditProfileFormData {
	fullName: string;
	email: string;
	username: string;
	phoneNumber?: string;
	branchLocation?: string;
	accountNumber?: string;
	salaryAmount?: string;
	accountTypeId?: string;
	bankNameId?: string;
	stateOfOriginId?: string;
	dateOfBirth?: string;
	houseAddress?: string;
}

export default function EditProfileModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
	const { data: user, isLoading } = useGetCurrentUser(true);
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [profilePreview, setProfilePreview] = useState<string | null>(null);
	const [uploadedMediaKey, setUploadedMediaKey] = useState<string | null>(null);
	const [hasInitialized, setHasInitialized] = useState(false);
	const queryClient = useQueryClient();

	const [presignUpload] = usePresignUploadMutation();
	const updateUserMutation = useUpdateUser();
	const uploadUserProfileMutation = useUploadUserProfile();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<EditProfileFormData>({
		defaultValues: {
			fullName: "",
			email: "",
			username: "",
			phoneNumber: "",
			branchLocation: "",
			accountNumber: "",
			salaryAmount: "",
			accountTypeId: "",
			bankNameId: "",
			stateOfOriginId: "",
			dateOfBirth: "",
			houseAddress: "",
		},
	});

	// Reference data for selects
	const { data: refData } = useGetReferenceData(true, false);
	const accountCandidates = useMemo(() => extractAccountTypeOptions(refData), [refData]);
	const bankCandidates = useMemo(() => extractBankOptions(refData), [refData]);
	const stateCandidates = useMemo(() => extractStateOptions(refData), [refData]);

	// Reset state when modal closes
	useEffect(() => {
		if (!open) {
			setProfileImage(null);
			setProfilePreview(null);
			setUploadedMediaKey(null);
			setHasInitialized(false);
		}
	}, [open]);

	// Set initial form values only once when user loads
	useEffect(() => {
		if (!user || hasInitialized) return;

		let phonePrefill = ((user as Record<string, unknown>).phoneNumber as string) || "";
		if (phonePrefill.startsWith("+234")) {
			phonePrefill = "0" + phonePrefill.slice(4);
		} else if (phonePrefill.startsWith("234")) {
			phonePrefill = "0" + phonePrefill.slice(3);
		}

		reset(
			{
				fullName: ((user as Record<string, unknown>).fullName as string) || "",
				email: ((user as Record<string, unknown>).email as string) || "",
				username: ((user as Record<string, unknown>).username as string) || "",
				phoneNumber: phonePrefill,
				branchLocation: ((user as Record<string, unknown>).branchLocation as string) || "",
				accountNumber: ((user as Record<string, unknown>).accountNumber as string) || "",
				salaryAmount: ((user as Record<string, unknown>).salaryAmount as string) || "",
				accountTypeId: String(((user as Record<string, unknown>).accountType as Record<string, unknown>)?.id ?? "") || "",
				bankNameId: String(((user as Record<string, unknown>).bankName as Record<string, unknown>)?.id ?? "") || "",
				stateOfOriginId: String(((user as Record<string, unknown>).stateOfOrigin as Record<string, unknown>)?.id ?? "") || "",
				dateOfBirth: ((user as Record<string, unknown>).dateOfBirth as string)?.slice(0, 10) || "",
				houseAddress: ((user as Record<string, unknown>).houseAddress as string) || "",
			},
			{ keepValues: false },
		);

		// Set preview image if available
		const media = (user as Record<string, unknown>).media;
		if (media) {
			if (Array.isArray(media) && media.length > 0) {
				setProfilePreview(((media[0] as Record<string, unknown>)?.fileUrl as string) || null);
			} else if (typeof media === "string") {
				setProfilePreview(media as string);
			} else if ((media as Record<string, unknown>)?.fileUrl) {
				setProfilePreview(((media as Record<string, unknown>)?.fileUrl as string) || null);
			}
		}
		setHasInitialized(true);
	}, [open]); // Only depend on open, not user

	const handleSave = handleSubmit(async (data) => {
		try {
			let mediaKey: string | undefined;

			if (uploadedMediaKey) {
				mediaKey = uploadedMediaKey;
			} else if (profileImage) {
				// Upload the profile image
				const presignResult = await presignUpload({
					filename: profileImage.name,
					contentType: profileImage.type,
					relatedTable: "user",
				}).unwrap();

				// Extract uploadUrl from presignResult
				const uploadUrl = presignResult.uploadUrl ?? presignResult.url;
				if (!uploadUrl) {
					console.error("Presign response missing uploadUrl", presignResult);
					throw new Error("Presign upload did not return an uploadUrl");
				}

				const uploadResult = await uploadFileToPresignedUrl(String(uploadUrl), profileImage);
				if (!uploadResult.success) {
					throw new Error(uploadResult.error || "Upload failed");
				}
				mediaKey = presignResult.key;
			}

			// Normalize phone for payload: convert local 0-prefixed to +234 international
			const payloadPhone = (data.phoneNumber as string | undefined) || undefined;
			let normalizedPhone: string | undefined = undefined;
			if (payloadPhone) {
				const p = payloadPhone.trim();
				if (p.startsWith("0")) {
					normalizedPhone = "+234" + p.slice(1);
				} else if (p.startsWith("+")) {
					normalizedPhone = p;
				} else if (/^234\d+/.test(p)) {
					normalizedPhone = "+" + p;
				} else {
					normalizedPhone = "+234" + p;
				}
			}

			// Convert fields to expected types before update
			const parseIntegerField = (v?: string | number) => {
				if (v === undefined || v === null || v === "") return undefined;
				const normalized = String(v).replace(/,/g, "").trim();
				const n = Number(normalized);
				if (!Number.isFinite(n)) return undefined;
				// Ensure integer
				return Math.trunc(n);
			};
			const parseFloatField = (v?: string | number) => {
				if (v === undefined || v === null || v === "") return undefined;
				const normalized = String(v)
					.replace(/,/g, "")
					.replace(/[^0-9.\-]/g, "")
					.trim();
				const n = Number(normalized);
				if (!Number.isFinite(n)) return undefined;
				return n;
			};

			const accountTypeIdNum = parseIntegerField(data.accountTypeId);
			const bankNameIdNum = parseIntegerField(data.bankNameId);
			const stateOfOriginIdNum = parseIntegerField(data.stateOfOriginId);
			const salaryAmountNum = parseFloatField(data.salaryAmount);

			// Client-side validation to avoid server 400s
			if (data.accountTypeId && typeof accountTypeIdNum === "undefined") {
				toast.error("Account type must be a valid integer");
				return;
			}
			if (data.bankNameId && typeof bankNameIdNum === "undefined") {
				toast.error("Bank name must be a valid integer");
				return;
			}
			if (data.stateOfOriginId && typeof stateOfOriginIdNum === "undefined") {
				toast.error("State of origin must be a valid integer");
				return;
			}
			if (data.salaryAmount && typeof salaryAmountNum === "undefined") {
				toast.error("Salary amount must be a valid number");
				return;
			}

			// Update user profile
			const updatePayload = {
				...data,
				...(mediaKey && { media: mediaKey }),
				...(normalizedPhone && { phoneNumber: normalizedPhone }),
				...(typeof accountTypeIdNum !== "undefined" && { accountTypeId: accountTypeIdNum }),
				...(typeof bankNameIdNum !== "undefined" && { bankNameId: bankNameIdNum }),
				...(typeof stateOfOriginIdNum !== "undefined" && { stateOfOriginId: stateOfOriginIdNum }),
				...(typeof salaryAmountNum !== "undefined" && { salaryAmount: salaryAmountNum }),
			};

			if (mediaKey) {
				try {
					const userId = (user as Record<string, unknown>)?.id as string | undefined;
					if (userId) {
						const uploadRes = await uploadUserProfileMutation.mutateAsync({ userId, key: mediaKey });
						try {
							if (uploadRes && typeof uploadRes === "object") {
								queryClient.setQueryData(["currentUser", userId], uploadRes);
							}
						} catch {}
					}
				} catch (e) {
					console.warn("Uploading media key to user endpoint failed; will still continue with user update", e);
				}
			}

			await updateUserMutation.mutateAsync({
				id: (user as Record<string, unknown>).id as string,
				payload: updatePayload,
			});

			// Invalidate current user query to refetch updated data
			queryClient.invalidateQueries({ queryKey: ["currentUser", (user as Record<string, unknown>).id as string] });

			toast.success("Profile updated successfully!");
			onOpenChange(false);
			setProfileImage(null);
			setProfilePreview(null);
		} catch (error: unknown) {
			console.error("Profile update failed:", error);
			const err = error as {
				status?: number;
				response?: { status?: number; data?: { message?: string } };
				data?: { message?: string };
				message?: string;
			};
			const status = err?.status ?? err?.response?.status;
			const serverMessage = err?.data?.message ?? err?.message ?? err?.response?.data?.message;
			if (status) {
				toast.error(`Failed to update profile (status ${status}): ${serverMessage ?? "See console"}`);
			} else {
				toast.error(`Failed to update profile: ${serverMessage ?? "Unknown error"}`);
			}
		}
	});

	const handleAvatarChange = async (file: File | null, preview?: string) => {
		setProfileImage(file);
		if (preview) setProfilePreview(preview);

		if (!file) {
			setUploadedMediaKey(null);
			return;
		}

		try {
			const presignResult = await presignUpload({
				filename: file.name,
				contentType: file.type,
				relatedTable: "user",
			}).unwrap();

			const uploadUrl = presignResult.uploadUrl ?? presignResult.url;
			if (!uploadUrl) throw new Error("Presign upload did not return an uploadUrl");

			const uploadResult = await uploadFileToPresignedUrl(String(uploadUrl), file);
			if (!uploadResult.success) throw new Error(uploadResult.error || "Upload failed");

			if (presignResult.key) {
				setUploadedMediaKey(presignResult.key as string);
			}
		} catch (err) {
			console.error("Avatar immediate upload failed", err);
			toast.error("Failed to upload avatar. Try again or save to retry.");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle("md:max-w-xl")}>
				<DialogHeader>
					<DialogTitle className="text-center">Edit User Details</DialogTitle>
				</DialogHeader>

				<CustomCard className="border-0 p-0 dark:bg-transparent bg-transparent">
					<form onSubmit={handleSave}>
						<div className="flex flex-col items-center gap-4 py-6">
							<Avatar
								variant="editable"
								src={profilePreview || ((user as Record<string, unknown>)?.media as string) || null}
								onChange={handleAvatarChange}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<Controller
									control={control}
									name="fullName"
									rules={{
										required: "Full name is required",
										minLength: { value: 2, message: "Full name must be at least 2 characters" },
									}}
									render={({ field }) => (
										<CustomInput
											label="Full Name*"
											labelClassName="block text-sm text-muted-foreground mb-2"
											value={field.value ?? ""}
											onChange={(e) => field.onChange(e)}
											error={errors.fullName?.message}
										/>
									)}
								/>
							</div>

							<div>
								<Controller
									control={control}
									name="username"
									rules={{ required: "Username is required" }}
									render={({ field }) => (
										<CustomInput
											label="Username*"
											labelClassName="block text-sm text-muted-foreground mb-2"
											value={field.value ?? ""}
											onChange={(e) => field.onChange(e)}
											error={errors.username?.message}
										/>
									)}
								/>
							</div>

							<div>
								<Controller
									control={control}
									name="email"
									rules={{
										required: "Email is required",
										pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
									}}
									render={({ field }) => (
										<CustomInput
											label="Email*"
											labelClassName="block text-sm text-muted-foreground mb-2"
											type="email"
											value={field.value ?? ""}
											onChange={(e) => field.onChange(e)}
											error={errors.email?.message}
										/>
									)}
								/>
							</div>

							<div>
								<Controller
									control={control}
									name="phoneNumber"
									render={({ field }) => (
										<CustomInput
											label="Phone Number"
											labelClassName="block text-sm text-muted-foreground mb-2"
											value={field.value ?? ""}
											onChange={(e) => field.onChange(e)}
											error={errors.phoneNumber?.message}
										/>
									)}
								/>
							</div>

							<div>
								<Controller
									control={control}
									name="branchLocation"
									render={({ field }) => (
										<CustomInput
											label="Branch Location"
											labelClassName="block text-sm text-muted-foreground mb-2"
											value={field.value ?? ""}
											onChange={(e) => field.onChange(e)}
											error={errors.branchLocation?.message}
										/>
									)}
								/>
							</div>

							<div>
								<Controller
									control={control}
									name="accountNumber"
									render={({ field }) => (
										<CustomInput
											label="Account Number"
											labelClassName="block text-sm text-muted-foreground mb-2"
											value={field.value ?? ""}
											onChange={(e) => field.onChange(e)}
											error={errors.accountNumber?.message}
										/>
									)}
								/>
							</div>

							{/* Hidden Fields: Salary Amount, Account Type, Bank Name */}
							<div className="hidden">
								<Controller
									control={control}
									name="dateOfBirth"
									render={({ field }) => (
										<CustomInput
											label="Date of Birth"
											type="date"
											labelClassName="block text-sm text-muted-foreground mb-2"
											value={field.value ?? ""}
											onChange={(e) => field.onChange(e)}
											error={errors.dateOfBirth?.message}
										/>
									)}
								/>
							</div>

							<div>
								<Controller
									control={control}
									name="houseAddress"
									render={({ field }) => (
										<CustomInput
											label="House Address"
											labelClassName="block text-sm text-muted-foreground mb-2"
											value={field.value ?? ""}
											onChange={(e) => field.onChange(e)}
											error={errors.houseAddress?.message}
										/>
									)}
								/>
							</div>

							<div className="hidden">
								<label className="text-sm block mb-2">Salary Amount</label>
								<Controller
									control={control}
									name="salaryAmount"
									render={({ field }) => (
										<CustomInput
											label="Salary Amount"
											labelClassName="block text-sm text-muted-foreground mb-2"
											type="number"
											value={field.value ?? ""}
											onChange={(e) => field.onChange(e.target.value)}
											error={errors.salaryAmount?.message}
										/>
									)}
								/>
							</div>

							<div className="hidden">
								<label className="text-sm block mb-2">Account Type</label>
								<Controller
									control={control}
									name="accountTypeId"
									render={({ field }) => (
										<Select value={field.value ?? "none"} onValueChange={(v) => field.onChange(v === "none" ? "" : v)}>
											<SelectTrigger className={twMerge(inputStyle, "min-h-11")}>
												<SelectValue placeholder="Select account type" />
											</SelectTrigger>
											<SelectContent>
												{accountCandidates.length === 0 ? (
													<SelectItem value="none">Select</SelectItem>
												) : (
													accountCandidates.map((a) => (
														<SelectItem key={a.key} value={a.key} className="text-sm capitalize">
															{a.value}
														</SelectItem>
													))
												)}
											</SelectContent>
										</Select>
									)}
								/>
							</div>

							<div className="hidden">
								<label className="text-sm block mb-2">Bank Name</label>
								<Controller
									control={control}
									name="bankNameId"
									render={({ field }) => (
										<Select value={field.value ?? "none"} onValueChange={(v) => field.onChange(v === "none" ? "" : v)}>
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
									)}
								/>
							</div>

							<div>
								<label className="text-sm block mb-2">State of Origin</label>
								<Controller
									control={control}
									name="stateOfOriginId"
									render={({ field }) => (
										<Select value={field.value ?? "none"} onValueChange={(v) => field.onChange(v === "none" ? "" : v)}>
											<SelectTrigger className={twMerge(inputStyle, "min-h-11")}>
												<SelectValue placeholder="Select state" />
											</SelectTrigger>
											<SelectContent>
												{stateCandidates.length === 0 ? (
													<SelectItem value="none">Select</SelectItem>
												) : (
													stateCandidates.map((s) => (
														<SelectItem key={s.key} value={s.key}>
															{s.value}
														</SelectItem>
													))
												)}
											</SelectContent>
										</Select>
									)}
								/>
							</div>
						</div>

						<div className="mt-6">
							<ActionButton
								type="submit"
								isLoading={isLoading || updateUserMutation.isPending}
								className="w-full"
								disabled={isLoading || updateUserMutation.isPending}>
								{isLoading || updateUserMutation.isPending ? "Saving..." : "Save Changes"}
							</ActionButton>
						</div>
					</form>
				</CustomCard>
			</DialogContent>
		</Dialog>
	);
}
