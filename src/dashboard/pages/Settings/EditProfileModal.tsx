import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import CustomCard from "@/components/base/CustomCard";

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
						<div className="w-24 h-24 rounded-full overflow-hidden">
							<Image src={media.images.avatar} alt="avatar" className="w-full h-full object-cover" />
						</div>
						<div className="text-center text-sm text-muted-foreground">Upload Profile</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm text-muted-foreground mb-2">User Name*</label>
							<Input value={name} onChange={(e) => setName(e.target.value)} />
						</div>

						<div>
							<label className="block text-sm text-muted-foreground mb-2">Email*</label>
							<Input value={email} onChange={(e) => setEmail(e.target.value)} />
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
