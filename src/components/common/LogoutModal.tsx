import React from "react";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useNavigate } from "react-router";
import { _router } from "@/routes/_router";
import { useDispatch } from "react-redux";
import { clearAuth } from "@/store/authSlice";
import { saveAuthToStorage } from "@/services/authPersistence";
import { apiRequest } from "@/services/apiClient";
import { API_ROUTES } from "@/api/routes";
import { toast } from "sonner";

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
	const dispatch = useDispatch();
	const [loading, setLoading] = React.useState(false);

	const handleConfirm = async () => {
		if (onConfirm) {
			onConfirm();
			return;
		}

		setLoading(true);
		try {
			const res = await apiRequest(API_ROUTES.auth.logout, { method: "POST" });
			const msg = (res && (res as any).message) || "Logged out";
			toast.success(msg);
			try {
				saveAuthToStorage(null);
			} catch (e) {}

			dispatch(clearAuth());
			navigate(_router.auth.login);
			onOpenChange(false);
		} catch (e) {
			toast.error((e as any)?.message ?? "Logout failed (session preserved)");
		} finally {
			setLoading(false);
		}
	};

	return (
		<ConfirmModal
			open={open}
			onOpenChange={onOpenChange}
			title={"Log out"}
			subtitle={"Are you sure you want to log out of the admin dashboard?"}
			actions={[{ label: loading ? "Logging out..." : "Log Out Now", variant: "destructive", onClick: handleConfirm, closeOnClick: false, loading }]}
			footerAlign={footerAlign}
		/>
	);
}
