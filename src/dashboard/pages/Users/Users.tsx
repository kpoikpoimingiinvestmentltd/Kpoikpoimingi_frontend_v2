import CustomCard from "@/components/base/CustomCard";
import { UserStats } from "../../../components/common/UserStats";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { inputStyle, preTableButtonStyle } from "@/components/common/commonStyles";
import {
	BlockedUserIcon,
	EyeIcon,
	FilterIcon,
	IconWrapper,
	// QuickViewIcon,
	SearchIcon,
	SuspendUserIcon,
	ThreeDotsIcon,
	WarnUserIcon,
} from "@/assets/icons";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { useState } from "react";
import OffcanvasQuickView from "./OffcanvasQuickView";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { _router } from "@/routes/_router";

const counts = {
	"Total Users": 100,
	"Active Users": 50,
	"Inactive Users": 30,
	"Banned/Reported Users": 20,
};

export default function Users() {
	const [tab, setTab] = useState("Total Users");
	const [q, setQ] = useState("");
	const [page, setPage] = useState(1);
	const [suspendModalOpen, setSuspendModalOpen] = useState(false);
	const [warnModalOpen, setWarnModalOpen] = useState(false);
	const [banModalOpen, setBanModalOpen] = useState(false);
	const [quickOpen, setQuickOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<any | null>(null);
	const pageData = Array.from({ length: 9 }, (_, i) => ({
		id: `${i + 1}`,
		serial_number: `#${i + 1}`,
		username: "Eddienwaneri",
		email: "eddienwaneri@example.com",
		dateJoined: "2/1/2025",
	}));
	const pages = Math.ceil(pageData.length / 10);

	return (
		<div>
			<UserStats />
			<CustomCard>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col-reverse lg:flex-row xl:items-center justify-between gap-4 mb-4">
						<Tabs
							value={tab}
							onValueChange={(v) => {
								setTab(v as any);
								setPage(1);
							}}>
							<TabsList className="overflow-x-auto w-full max-w-md md:max-w-xl lg:max-w-fit h-fit rounded-md justify-start">
								<TabsTrigger value="Total Users">Total Users ({counts["Total Users"]})</TabsTrigger>
								<TabsTrigger value="Active Users">Active Users ({counts["Active Users"]})</TabsTrigger>
								<TabsTrigger value="Inactive Users">Inactive Users ({counts["Inactive Users"]})</TabsTrigger>
								<TabsTrigger value="Banned/Reported Users">Banned/Reported Users ({counts["Banned/Reported Users"]})</TabsTrigger>
							</TabsList>
						</Tabs>

						<div className="flex items-center gap-2">
							<div className="relative w-80">
								<Input
									placeholder="Search subscription by id, email, subscriber etc"
									aria-label="search tickets"
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

							<button type="button" className={`${preTableButtonStyle} bg-primary`}>
								<IconWrapper className="text-base">
									<FilterIcon />
								</IconWrapper>
								<span className="hidden sm:inline">Filter</span>
							</button>
						</div>
					</div>

					<Table>
						<TableHeader>
							<TableRow className="bg-zinc-100 dark:bg-neutral-800">
								<TableHead>S/N</TableHead>
								<TableHead>Username</TableHead>
								<TableHead>Email Address</TableHead>
								<TableHead>Date joined</TableHead>
								<TableHead>Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{pageData.map((row, index) => (
								<TableRow key={row.id}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>{row.username}</TableCell>
									<TableCell className="text-sm text-gray-500">{row.email}</TableCell>
									<TableCell>{row.dateJoined}</TableCell>
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
													className="cursor-pointer"
													onClick={() => {
														setSelectedUser(row);
														setQuickOpen(true);
													}}>
													{/* <IconWrapper className="text-lg">
														<QuickViewIcon />
													</IconWrapper> */}
													<span>Quick View</span>
												</DropdownMenuItem>
												<DropdownMenuItem asChild>
													<Link to={_router.dashboard.userDetails.replace(":id", row.id)} className="cursor-pointer">
														<IconWrapper className="text-lg">
															<EyeIcon />
														</IconWrapper>
														<span>View details</span>
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem className="cursor-pointer" onClick={() => setSuspendModalOpen(true)}>
													<IconWrapper className="text-lg">
														<SuspendUserIcon />
													</IconWrapper>
													<span>Suspend user</span>
												</DropdownMenuItem>
												<DropdownMenuItem className="cursor-pointer" onClick={() => setWarnModalOpen(true)}>
													<IconWrapper className="text-lg">
														<WarnUserIcon />
													</IconWrapper>
													<span>Warn user</span>
												</DropdownMenuItem>
												<DropdownMenuItem className="cursor-pointer" onClick={() => setBanModalOpen(true)}>
													<IconWrapper className="text-lg">
														<BlockedUserIcon />
													</IconWrapper>
													<span>Ban user</span>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
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
			</CustomCard>
			{/* <SuspendUserModal open={suspendModalOpen} onOpenChange={setSuspendModalOpen} />
			<WarnUserModal open={warnModalOpen} onOpenChange={setWarnModalOpen} />
			<BanUserModal open={banModalOpen} onOpenChange={setBanModalOpen} /> */}
			<OffcanvasQuickView open={quickOpen} onOpenChange={setQuickOpen} title="Quick user view" user={selectedUser} />
		</div>
	);
}
