
export function formatAdminIssuerLabel(issuedBy?: {
	staffCode?: string | null;
	fullName?: string | null;
} | null): string | null {
	if (!issuedBy) return null;
	const code = issuedBy.staffCode?.trim();
	const name = issuedBy.fullName?.trim();
	if (code && name) return `${code} · ${name}`;
	if (code) return code;
	if (name) return name;
	return null;
}
