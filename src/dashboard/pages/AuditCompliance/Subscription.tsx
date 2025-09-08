import StatCard from "@/components/base/StatCard";
import { ActiveSubscriptionIcon, AllSubscriptionIcon, CancelledSubscriptionIcon, FilterIcon, InactiveSubscriptionIcon } from "@/assets/icons";
import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IconWrapper, EyeIcon, ThreeDotsIcon, SearchIcon } from "@/assets/icons";
import Badge from "@/components/base/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Plus } from "lucide-react";
import CustomCard from "@/components/base/CustomCard";
import { inputStyle, preTableButtonStyle } from "@/components/common/commonStyles";
import { Link } from "react-router";
import { _router } from "../../../../routes/_router";
import { AddNewSubscriptionModal } from "./SubscriptionModals";

type Subscription = {
	id: string;
	subscriber: string;
	email: string;
	plan: string;
	date: string;
	status: "Active" | "Expired" | "Canceled";
};

const MOCK: Subscription[] = [
	{ id: "#1232", subscriber: "Eddienwaneri", email: "eddienwaneri@example.com", plan: "Pro/Verified", date: "2/1/2025", status: "Expired" },
	{ id: "#1233", subscriber: "Amina John", email: "amina@example.com", plan: "Basic", date: "3/4/2025", status: "Active" },
	{ id: "#1234", subscriber: "Carlos Sen", email: "carlos@example.com", plan: "Pro/Verified", date: "1/12/2025", status: "Canceled" },
];

export default function Subscription() {
	const [query, setQuery] = useState("");
	const [tab, setTab] = useState<"All" | "Active" | "Expired" | "Canceled">("All");
	const [page, setPage] = useState(1);
	const pageSize = 8;

	const filtered = useMemo(() => {
		return MOCK.filter((s) => {
			if (tab !== "All" && s.status !== tab) return false;
			if (!query) return true;
			const q = query.toLowerCase();
			return s.subscriber.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
		});
	}, [query, tab]);

	const total = filtered.length;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

	// reset page when filters change
	useEffect(() => {
		setPage(1);
	}, [query, tab]);
	return (
		<div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2 mb-4">
				<StatCard title="All Subscriptions" value={1000} icon={<AllSubscriptionIcon />} />
				<StatCard title="Active Subscriptions" value={500} icon={<ActiveSubscriptionIcon />} />
				<StatCard title="Expired Subscriptions" value={300} icon={<InactiveSubscriptionIcon />} />
				<StatCard title="Cancelled Subscriptions" value={300} icon={<CancelledSubscriptionIcon />} />
			</div>

			<CustomCard className="bg-white w-full dark:bg-neutral-900 rounded-lg p-4 border">
				<div className="flex items-center gap-3 mb-4">
					<div className="relative w-80">
						<Input
							placeholder="Search subscription by id, email, subscriber etc"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className={`max-w-[320px] ${inputStyle} h-10 pl-9`}
						/>
						<IconWrapper className="absolute top-1/2 -translate-y-1/2 opacity-50 left-5 -translate-x-1/2">
							<SearchIcon />
						</IconWrapper>
					</div>
					<button type="button" className={`${preTableButtonStyle} bg-primary`}>
						<IconWrapper className="text-lg">
							<FilterIcon />
						</IconWrapper>
						<span className="hidden sm:inline">Filter</span>
					</button>
					<div className="ml-auto flex items-center gap-3">
						<Link to={_router.dashboard.addSubscriber} className={`${preTableButtonStyle} bg-primary`}>
							<IconWrapper>
								<Plus size={16} />
							</IconWrapper>
							<span className="hidden sm:inline"> Add New </span>
						</Link>
					</div>
				</div>

				<div className="overflow-x-auto w-full">
					<div className="mb-6 mt-5">
						<Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
							<TabsList className="overflow-x-auto w-full max-w-md md:max-w-fit h-fit rounded-md justify-start">
								<TabsTrigger value="All">All Subscriptions</TabsTrigger>
								<TabsTrigger value="Active">Active Subscriptions</TabsTrigger>
								<TabsTrigger value="Expired">Expired Subscriptions</TabsTrigger>
								<TabsTrigger value="Cancelled">Cancelled Subscriptions</TabsTrigger>
							</TabsList>

							<TabsContent value={tab} className="mt-5">
								<Table>
									<TableHeader>
										<TableRow className="bg-neutral-50 dark:bg-neutral-800">
											<TableHead>Ticket ID</TableHead>
											<TableHead>Subscriber</TableHead>
											<TableHead>Email Address</TableHead>
											<TableHead>Plan</TableHead>
											<TableHead>Date</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Action</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{paged.map((row) => (
											<TableRow key={row.id}>
												<TableCell>{row.id}</TableCell>
												<TableCell>{row.subscriber}</TableCell>
												<TableCell>{row.email}</TableCell>
												<TableCell>{row.plan}</TableCell>
												<TableCell>{row.date}</TableCell>
												<TableCell>
													<Badge size="sm" value={row.status} />
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost">
																<IconWrapper>
																	<ThreeDotsIcon />
																</IconWrapper>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem asChild>
																<Link to={_router.dashboard.subscriptionHistory} className="flex items-center gap-2 cursor-pointer">
																	<IconWrapper>
																		<EyeIcon />
																	</IconWrapper>
																	<span>View payment history</span>
																</Link>
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TabsContent>
						</Tabs>
					</div>
				</div>
				<div className="mt-4">
					<Pagination className="justify-end">
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious onClick={() => setPage((p) => Math.max(1, p - 1))} />
							</PaginationItem>

							{Array.from({ length: totalPages }).map((_, i) => (
								<PaginationItem key={i}>
									<PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
										{i + 1}
									</PaginationLink>
								</PaginationItem>
							))}

							<PaginationItem>
								<PaginationNext onClick={() => setPage((p) => Math.min(totalPages, p + 1))} />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</CustomCard>
		</div>
	);
}
