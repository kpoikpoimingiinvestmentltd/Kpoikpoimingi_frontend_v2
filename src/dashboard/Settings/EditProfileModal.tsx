import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CustomInput from "@/components/base/CustomInput";
import CustomCard from "@/components/base/CustomCard";
import Avatar from "../../components/base/Avatar";
import { useGetCurrentUser } from "@/api/user";
import { useForm } from "react-hook-form";
import ActionButton from "../../components/base/ActionButton";

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

	const handleSave = handleSubmit((data) => {
		// TODO: wire to API with mutation
		console.log("Form data:", data);
		console.log("Profile image:", profileImage);
		onOpenChange(false);
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
							<ActionButton type="submit" isLoading={isLoading} className="w-full" disabled={isLoading}>
								{isLoading ? "Loading..." : "Save Changes"}
							</ActionButton>
						</div>
					</form>
				</CustomCard>
			</DialogContent>
		</Dialog>
	);
}
