/**
 * Example component showing how to conditionally render actions based on user role
 */

import { useCanDelete, useIsAdmin, useIsSuperAdmin, useCanPerformAction } from "@/hooks/usePermissions";
import { Button } from "@/components/ui/button";

export function ActionButtonsExample() {
	const canDelete = useCanDelete();
	const isAdmin = useIsAdmin();
	const isSuperAdmin = useIsSuperAdmin();
	const canDeclineRequest = useCanPerformAction("productRequest");

	return (
		<div className="flex gap-2">
			{/* Available to ADMIN and SUPER_ADMIN */}
			{canDelete && <Button variant="destructive">Delete Item</Button>}

			{/* Available to ADMIN and SUPER_ADMIN */}
			{isAdmin && <Button>Export Data</Button>}

			{/* Available only to SUPER_ADMIN */}
			{isSuperAdmin && <Button>Terminate Contract</Button>}

			{/* Available to ADMIN and SUPER_ADMIN */}
			{canDeclineRequest && <Button>Decline Request</Button>}
		</div>
	);
}
