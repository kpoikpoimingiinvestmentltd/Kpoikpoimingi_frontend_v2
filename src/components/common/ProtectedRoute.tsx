import { Navigate } from "react-router";
import { _router } from "@/routes/_router";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { loadAuthFromStorage, isTokenExpired } from "@/services/authPersistence";
import type { ReactNode } from "react";
import type { User } from "@/types/user";

interface ProtectedRouteProps {
	allowedRoles: string[];
	children: ReactNode;
	fallbackRoute?: string;
}

export default function ProtectedRoute({ allowedRoles, children, fallbackRoute = _router.dashboard.index }: ProtectedRouteProps) {
	// ── Step 1: Check token before making any API call ─────────────────────────
	// If there's no valid token in storage, redirect to login immediately
	// without waiting for useCurrentUser to fail.
	const storedAuth = loadAuthFromStorage();
	const hasValidToken = !!storedAuth?.accessToken && !isTokenExpired(storedAuth.expiresAt);

	if (!hasValidToken) {
		return <Navigate to={_router.auth.index} replace />;
	}

	// ── Step 2: Token exists — fetch the user to check their role ──────────────
	return (
		<AuthorizedRoute allowedRoles={allowedRoles} fallbackRoute={fallbackRoute}>
			{children}
		</AuthorizedRoute>
	);
}

// Separated so hooks are only called when we know the token is valid
function AuthorizedRoute({ allowedRoles, children, fallbackRoute }: ProtectedRouteProps) {
	const { data: user, isLoading } = useCurrentUser() as {
		data?: User;
		isLoading: boolean;
	};

	if (isLoading) return null;

	if (!user || !user.role || !allowedRoles.includes(user.role.role)) {
		return <Navigate to={fallbackRoute!} replace />;
	}

	return <>{children}</>;
}
