import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomCard from "@/components/base/CustomCard";
import Image from "../../../components/base/Image";
import { media } from "../../../resources/images";

export default function LogoutModal({
	open,
	onOpenChange,
	onConfirm,
}: {
	open: boolean;
	onOpenChange: (o: boolean) => void;
	onConfirm?: () => void;
}) {
	// const handleConfirm = () => {
	// 	if (onConfirm) onConfirm();
	// 	onOpenChange(false);
	// };

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader />

				<CustomCard className="border-0 p-6 flex flex-col items-center gap-6">
					<Image className="w-16 h-16 rounded-full bg-[#FFECEF] flex items-center justify-center" src={media.images.alertImage} alt="Log out Image" />
					<DialogTitle className="text-lg">Log Out</DialogTitle>

					<p className="text-sm text-muted-foreground text-center">Are you sure you want to log out?</p>

					<Button className="bg-red-600 border-0 px-6 py-2.5">Log Out Now</Button>
				</CustomCard>
			</DialogContent>
		</Dialog>
	);
}
