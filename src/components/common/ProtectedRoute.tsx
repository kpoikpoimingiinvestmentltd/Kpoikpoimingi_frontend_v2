import { Navigate } from "react-router";
import { _router } from "@/routes/_router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import type { ReactNode } from "react";
import type { User } from "@/types/user";

interface ProtectedRouteProps {
	allowedRoles: string[];
	children: ReactNode;
	fallbackRoute?: string;
}

export default function ProtectedRoute({ allowedRoles, children, fallbackRoute = _router.dashboard.index }: ProtectedRouteProps) {
	const { data: user, isLoading } = useCurrentUser() as {
		data?: User;
		isLoading: boolean;
	};

	if (isLoading) {
		// Return null or a skeleton loader - the layout will handle this
		return null;
	}

	if (!user || !user.role || !allowedRoles.includes(user.role.role)) {
		return <Navigate to={fallbackRoute} replace />;
	}

	return <>{children}</>;
}
