import { DebateIcon, LiveIcon, PastIcon, UpcomingIcon } from "@/assets/icons";
import CustomCard from "@/components/base/CustomCard";
import { Button } from "@/components/ui/button";
import Badge from "@/components/base/Badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { inputStyle, preTableButtonStyle, switchStyle } from "@/components/common/commonStyles";
import { FilterIcon, IconWrapper, SearchIcon, ThreeDotsIcon } from "@/assets/icons";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router";
import { _router } from "@/routes/_router";
import { Switch } from "@/components/ui/switch";
import { twMerge } from "tailwind-merge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ViewCategoryModal, EditCategoryModal, DeleteCategoryModal } from "./DebateCategoryModals";

type TicketItem = {
	id: string;
	sender: string;
	email: string;
	subject: string;
	date: string;
	status: string;
	active: boolean;
	category: string;
};

const categoriesList = ["Entertainment", "Politics", "Sports", "Football", "Technology", "Humanity"];

const sample: TicketItem[] = Array.from({ length: 22 }).map((_, i) => ({
	id: `#${1232 + i}`,
	sender: "Eddienwaneri",
	email: "eddienwaneri@example.com",
	subject: "Lorem ipsum ipsum",
	date: "2/1/2025",
	status: i % 3 === 0 ? "In Progress" : i % 3 === 1 ? "Unread" : "Resolved",
	active: i % 2 === 0,
	category: categoriesList[i % categoriesList.length],
}));

export default function DebateCategory() {
	const [q, setQ] = useState("");
	const [page, setPage] = useState(1);
	const perPage = 8;

	const categories = ["All", ...categoriesList];
	const [selectedCategory, setSelectedCategory] = useState<string>("All");

	// Use component state for the sample data so we can toggle items safely
	const [items, setItems] = useState<TicketItem[]>(sample);

	const [viewOpen, setViewOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [selected, setSelected] = useState<TicketItem | null>(null);

	const handleSave = (updated: TicketItem) => {
		setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
	};

	const handleDelete = (id: string) => {
		setItems((prev) => prev.filter((it) => it.id !== id));
	};

	const searched = useMemo(() => {
		if (!q) return items;
		return items.filter((s) => [s.id, s.sender, s.email, s.subject].join(" ").toLowerCase().includes(q.toLowerCase()));
	}, [q, items]);

	const categoryFiltered = useMemo(() => {
		if (selectedCategory === "All") return searched;
		return searched.filter((s) => s.category === selectedCategory);
	}, [selectedCategory, searched]);

	const total = categoryFiltered.length;
	const pages = Math.max(1, Math.ceil(total / perPage));
	const pageData = categoryFiltered.slice((page - 1) * perPage, page * perPage);

	const toggleActive = (id: string) => {
		// Toggle the active state of an item in the component state
		setItems((prev) => prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item)));
	};

	return (
		<div>
			<CustomCard>
				<div className="flex items-center justify-between mb-5 gap-1.5">
					<div className="flex items-center gap-2">
						<div className="relative md:w-80">
							<Input
								placeholder="Search debate category"
								aria-label="Search debate category"
								value={q}
								onChange={(e) => {
									setQ(e.target.value);
									setPage(1);
								}}
								className={`max-w-[320px] ${inputStyle} h-10 pl-9`}
							/>
							<IconWrapper className="absolute top-1/2 -translate-y-1/2 opacity-50 left-5 -translate-x-1/2">
								<SearchIcon />
							</IconWrapper>
						</div>
						<button type="button" className={`${preTableButtonStyle} bg-primary ml-auto`}>
							<IconWrapper className="text-base">
								<FilterIcon />
							</IconWrapper>
							<span className="hidden sm:inline">Filter</span>
						</button>
					</div>
					<Link to={_router.dashboard.debateAdd} className={`${preTableButtonStyle} bg-primary`}>
						<IconWrapper>
							<Plus size={16} />
						</IconWrapper>
						<span className="hidden sm:inline"> Add Category </span>
					</Link>
				</div>
				<div className="flex flex-col gap-4">
					{/* Category selector buttons */}
					<div className="flex flex-wrap gap-2 mb-3">
						{categories.map((c) => (
							<button
								key={c}
								type="button"
								className={`px-3 py-1 rounded-md text-sm ${
									selectedCategory === c ? "bg-primary text-white" : "bg-zinc-100 dark:bg-neutral-800 text-zinc-700 dark:text-zinc-300"
								}`}
								onClick={() => {
									setSelectedCategory(c);
									setPage(1);
								}}>
								{c} {c !== "All" && <span className="ml-2 text-xs text-muted">({items.filter((it) => it.category === c).length})</span>}
							</button>
						))}
					</div>
					{/* Table */}
					<div>
						<Table>
							<TableHeader>
								<TableRow className="bg-zinc-100 dark:bg-neutral-800">
									<TableHead>S/N</TableHead>
									<TableHead>All Categories</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{pageData.length === 0 ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center">
											No debates found.
										</TableCell>
									</TableRow>
								) : (
									pageData.map((row, index) => (
										<TableRow key={row.id}>
											<TableCell>{(page - 1) * perPage + index + 1}</TableCell>
											<TableCell>
												<div className="flex flex-col">
													<span className="font-medium">{row.sender}</span>
													<span className="text-xs text-muted">{row.category}</span>
												</div>
											</TableCell>
											<TableCell>{row.date}</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<span className="text-sm">{row.active ? "Active" : "Inactive"}</span>
													<Switch
														checked={row.active}
														className={`${twMerge(switchStyle, "data-[state=checked]:bg-green-600")}`}
														onCheckedChange={() => toggleActive(row.id)}
													/>
												</div>
											</TableCell>
											<TableCell>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="sm">
															<IconWrapper>
																<ThreeDotsIcon />
															</IconWrapper>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem
															onSelect={() => {
																setSelected(row);
																setViewOpen(true);
															}}>
															View category
														</DropdownMenuItem>
														<DropdownMenuItem
															onSelect={() => {
																setSelected(row);
																setEditOpen(true);
															}}>
															Edit category
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															className="text-destructive"
															onSelect={() => {
																setSelected(row);
																setDeleteOpen(true);
															}}>
															Delete category
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
						<div className="pt-2">
							<Pagination aria-label="pagination" className="mt-2 justify-end">
								<PaginationContent>
									<PaginationItem>
										<PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
									</PaginationItem>
									{Array.from({ length: pages }).map((_, i) => (
										<PaginationItem key={i}>
											<PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
												{i + 1}
											</PaginationLink>
										</PaginationItem>
									))}
									<PaginationItem>
										<PaginationNext onClick={() => setPage((p) => Math.min(pages, p + 1))} />
									</PaginationItem>
								</PaginationContent>
							</Pagination>
						</div>
					</div>
				</div>
			</CustomCard>

			{/* Modals */}
			<ViewCategoryModal
				open={viewOpen}
				onOpenChange={(o) => {
					setViewOpen(o);
					if (!o) setSelected(null);
				}}
				category={selected}
			/>
			<EditCategoryModal
				open={editOpen}
				onOpenChange={(o) => {
					setEditOpen(o);
					if (!o) setSelected(null);
				}}
				category={selected}
				onSave={handleSave}
			/>
			<DeleteCategoryModal
				open={deleteOpen}
				onOpenChange={(o) => {
					setDeleteOpen(o);
					if (!o) setSelected(null);
				}}
				category={selected}
				onDelete={handleDelete}
			/>
		</div>
	);
}
