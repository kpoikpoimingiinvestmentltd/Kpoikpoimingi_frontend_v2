import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CustomInput from "@/components/base/CustomInput";
import CustomCard from "@/components/base/CustomCard";
import Avatar from "../../components/base/Avatar";
import { useGetCurrentUser } from "@/api/user";
import { useForm } from "react-hook-form";
import ActionButton from "../../components/base/ActionButton";
import { usePresignUploadMutation } from "@/api/presign-upload.api";
import { uploadFileToPresignedUrl } from "@/utils/media-upload";
import { useUpdateUser } from "@/api/user";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface EditProfileFormData {
	fullName: string;
	email: string;
	username: string;
	phoneNumber?: string;
	branchLocation?: string;
}

export default function EditProfileModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
	const { data: user, isLoading } = useGetCurrentUser(true);
	const [profileImage, setProfileImage] = useState<File | null>(null);
	const [profilePreview, setProfilePreview] = useState<string | null>(null);
	const queryClient = useQueryClient();

	const [presignUpload] = usePresignUploadMutation();
	const updateUserMutation = useUpdateUser();

	const {
		register,
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
		},
	});

	// Prefill form with user data when available
	useEffect(() => {
		if (user) {
			reset({
				fullName: user.fullName || "",
				email: user.email || "",
				username: user.username || "",
				phoneNumber: user.phoneNumber || "",
				branchLocation: user.branchLocation || "",
			});
			// Set preview image if available
			if (user.media) {
				setProfilePreview(user.media);
			}
		}
	}, [user, reset]);

	const handleSave = handleSubmit(async (data) => {
		try {
			let mediaKey: string | undefined;

			if (profileImage) {
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

			// Update user profile
			const updatePayload = {
				...data,
				...(mediaKey && { media: mediaKey }),
			};

			await updateUserMutation.mutateAsync({
				id: user!.id,
				payload: updatePayload,
			});

			// Invalidate current user query to refetch updated data
			queryClient.invalidateQueries({ queryKey: ["currentUser", user!.id] });

			toast.success("Profile updated successfully!");
			onOpenChange(false);
			setProfileImage(null);
			setProfilePreview(null);
		} catch (error: unknown) {
			const errorMsg = (error as Record<string, unknown>)?.message ?? "Unknown error";
			toast.error(`Failed to update profile: ${errorMsg}`);
		}
	});

	const handleAvatarChange = (file: File | null, preview?: string) => {
		setProfileImage(file);
		if (preview) {
			setProfilePreview(preview);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-center">Edit User Details</DialogTitle>
				</DialogHeader>

				<CustomCard className="border-0 p-0 bg-transparent">
					<form onSubmit={handleSave}>
						<div className="flex flex-col items-center gap-4 py-6">
							<Avatar variant="editable" src={profilePreview || user?.media || null} onChange={handleAvatarChange} />
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<CustomInput
									label="Full Name*"
									labelClassName="block text-sm text-muted-foreground mb-2"
									{...register("fullName", {
										required: "Full name is required",
										minLength: {
											value: 2,
											message: "Full name must be at least 2 characters",
										},
									})}
									error={errors.fullName?.message}
								/>
							</div>

							<div>
								<CustomInput
									label="Username*"
									labelClassName="block text-sm text-muted-foreground mb-2"
									{...register("username", {
										required: "Username is required",
									})}
									error={errors.username?.message}
								/>
							</div>

							<div>
								<CustomInput
									label="Email*"
									labelClassName="block text-sm text-muted-foreground mb-2"
									type="email"
									{...register("email", {
										required: "Email is required",
										pattern: {
											value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
											message: "Invalid email format",
										},
									})}
									error={errors.email?.message}
								/>
							</div>

							<div>
								<CustomInput
									label="Phone Number"
									labelClassName="block text-sm text-muted-foreground mb-2"
									{...register("phoneNumber")}
									error={errors.phoneNumber?.message}
								/>
							</div>

							<div className="sm:col-span-2">
								<CustomInput
									label="Branch Location"
									labelClassName="block text-sm text-muted-foreground mb-2"
									{...register("branchLocation")}
									error={errors.branchLocation?.message}
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
