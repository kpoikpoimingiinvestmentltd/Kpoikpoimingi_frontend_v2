import React from "react";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from "@/components/ui/pagination";
import { twMerge } from "tailwind-merge";

type Props = {
	page: number;
	pages: number;
	onPageChange: (p: number) => void;
	className?: string;
	total?: number; // total items (optional)
	perPage?: number; // items per page (optional)
	showRange?: boolean; // if true, render "Showing X-Y of Z"
};

export default function CompactPagination({ page, pages, onPageChange, className, total, perPage = 10, showRange = false }: Props) {
	const render = () => {
		const nodes: React.ReactNode[] = [];

		// Show current page and adjacent pages
		const rangeStart = Math.max(1, page - 1);
		const rangeEnd = Math.min(pages, page + 1);

		// Always show page 1
		if (rangeStart > 1) {
			nodes.push(
				<PaginationItem key={1}>
					<PaginationLink isActive={page === 1} onClick={() => onPageChange(1)}>
						1
					</PaginationLink>
				</PaginationItem>,
			);
		}

		// Show ellipsis if there's a gap between 1 and rangeStart
		if (rangeStart > 2) {
			nodes.push(
				<PaginationItem key="e1">
					<PaginationEllipsis />
				</PaginationItem>,
			);
		}

		// Show range around current page
		for (let i = rangeStart; i <= rangeEnd; i++) {
			nodes.push(
				<PaginationItem key={i}>
					<PaginationLink isActive={page === i} onClick={() => onPageChange(i)}>
						{i}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		// Show ellipsis if there's a gap between rangeEnd and last page
		if (rangeEnd < pages - 1) {
			nodes.push(
				<PaginationItem key="e2">
					<PaginationEllipsis />
				</PaginationItem>,
			);
		}

		// Always show last page
		if (rangeEnd < pages) {
			nodes.push(
				<PaginationItem key={pages}>
					<PaginationLink isActive={page === pages} onClick={() => onPageChange(pages)}>
						{pages}
					</PaginationLink>
				</PaginationItem>,
			);
		}

		return nodes;
	};

	const start = (page - 1) * perPage + 1;
	const end = Math.min(page * perPage, total ?? pages * perPage);

	return (
		<div className={twMerge("mt-8 flex gap-4 flex-col min-[650px]:flex-row text-center justify-between items-center md:justify-between", className)}>
			{showRange && (
				<div className="mr-4 flex items-center text-sm text-muted-foreground">
					Showing{" "}
					<span className="font-medium ml-1 mr-1">
						{start}-{end}
					</span>{" "}
					of <span className="font-medium mx-1">{total ?? pages * perPage} </span> results
				</div>
			)}
			<Pagination className="md:ml-auto md:justify-end justify-center">
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							className="disabled:cursor-not-allowed disabled:pointer-events-auto"
							disabled={page <= 1}
							onClick={() => page > 1 && onPageChange(Math.max(1, page - 1))}
						/>
					</PaginationItem>

					{render()}

					<PaginationItem>
						<PaginationNext
							className="disabled:cursor-not-allowed disabled:pointer-events-auto"
							disabled={page >= pages}
							onClick={() => page < pages && onPageChange(Math.min(pages, page + 1))}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
