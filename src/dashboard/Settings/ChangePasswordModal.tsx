import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CustomInput from "@/components/base/CustomInput";
import CustomCard from "@/components/base/CustomCard";
import ActionButton from "../../components/base/ActionButton";

export default function ChangePasswordModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	const handleSave = () => {
		// TODO: wire to change password API
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-center">Change Password</DialogTitle>
				</DialogHeader>

				<CustomCard className="border-0 p-0 bg-transparent py-5">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5">
						<CustomInput
							label="Old Password"
							labelClassName="block text-sm text-muted-foreground mb-2"
							type="password"
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
						/>
						<CustomInput
							label="New Password"
							labelClassName="block text-sm text-muted-foreground mb-2"
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
						/>
					</div>

					<div className="mt-10">
						<ActionButton className="w-full" onClick={handleSave}>
							Save Changes
						</ActionButton>
					</div>
				</CustomCard>
			</DialogContent>
		</Dialog>
	);
}
