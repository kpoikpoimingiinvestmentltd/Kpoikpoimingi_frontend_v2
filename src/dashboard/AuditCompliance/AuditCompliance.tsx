import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import CompactPagination from "@/components/ui/compact-pagination";
import EmptyData from "@/components/common/EmptyData";
import CustomCard from "@/components/base/CustomCard";
import { useGetAuditLogsGrouped, useExportAuditLogs } from "@/api/analytics";
import PageTitles from "@/components/common/PageTitles";
import { CardSkeleton } from "@/components/common/Skeleton";
import SearchWithFilters from "@/components/common/SearchWithFilters";
import type { FilterField } from "@/components/common/SearchWithFilters";
import { useDebounceSearch } from "@/hooks/useDebounceSearch";
import ExportConfirmModal from "@/components/common/ExportConfirmModal";
import ActionButton from "@/components/base/ActionButton";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";
import { ExportFileIcon, IconWrapper } from "../../assets/icons";
import type { AuditLogGroup, AuditLogItem } from "@/types/auditLogs";

/** HTML date input (YYYY-MM-DD) → API filter (DD-MM-YYYY) */
function toApiDate(isoDate?: string): string | undefined {
	if (!isoDate) return undefined;
	const [year, month, day] = isoDate.split("-");
	if (!year || !month || !day) return undefined;
	return `${day}-${month}-${year}`;
}

