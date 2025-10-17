import { useState } from "react";
import { useForm } from "react-hook-form";
import { EyeIcon, EyeOff } from "lucide-react";
import type { ChangePasswordInput } from "@/types/user";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CustomInput from "@/components/base/CustomInput";
import CustomCard from "@/components/base/CustomCard";
import ActionButton from "../../components/base/ActionButton";
import { toast } from "sonner";
import { useChangePassword } from "@/api/user";

export default function ChangePasswordModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
	const [showOld, setShowOld] = useState(false);
	const [showNew, setShowNew] = useState(false);

	const { register, handleSubmit, reset } = useForm<ChangePasswordInput>({
		defaultValues: { currentPassword: "", newPassword: "" },
	});

	const mutation = useChangePassword(() => {
		toast.success("Password changed successfully");
		onOpenChange(false);
		reset();
	});

	const handleSave = async (vals: ChangePasswordInput) => {
		try {
			await mutation.mutateAsync({ currentPassword: vals.currentPassword, newPassword: vals.newPassword });
		} catch (e: any) {
			const status = e?.status ?? e?.data?.status;
			const serverMessage = e?.data?.message || e?.message;
			console.error("Change password error:", e);
			if (status) {
				const body = e?.data ? JSON.stringify(e.data) : serverMessage;
				toast.error(`${e?.data?.message || serverMessage || body}`);
			} else {
				toast.error(serverMessage || "Failed to change password");
			}
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-center">Change Password</DialogTitle>
				</DialogHeader>

				<CustomCard className="border-0 p-0 bg-transparent py-5">
					<div className="grid grid-cols-1 gap-4 my-5">
						<CustomInput
							label="Old Password"
							labelClassName="block text-sm text-muted-foreground mb-2"
							{...register("currentPassword")}
							type={showOld ? "text" : "password"}
							suffix={
								<button
									type="button"
									aria-label={showOld ? "Hide old password" : "Show old password"}
									onClick={() => setShowOld((s) => !s)}
									className="p-1">
									{showOld ? <EyeOff /> : <EyeIcon />}
								</button>
							}
						/>

						<CustomInput
							label="New Password"
							labelClassName="block text-sm text-muted-foreground mb-2"
							{...register("newPassword")}
							type={showNew ? "text" : "password"}
							suffix={
								<button
									type="button"
									aria-label={showNew ? "Hide new password" : "Show new password"}
									onClick={() => setShowNew((s) => !s)}
									className="p-1">
									{showNew ? <EyeOff /> : <EyeIcon />}
								</button>
							}
						/>
					</div>

					<div className="mt-10">
						<ActionButton className="w-full" onClick={handleSubmit(handleSave)} disabled={mutation.status === "pending"}>
							{mutation.status === "pending" ? "Saving..." : "Save Changes"}
						</ActionButton>
					</div>
				</CustomCard>
			</DialogContent>
		</Dialog>
	);
}
