import { useState } from "react";
import CompactPagination from "@/components/ui/compact-pagination";
import EmptyData from "@/components/common/EmptyData";
import CustomCard from "@/components/base/CustomCard";
import { useGetAuditLogsGrouped } from "@/api/analytics";
import PageTitles from "@/components/common/PageTitles";
import ExportTrigger from "@/components/common/ExportTrigger";
import { CardSkeleton } from "@/components/common/Skeleton";

export default function AuditCompliance() {
	const [page, setPage] = useState(1);
	const pageSize = 10;

	// Fetch grouped audit logs
	const { data: auditData, isLoading } = useGetAuditLogsGrouped(page, pageSize);

	const groups = (auditData as any)?.data || [];
	const pagination = (auditData as any)?.pagination || { total: 0, totalPages: 1 };
	const isEmpty = !isLoading && groups.length === 0;

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Audit & Compliance" description="This Contains all activities done indicating who performed the action" />
				<div className="flex items-center gap-3">
					<ExportTrigger title="Export" />
				</div>
			</div>
			<div className="min-h-96 flex">
				{isLoading ? (
					<CustomCard className="bg-transparent p-0 border-0 w-full">
						<div className="flex flex-col gap-y-4">
							<CardSkeleton lines={3} />
							<CardSkeleton lines={3} />
							<CardSkeleton lines={3} />
						</div>
					</CustomCard>
				) : isEmpty ? (
					<EmptyData text="No Audit Records at the moment" />
				) : (
					<CustomCard className="bg-transparent p-0 border-0 w-full">
						<div className="flex flex-col gap-y-6">
							{groups.map((group: any) => (
								<section key={group.title}>
									<h3 className="text-sm font-medium mb-2 text-[#111827]">{group.title}</h3>
									<div className="flex flex-col gap-y-4">
										{group.logs?.map((log: any) => (
											<RowItem key={log.id} action={log.action} staffName={log.staffName} date={log.date} time={log.time} />
										))}
									</div>
								</section>
							))}
						</div>
						<div className="mt-10">
							<div className="ml-auto">
								<CompactPagination page={page} pages={pagination.totalPages} onPageChange={setPage} />
							</div>
						</div>
					</CustomCard>
				)}
			</div>
		</div>
	);
}

function RowItem({ action, staffName, date, time }: { action: string; staffName: string; date: string; time: string }) {
	return (
		<div className="rounded-lg bg-white p-5 border border-gray-100 flex items-start justify-between">
			<div>
				<h4 className="font-medium">{action}</h4>
				<p className="text-sm text-muted-foreground mt-2">Staff Name: {staffName}</p>
			</div>
			<div className="text-right text-sm text-muted-foreground">
				<div>{date}</div>
				<div>{time}</div>
			</div>
		</div>
	);
}