function titleCase(value: string): string {
	return value
		.replace(/[_-]+/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.toLowerCase()
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatRole(role?: string | null): string {
	if (!role) return "Staff";
	const map: Record<string, string> = {
		SUPER_ADMIN: "Super Admin",
		ADMIN: "Admin",
		STAFF: "Staff",
		USER: "User",
	};
	return map[role] || titleCase(role);
}

function formatArea(entityType?: string | null): string | null {
	if (!entityType) return null;
	const map: Record<string, string> = {
		CUSTOMER: "Customers",
		CONTRACT: "Contracts",
		PAYMENT: "Payments",
		RECEIPT: "Receipts",
		DEBT: "Debts",
		NOTIFICATION: "Notifications",
		AUDIT_LOG: "Audit",
		PROPERTY: "Properties",
		PAYMENT_LINK: "Payment links",
		USER: "Staff accounts",
		SETTINGS: "Settings",
	};
	return map[entityType] || titleCase(entityType);
}

/**
 * Turn raw audit strings like "CREATED CONTRACT" or
 * "UPDATE CUSTOMER: CUS-001 - Ada" into plain English.
 */
function explainAction(raw?: string | null): { summary: string; detail?: string } {
	if (!raw?.trim()) return { summary: "Did something in the system" };

	const action = raw.trim();
	const [head, ...rest] = action.split(/[:\-–—]/).map((s) => s.trim()).filter(Boolean);
	const detail = rest.length ? rest.join(" — ") : undefined;
	const key = head.toUpperCase();

	const known: Record<string, string> = {
		"CREATED CONTRACT": "Created a new contract",
		"EDIT CONTRACT": "Edited a contract",
		"MANUALLY PROCESSED DOWN PAYMENT": "Manually processed a down payment",
		"EXPORT CONTRACTS": "Exported contracts",
		"EXPORT CUSTOMER REGISTRATIONS": "Exported customer registrations",
		"EXPORT DUE PAYMENTS": "Exported due payments",
		"EXPORT INTEREST PENALTIES": "Exported interest penalties",
		"EXPORT INTEREST PENALTIES HISTORY": "Exported interest penalty history",
		"UPDATE CUSTOMER": "Updated a customer",
		"DELETE CUSTOMER": "Deleted a customer",
		"SENT EMAIL TO SPECIFIC CUSTOMERS": "Sent email to selected customers",
		"BROADCAST EMAIL TO ALL CUSTOMERS": "Sent a broadcast email to all customers",
		"UPDATE CUSTOMER REGISTRATION": "Updated a customer registration",
		"REGISTRATION DELETED": "Deleted a customer registration",
		"SEND CONTRACT": "Sent a contract",
		"EMAIL RECEIPT": "Emailed a receipt",
		"DOWNLOAD RECEIPT": "Downloaded a receipt",
		"CREATED USER": "Created a staff account",
		"CHANGED PASSWORD": "Changed a password",
		"RESET PASSWORD": "Reset a password",
		"UPDATED USER": "Updated a staff account",
		"UPLOADED PROFILE PICTURE": "Uploaded a profile picture",
		"DELETED USER": "Deleted a staff account",
		"LOGGED IN": "Logged in",
		"LOGGED OUT": "Logged out",
		"UPDATED VAT RATE": "Updated the VAT rate",
		"UPDATED INTEREST RATE": "Updated the interest rate",
		"UPDATED PENALTY RATE": "Updated the penalty rate",
		"CATEGORY CREATED": "Created a category",
		"SUBCATEGORY ADDED": "Added a subcategory",
		"CATEGORY UPDATED": "Updated a category",
		"CATEGORY DELETED": "Deleted a category",
		"SUBCATEGORY DELETED": "Deleted a subcategory",
		"CASCADE DELETE": "Deleted a category and its subcategories",
	};

	if (known[key]) {
		return { summary: known[key], detail };
	}

	// Prefix matches e.g. "CREATED USER - Jane"
	for (const [pattern, summary] of Object.entries(known)) {
		if (key.startsWith(pattern)) {
			const leftover = head.slice(pattern.length).replace(/^[\s\-–—:]+/, "").trim();
			return { summary, detail: leftover || detail };
		}
	}

	// Generic fallback: "CREATED SOMETHING" → "Created something"
	const softened = titleCase(head)
		.replace(/\bCreated\b/i, "Created")
		.replace(/\bUpdated\b/i, "Updated")
		.replace(/\bDeleted\b/i, "Deleted")
		.replace(/\bExported\b/i, "Exported")
		.replace(/\bLogged In\b/i, "Logged in")
		.replace(/\bLogged Out\b/i, "Logged out");

	return { summary: softened, detail };
}

function formatWhen(dateStr: string, timeStr: string): string {
	let dateLabel = dateStr;
	try {
		const parts = dateStr.includes("/") ? dateStr.split("/") : dateStr.split("-");
		if (parts.length === 3) {
			const day = parseInt(parts[0], 10);
			const month = parseInt(parts[1], 10) - 1;
			const year = parseInt(parts[2].length === 2 ? `20${parts[2]}` : parts[2], 10);
			const dateObj = new Date(year, month, day);
			if (!Number.isNaN(dateObj.getTime())) {
				dateLabel = dateObj.toLocaleDateString("en-GB", {
					weekday: "short",
					day: "numeric",
					month: "short",
					year: "numeric",
				});
			}
		}
	} catch {
		/* keep raw */
	}

	let timeLabel = timeStr;
	try {
		const [hours, minutes] = timeStr.split(":").map(Number);
		if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
			const period = hours >= 12 ? "PM" : "AM";
			const hours12 = hours % 12 || 12;
			timeLabel = `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
		}
	} catch {
		/* keep raw */
	}

	return `${dateLabel} · ${timeLabel}`;
}

function readFiltersFromParams(params: URLSearchParams): Record<string, string> {
	const filters: Record<string, string> = {};
	const startDate = params.get("startDate");
	const endDate = params.get("endDate");
	if (startDate) filters.startDate = startDate;
	if (endDate) filters.endDate = endDate;
	return filters;
}

function ActivityRow({ log }: { log: AuditLogItem }) {
	const { summary, detail } = explainAction(log.action);
	const who = log.staffName || "Unknown staff";
	const role = formatRole(log.role);
	const area = formatArea(log.entityType);
	const when = formatWhen(log.date, log.time);

	return (
		<article className="rounded-md border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-4 sm:px-5">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0 space-y-1.5">
					<p className="text-[15px] leading-snug text-slate-900 dark:text-slate-100">
						<span className="font-semibold">{who}</span>{" "}
						{summary.charAt(0).toLowerCase() + summary.slice(1)}
					</p>
					{detail && (
						<p className="text-sm text-slate-600 dark:text-slate-300 break-words">
							<span className="text-muted-foreground">Details: </span>
							{detail}
						</p>
					)}
					<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground pt-0.5">
						<span>{role}</span>
						{log.email && (
							<>
								<span aria-hidden>·</span>
								<span className="truncate max-w-[220px]">{log.email}</span>
							</>
						)}
						{area && (
							<>
								<span aria-hidden>·</span>
								<span>Area: {area}</span>
							</>
						)}
					</div>
				</div>
				<time className="shrink-0 text-sm text-muted-foreground sm:text-right whitespace-nowrap">
					{when}
				</time>
			</div>
		</article>
	);
}

export default function AuditCompliance() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [page, setPage] = useState(() => {
		const pageParam = searchParams.get("page");
		return pageParam ? parseInt(pageParam, 10) : 1;
	});
	const [search, setSearch] = useState(() => searchParams.get("search") || "");
	const [filters, setFilters] = useState<Record<string, string>>(() => readFiltersFromParams(searchParams));
	const [showExportModal, setShowExportModal] = useState(false);

	const pageSize = 10;
	const debouncedSearch = useDebounceSearch(search, 400);
	const startDate = filters.startDate || undefined;
	const endDate = filters.endDate || undefined;
	const apiStartDate = toApiDate(startDate);
	const apiEndDate = toApiDate(endDate);

	useEffect(() => {
		const params = new URLSearchParams();
		params.set("page", String(page));
		if (search) params.set("search", search);
		if (filters.startDate) params.set("startDate", filters.startDate);
		if (filters.endDate) params.set("endDate", filters.endDate);
		setSearchParams(params, { replace: true });
	}, [page, search, filters, setSearchParams]);

	const { data: auditData, isLoading } = useGetAuditLogsGrouped(
		page,
		pageSize,
		debouncedSearch || undefined,
		apiStartDate,
		apiEndDate,
	);

	const groups: AuditLogGroup[] = Array.isArray(auditData?.data) ? auditData.data : [];
	const pagination = {
		total: auditData?.pagination?.total ?? 0,
		totalPages: auditData?.pagination?.totalPages ?? 1,
	};
	const isEmpty = !isLoading && groups.length === 0;

	const exportMutation = useExportAuditLogs();

	const filterFields: FilterField[] = useMemo(
		() => [
			{ key: "startDate", label: "From date", type: "date" },
			{ key: "endDate", label: "To date", type: "date" },
		],
		[],
	);

	const hasActiveFilters = !!(debouncedSearch || startDate || endDate);

	const getFilterLabels = () => {
		const labels: Record<string, string> = {};
		if (startDate) labels["From"] = startDate;
		if (endDate) labels["To"] = endDate;
		if (debouncedSearch) labels["Search"] = debouncedSearch;
		return labels;
	};

	const downloadBlob = (blob: Blob, filename: string) => {
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const handleExportFiltered = async () => {
		try {
			const blob = await exportMutation.mutateAsync({
				search: debouncedSearch || undefined,
				startDate: apiStartDate,
				endDate: apiEndDate,
			});
			downloadBlob(blob, `audit-logs-filtered-${new Date().toISOString().slice(0, 10)}.csv`);
			toast.success("Activity log exported");
			setShowExportModal(false);
		} catch (err) {
			toast.error(extractErrorMessage(err, "Could not export activity log"));
		}
	};

	const handleExportAll = async () => {
		try {
			const blob = await exportMutation.mutateAsync({});
			downloadBlob(blob, `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`);
			toast.success("Activity log exported");
			setShowExportModal(false);
		} catch (err) {
			toast.error(extractErrorMessage(err, "Could not export activity log"));
		}
	};

	const handleExportClick = () => {
		if (hasActiveFilters) setShowExportModal(true);
		else handleExportAll();
	};

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles
					title="Audit & Compliance"
					description="A clear history of what staff did in the system — who acted, what changed, and when"
				/>
				<ActionButton
					type="button"
					className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-2"
					onClick={handleExportClick}
					disabled={exportMutation.isPending}>
					<IconWrapper className="text-base">
						<ExportFileIcon />
					</IconWrapper>
					<span className="text-sm">{exportMutation.isPending ? "Exporting..." : "Download CSV"}</span>
				</ActionButton>
			</div>

			<div className="flex items-center gap-2 flex-wrap">
				<SearchWithFilters
					search={search}
					onSearchChange={(value) => {
						setSearch(value);
						setPage(1);
					}}
					setPage={setPage}
					placeholder="Search by person, email, or what they did"
					showFilter={true}
					fields={filterFields}
					initialValues={{
						startDate: filters.startDate || "",
						endDate: filters.endDate || "",
					}}
					onApply={(next) => {
						setFilters(next);
						setPage(1);
					}}
					onReset={() => {
						setSearch("");
						setFilters({});
						setPage(1);
					}}
				/>
				{hasActiveFilters && (
					<span className="text-xs text-muted-foreground">
						{pagination.total.toLocaleString()} matching activit
						{pagination.total === 1 ? "y" : "ies"}
					</span>
				)}
			</div>

			<ExportConfirmModal
				open={showExportModal}
				onOpenChange={setShowExportModal}
				searchTerm={debouncedSearch}
				filterLabels={getFilterLabels()}
				onExportFiltered={handleExportFiltered}
				onExportAll={handleExportAll}
				isLoading={exportMutation.isPending}
			/>

			<div className="min-h-96 flex">
				{isLoading ? (
					<CustomCard className="bg-transparent dark:bg-transparent p-0 border-0 w-full">
						<div className="flex flex-col gap-y-4">
							<CardSkeleton lines={3} />
							<CardSkeleton lines={3} />
							<CardSkeleton lines={3} />
						</div>
					</CustomCard>
				) : isEmpty ? (
					<EmptyData text="No staff activity found for this search" />
				) : (
					<CustomCard className="bg-transparent p-0 dark:bg-transparent border-0 w-full">
						<div className="flex flex-col gap-y-8">
							{groups.map((group) => (
								<section key={group.title}>
									<div className="flex items-center gap-2 mb-3">
										<h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
											{group.isCurrentMonth ? "This month" : group.title}
										</h3>
										<span className="text-xs text-muted-foreground">
											{group.logs.length} activit{group.logs.length === 1 ? "y" : "ies"}
										</span>
									</div>
									<div className="flex flex-col gap-3">
										{group.logs.map((log) => (
											<ActivityRow key={log.id} log={log} />
										))}
									</div>
								</section>
							))}
						</div>
						<div className="mt-8">
							<CompactPagination
								page={page}
								pages={pagination.totalPages}
								onPageChange={setPage}
								showRange
							/>
						</div>
					</CustomCard>
				)}
			</div>
		</div>
	);
}
