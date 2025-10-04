import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import CustomInput from "@/components/base/CustomInput";
import { Button } from "@/components/ui/button";
import CustomCard from "@/components/base/CustomCard";

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

				<CustomCard className="border-0 p-0 bg-transparent">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<CustomInput
								label="Old Password"
								labelClassName="block text-sm text-muted-foreground mb-2"
								type="password"
								value={oldPassword}
								onChange={(e) => setOldPassword(e.target.value)}
							/>
						</div>
						<div>
							<CustomInput
								label="New Password"
								labelClassName="block text-sm text-muted-foreground mb-2"
								type="password"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
							/>
						</div>
					</div>

					<div className="mt-6">
						<Button className="w-full" onClick={handleSave}>
							Save Changes
						</Button>
					</div>
				</CustomCard>

				<DialogFooter>
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
