import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import CustomInput from "@/components/base/CustomInput";
import { Button } from "@/components/ui/button";
import { media } from "@/resources/images";
import CustomCard from "@/components/base/CustomCard";
import Avatar from "../../components/base/Avatar";

export default function EditProfileModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
	const [name, setName] = useState("Amgbara Jake");
	const [email, setEmail] = useState("dunny@gmail.com");

	const handleSave = () => {
		// TODO: wire to API
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-center">Edit User Details</DialogTitle>
				</DialogHeader>

				<CustomCard className="border-0 p-0 bg-transparent">
					<div className="flex flex-col items-center gap-4 py-6">
						<Avatar variant="editable" src={media.images.avatar} />
						<div className="text-center text-sm text-muted-foreground">Upload Profile</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<CustomInput
								label="User Name*"
								labelClassName="block text-sm text-muted-foreground mb-2"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>

						<div>
							<CustomInput
								label="Email*"
								labelClassName="block text-sm text-muted-foreground mb-2"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
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
