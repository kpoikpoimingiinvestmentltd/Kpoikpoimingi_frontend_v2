import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { _router } from "@/routes/_router";

export default function LogoutModal({
	open,
	onOpenChange,
	onConfirm,
}: {
	open: boolean;
	onOpenChange: (o: boolean) => void;
	onConfirm?: () => void;
}) {
	const navigate = useNavigate();

	const handleConfirm = () => {
		if (onConfirm) {
			onConfirm();
		} else {
			try {
				localStorage.clear();
			} catch (e) {}
			navigate(_router.auth.login);
		}
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Log out</DialogTitle>
				</DialogHeader>
				<div className="py-4">Are you sure you want to log out of the admin dashboard?</div>
				<DialogFooter>
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button className="ml-2" onClick={handleConfirm}>
						Log out
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
