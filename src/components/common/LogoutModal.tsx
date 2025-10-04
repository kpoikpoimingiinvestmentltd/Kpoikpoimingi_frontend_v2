import ConfirmModal from "@/components/common/ConfirmModal";
import { useNavigate } from "react-router";
import { _router } from "@/routes/_router";

export default function LogoutModal({
	open,
	onOpenChange,
	onConfirm,
	footerAlign = "center",
}: {
	open: boolean;
	onOpenChange: (o: boolean) => void;
	onConfirm?: () => void;
	footerAlign?: "left" | "center" | "right";
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
	};

	return (
		<ConfirmModal
			open={open}
			onOpenChange={onOpenChange}
			title={"Log out"}
			subtitle={"Are you sure you want to log out of the admin dashboard?"}
			actions={[{ label: "Log Out Now", variant: "destructive", onClick: handleConfirm }]}
			footerAlign={footerAlign}
		/>
	);
}
