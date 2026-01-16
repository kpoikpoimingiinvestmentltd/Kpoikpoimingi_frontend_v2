import { useCurrentUser } from "./useCurrentUser";
import { ROLE_BASED_ACCESS } from "@/config/roleBasedAccess";
import type { User } from "@/types/user";

/**
 * Hook to check if current user has a specific role
 */
export function useHasRole(roles: string[]) {
	const { data: user } = useCurrentUser() as { data?: User; isLoading: boolean };
	return user?.role?.role ? roles.includes(user.role.role) : false;
}

/**
 * Hook to check if current user can perform a specific action
 */
export function useCanPerformAction(action: keyof typeof ROLE_BASED_ACCESS, allowedRoles?: string[]) {
	const { data: user } = useCurrentUser() as { data?: User; isLoading: boolean };

	if (!user?.role?.role) return false;

	const roles = allowedRoles || ROLE_BASED_ACCESS[action];

	if (!Array.isArray(roles)) {
		return false; // Action has sub-configurations, not directly checkable
	}

	return (roles as string[]).includes(user.role.role);
}

/**
 * Hook specifically for delete permissions
 */
export function useCanDelete() {
	return useHasRole(ROLE_BASED_ACCESS.delete);
}

/**
 * Hook to check if user can export data
 */
export function useCanExport() {
	return useHasRole(ROLE_BASED_ACCESS.export);
}

/**
 * Hook to check if user can download receipts
 */
export function useCanDownloadReceipt() {
	return useHasRole(ROLE_BASED_ACCESS.receiptDownload);
}

/**
 * Hook to check if user can access VAT and interest settings
 */
export function useCanAccessVATSettings() {
	return useHasRole(ROLE_BASED_ACCESS.vATAndInterestSettings);
}

/**
 * Hook to check if user is SUPER_ADMIN
 */
export function useIsSuperAdmin() {
	return useHasRole(["SUPER_ADMIN"]);
}

/**
 * Hook to check if user is ADMIN or above
 */
export function useIsAdmin() {
	return useHasRole(["ADMIN", "SUPER_ADMIN"]);
}

/**
 * Hook to check if user is STAFF only
 */
export function useIsStaff() {
	return useHasRole(["STAFF"]);
}
