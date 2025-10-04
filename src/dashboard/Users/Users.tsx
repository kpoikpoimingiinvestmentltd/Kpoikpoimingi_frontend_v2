import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FilterIcon, IconWrapper, PlusIcon, ThreeDotsIcon, SearchIcon } from "@/assets/icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PageTitles from "@/components/common/PageTitles";
import { inputStyle, preTableButtonStyle, tableHeaderRowStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import EmptyData from "@/components/common/EmptyData";
import { Link, useNavigate } from "react-router";
import { _router } from "../../routes/_router";

const users = [
	{
		name: "Kenny Banks James",
		phone: "+234812345678",
		role: "Admin",
		assigned: 0,
		salary: "500,000",
	},
	{
		name: "Kenny Banks James",
		phone: "+234812345678",
		role: "Admin",
		assigned: 0,
		salary: "500,000",
	},
	{
		name: "Kenny Banks James",
		phone: "+234812345678",
		role: "Sales Person",
		assigned: 8,
		salary: "500,000",
	},
	{
		name: "Kenny Banks James",
		phone: "+234812345678",
		role: "Sales Person",
		assigned: 0,
		salary: "500,000",
	},
];

export default function Users() {
	const [isEmpty] = React.useState(false);
	const [page, setPage] = React.useState(1);
	const navigate = useNavigate();
	const pages = Math.max(1, Math.ceil(users.length / 10));

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Employed Users" description="This are the list of all the employees / users working for Kpoi kpoi mingi investment" />
				<div className="flex items-center gap-3">
					<Link
						to={_router.dashboard.addUser}
						className="flex items-center gap-2 bg-primary rounded-sm px-8 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<PlusIcon />
						</IconWrapper>
						<span className="text-sm">Add User</span>
					</Link>
				</div>
			</div>

			<div className="min-h-96 flex">
				{!isEmpty ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<>
							<div className="w-full">
								<div className="flex items-center justify-between flex-wrap gap-6">
									<h2 className="font-semibold">All Users</h2>
									<div className="flex items-center gap-2">
										<div className="relative md:w-80">
											<CustomInput
												placeholder="Search by name or phone"
												aria-label="Search by name or phone"
												className={`max-w-[320px] ${inputStyle} h-10 pl-9`}
												iconLeft={<SearchIcon />}
											/>
										</div>
										<button type="button" className={`${preTableButtonStyle} text-white bg-primary ml-auto`}>
											<IconWrapper className="text-base">
												<FilterIcon />
											</IconWrapper>
											<span className="hidden sm:inline">Filter</span>
										</button>
									</div>
								</div>

								<div className="overflow-x-auto w-full mt-8">
									<Table>
										<TableHeader className={tableHeaderRowStyle}>
											<TableRow className="bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
												<TableHead>Name</TableHead>
												<TableHead>Phone Number</TableHead>
												<TableHead>User Role</TableHead>
												<TableHead>Assigned Customers</TableHead>
												<TableHead>Salary</TableHead>
												<TableHead>Action</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{users.map((row, idx) => (
												<TableRow key={idx} className="hover:bg-[#F6FBFF]">
													<TableCell className="text-[#13121266]">{row.name}</TableCell>
													<TableCell className="text-[#13121266]">{row.phone}</TableCell>
													<TableCell className="text-[#13121266]">{row.role}</TableCell>
													<TableCell className="text-[#13121266]">{row.assigned}</TableCell>
													<TableCell className="text-[#13121266]">{row.salary}</TableCell>
													<TableCell className="flex items-center gap-1">
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<button type="button" className="p-2 hover:bg-slate-50 rounded-full text-primary">
																	<IconWrapper className="text-lg">
																		<ThreeDotsIcon />
																	</IconWrapper>
																</button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end" sideOffset={6} className="w-48">
																{[
																	{ key: "view", label: "View Profile", danger: false, action: () => navigate(_router.dashboard.userDetails) },
																	{ key: "edit", label: "Edit Profile", danger: false },
																	{ key: "deactivate", label: "Deactivate", danger: false },
																	{ key: "reset", label: "Reset Password", danger: false },
																	{ key: "delete", label: "Delete", danger: true },
																].map((it) => (
																	<DropdownMenuItem
																		key={it.key}
																		onSelect={() => {
																			if (it.action) it.action();
																			// TODO: wire actions (navigate / open modal)
																		}}
																		className={`cursor-pointer ${it.danger ? "text-red-500" : ""}`}>
																		{it.label}
																	</DropdownMenuItem>
																))}
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</div>
						</>

						<div className="mt-8 flex flex-col md:flex-row text-center md:text-start justify-center items-center">
							<span className="text-sm text-nowrap">Total of (9)</span>
							<div className="ml-auto">
								<CompactPagination page={page} pages={pages} onPageChange={setPage} />
							</div>
						</div>
					</CustomCard>
				) : (
					<EmptyData text="No Users at the moment" />
				)}
			</div>
		</div>
	);
}
