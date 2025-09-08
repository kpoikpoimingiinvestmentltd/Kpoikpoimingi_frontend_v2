import { useMemo, useState } from "react";
import CustomCard from "@/components/base/CustomCard";
import { Input } from "@/components/ui/input";
import { inputStyle, preTableButtonStyle, switchStyle } from "@/components/common/commonStyles";
import { IconWrapper, SearchIcon, FilterIcon, ThreeDotsIcon, EyeIcon } from "@/assets/icons";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from "@/components/ui/pagination";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Edit, PlusIcon, TrashIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";
import ProfitSharingDetailsOffcanvas from "./ProfitSharingDetailsOffcanvas";

type TierItem = {
	id: string;
	tier: string;
	platformShare: string;
	creatorShare: string;
	date: string;
	active: boolean;
};

const sample: TierItem[] = [
	{ id: "1", tier: "Free Debates", platformShare: "0%", creatorShare: "0%", date: "2/1/2025", active: true },
	{ id: "2", tier: "Paid Debates", platformShare: "80%", creatorShare: "20%", date: "2/1/2025", active: true },
	{ id: "3", tier: "Free Debates", platformShare: "0%", creatorShare: "0%", date: "2/1/2025", active: true },
	{ id: "4", tier: "Paid Debates", platformShare: "80%", creatorShare: "20%", date: "2/1/2025", active: true },
	{ id: "5", tier: "Free Debates", platformShare: "0%", creatorShare: "0%", date: "2/1/2025", active: true },
	{ id: "6", tier: "Paid Debates", platformShare: "80%", creatorShare: "20%", date: "2/1/2025", active: true },
	{ id: "7", tier: "Free Debates", platformShare: "0%", creatorShare: "0%", date: "2/1/2025", active: true },
];

export default function ProfitSharing() {
	const [q, setQ] = useState("");
	const [page, setPage] = useState(1);
	const perPage = 7;
	const [data, setData] = useState<TierItem[]>(sample);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [selectedId, setSelectedId] = useState<string | null>(null);

	const filtered = useMemo(() => {
		if (!q) return data;
		return data.filter((d) => [d.tier, d.platformShare, d.creatorShare, d.date].join(" ").toLowerCase().includes(q.toLowerCase()));
	}, [q, data]);

	const total = filtered.length;
	const pages = Math.max(1, Math.ceil(total / perPage));
	const pageData = filtered.slice((page - 1) * perPage, page * perPage);

	function toggleActive(id: string) {
		setData((prev) => prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
	}

	return (
		<div>
			<CustomCard>
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2 w-full lg:w-auto mb-4">
						<div className="relative w-full lg:w-80">
							<Input
								placeholder="Search debate"
								aria-label="Search debate"
								value={q}
								onChange={(e) => {
									setQ(e.target.value);
									setPage(1);
								}}
								className={`max-w-[420px] ${inputStyle} h-10 pl-9`}
							/>
							<IconWrapper className="absolute top-1/2 -translate-y-1/2 opacity-50 left-5 -translate-x-1/2">
								<SearchIcon />
							</IconWrapper>
						</div>
						<button type="button" className={`${preTableButtonStyle} bg-primary`}>
							<IconWrapper className="text-base">
								<FilterIcon />
							</IconWrapper>
							<span className="hidden sm:inline">Filter</span>
						</button>
						<button type="button" className={`${preTableButtonStyle} ml-auto bg-primary`}>
							<IconWrapper className="text-base">
								<PlusIcon size={"1em"} />
							</IconWrapper>
							<span className="hidden sm:inline">Add</span>
						</button>
					</div>

					<Table>
						<TableHeader>
							<TableRow className="bg-zinc-100 dark:bg-neutral-800">
								<TableHead>S/N</TableHead>
								<TableHead>Tier</TableHead>
								<TableHead>Platform Share</TableHead>
								<TableHead>Creator Share</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{pageData.map((row, i) => (
								<TableRow key={row.id}>
									<TableCell>{(page - 1) * perPage + i + 1}</TableCell>
									<TableCell>{row.tier}</TableCell>
									<TableCell>{row.platformShare}</TableCell>
									<TableCell>{row.creatorShare}</TableCell>
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
										<div className="flex items-center gap-2">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant="ghost" size="sm">
														<IconWrapper>
															<ThreeDotsIcon />
														</IconWrapper>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent>
													<DropdownMenuItem
														className="cursor-pointer"
														onSelect={() => {
															setSelectedId(row.id);
															setSheetOpen(true);
														}}>
														<IconWrapper>
															<EyeIcon />
														</IconWrapper>
														<span>View</span>
													</DropdownMenuItem>
													<DropdownMenuItem className="cursor-pointer">
														<IconWrapper>
															<Edit />
														</IconWrapper>
														<span>Edit</span>
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem className="cursor-pointer text-destructive">
														<IconWrapper>
															<TrashIcon />
														</IconWrapper>
														<span>Delete</span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</TableCell>
								</TableRow>
							))}
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
			</CustomCard>
			<ProfitSharingDetailsOffcanvas
				open={sheetOpen}
				onOpenChange={(o) => {
					setSheetOpen(o);
					if (!o) setSelectedId(null);
				}}
				item={data.find((d) => d.id === selectedId) ?? null}
			/>
		</div>
	);
}
