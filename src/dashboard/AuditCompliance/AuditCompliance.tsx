// icons not used in this file
import ExportTrigger from "@/components/common/ExportTrigger";
import PageTitles from "@/components/common/PageTitles";
import React, { useMemo, useState } from "react";
import CompactPagination from "@/components/ui/compact-pagination";
import EmptyData from "@/components/common/EmptyData";
import CustomCard from "@/components/base/CustomCard";

export default function AuditCompliance() {
	const [isEmpty] = React.useState(false);

	const groups = [
		{
			title: "This Month",
			items: Array.from({ length: 4 }).map((_, i) => ({
				id: `tm-${i}`,
				title: "Receipt Generated",
				subtitle: "Staff Name: Jones Michael O.",
				date: "12-03-2025",
			})),
		},
		{
			title: "12/03/2025",
			items: Array.from({ length: 2 }).map((_, i) => ({
				id: `d-${i}`,
				title: "Receipt Generated",
				subtitle: "Staff Name: Jones Michael O.",
				date: "12-03-2025",
			})),
		},
	];

	const [page, setPage] = useState(1);
	const pageSize = 4;

	const flat = useMemo(() => {
		return groups.flatMap((g) => g.items.map((it) => ({ ...it, groupTitle: g.title })));
	}, [groups]);

	const pages = Math.max(1, Math.ceil(flat.length / pageSize));
	const visible = useMemo(() => {
		const start = (page - 1) * pageSize;
		return flat.slice(start, start + pageSize);
	}, [flat, page]);

	const visibleGroups = useMemo(() => {
		const map = new Map<string, typeof visible>();
		visible.forEach((it) => {
			const arr = map.get(it.groupTitle) || [];
			arr.push(it);
			map.set(it.groupTitle, arr);
		});
		return Array.from(map.entries()).map(([title, items]) => ({ title, items }));
	}, [visible]);

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Audit & Compliance" description="This Contains all activities done indicating who performed the action" />
				<div className="flex items-center gap-3">
					<ExportTrigger title="Export" />
				</div>
			</div>
			<div className="min-h-96 flex">
				{!isEmpty ? (
					<CustomCard className="bg-transparent p-0 border-0">
						<div className="flex flex-col gap-y-6">
							{visibleGroups.map((g) => (
								<section key={g.title}>
									<h3 className="text-sm font-medium mb-2 text-[#111827]">{g.title}</h3>
									<div className="flex flex-col gap-y-4">
										{g.items.map((it) => (
											<RowItem key={it.id} title={it.title} subtitle={it.subtitle} date={it.date} />
										))}
									</div>
								</section>
							))}
						</div>
						<div className="mt-10">
							<div className="ml-auto">
								<CompactPagination page={page} pages={pages} onPageChange={setPage} />
							</div>
						</div>
					</CustomCard>
				) : (
					<EmptyData text="No Audit Records at the moment" />
				)}
			</div>
		</div>
	);
}

function RowItem({ title, subtitle, date }: { title: string; subtitle: string; date: string }) {
	return (
		<div className="rounded-lg bg-white p-5 border border-gray-100 flex items-start justify-between">
			<div>
				<h4 className="font-medium">{title}</h4>
				<p className="text-sm text-muted-foreground mt-2">{subtitle}</p>
			</div>
			<div className="text-right text-sm text-muted-foreground">Date: {date}</div>
		</div>
	);
}
