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

		const visible = Math.min(3, pages);

		for (let i = 1; i <= visible; i++) {
			nodes.push(
				<PaginationItem key={i}>
					<PaginationLink isActive={page === i} onClick={() => onPageChange(i)}>
						{i}
					</PaginationLink>
				</PaginationItem>
			);
		}

		if (pages > visible + 1) {
			nodes.push(
				<PaginationItem key="e">
					<PaginationEllipsis />
				</PaginationItem>
			);
			nodes.push(
				<PaginationItem key={pages}>
					<PaginationLink isActive={page === pages} onClick={() => onPageChange(pages)}>
						{pages}
					</PaginationLink>
				</PaginationItem>
			);
		} else if (pages === visible + 1) {
			nodes.push(
				<PaginationItem key={visible + 1}>
					<PaginationLink isActive={page === visible + 1} onClick={() => onPageChange(visible + 1)}>
						{visible + 1}
					</PaginationLink>
				</PaginationItem>
			);
		}

		return nodes;
	};

	const start = (page - 1) * perPage + 1;
	const end = Math.min(page * perPage, total ?? pages * perPage);

	return (
		<div className={twMerge("mt-8 flex flex-col min-[500px]:flex-row text-center justify-between items-center md:justify-between", className)}>
			{showRange && (
				<div className="mr-4 flex items-center text-sm text-muted-foreground">
					Showing{" "}
					<span className="font-medium ml-1 mr-1">
						{start}-{end}
					</span>{" "}
					of <span className="font-medium mx-1">{total ?? pages * perPage} </span> results
				</div>
			)}
			<Pagination className="ml-auto md:justify-end justify-end">
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
