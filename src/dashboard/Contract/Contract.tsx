import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditIcon, FilePlusIcon, FilterIcon, IconWrapper, SearchIcon } from "@/assets/icons";
import { _router } from "@/routes/_router";
import Badge from "@/components/base/Badge";
import PageTitles from "@/components/common/PageTitles";
import CreateContractModal from "./CreateContractModal";
import { inputStyle, preTableButtonStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import { Link } from "react-router";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import EmptyData from "@/components/common/EmptyData";
import ActionButton from "../../components/base/ActionButton";
import ExportTrigger from "../../components/common/ExportTrigger";
import { useGetAllContracts } from "@/api/contracts";
import { TableSkeleton } from "@/components/common/Skeleton";

export default function Contract() {
	const [createOpen, setCreateOpen] = React.useState(false);
	const [page, setPage] = React.useState(1);
	const [search, setSearch] = React.useState("");

	const sortBy = "createdAt";
	const sortOrder = "desc";

	const { data = {}, isLoading } = useGetAllContracts(page, 10, search, sortBy, sortOrder);
	const dataTyped = data as Record<string, unknown>;
	const contracts = Array.isArray(dataTyped?.data) ? (dataTyped?.data as unknown[]) : [];
	const paginationData = dataTyped?.pagination as Record<string, unknown> | undefined;
	const pages = (paginationData?.totalPages as number) || 1;
	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Contract" description="The contracts transaction between Kpo kpoi mingi investment and it customers" />
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => setCreateOpen(true)}
						className="flex items-center gap-2 bg-primary rounded-sm px-4 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<FilePlusIcon />
						</IconWrapper>
						<span className="text-sm">Create Contract</span>
					</button>
				</div>
			</div>
			<div className="min-h-80 flex">
				{isLoading ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<TableSkeleton rows={10} cols={8} />
					</CustomCard>
				) : contracts.length === 0 ? (
					<div className="flex-grow flex items-center justify-center">
						<EmptyData text="No Contracts at the moment" />
					</div>
				) : (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<div className="w-full">
							<div className="flex items-center justify-between flex-wrap gap-6">
								<h2 className="font-semibold">All Contracts </h2>
								<div className="flex items-center gap-2">
									<div className="relative md:w-80">
										<CustomInput
											placeholder="Search by name, property or contract code"
											aria-label="Search by name, property or contract code"
											className={`max-w-[320px] ${inputStyle} h-10 pl-9`}
											iconLeft={<SearchIcon />}
											value={search}
											onChange={(e) => {
												setSearch(e.target.value);
												setPage(1);
											}}
										/>
									</div>
									<ActionButton type="button" className={`${preTableButtonStyle} text-white bg-primary ml-auto`}>
										<IconWrapper className="text-base">
											<FilterIcon />
										</IconWrapper>
										<span className="hidden sm:inline">Filter</span>
									</ActionButton>
								</div>
							</div>
							<div className="overflow-x-auto w-full mt-8">
								<Table>
									<TableHeader className="[&_tr]:border-0">
										<TableRow className="bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
											<TableHead>Customer ID</TableHead>
											<TableHead>Name</TableHead>
											<TableHead>Property Name</TableHead>
											<TableHead>Payment Type</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Outstanding Balance</TableHead>
											<TableHead>Date</TableHead>
											<TableHead>Action</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{contracts.map((contract: unknown, idx: number) => {
											const c = contract as Record<string, unknown>;
											return (
												<TableRow key={idx} className="hover:bg-[#F6FBFF]">
													<TableCell>{((c.customer as Record<string, unknown>)?.customerCode as string) || "N/A"}</TableCell>
													<TableCell>{((c.customer as Record<string, unknown>)?.fullName as string) || "N/A"}</TableCell>
													<TableCell>{((c.property as Record<string, unknown>)?.name as string) || "N/A"}</TableCell>
													<TableCell>{((c.paymentType as Record<string, unknown>)?.type as string) || "N/A"}</TableCell>
													<TableCell>
														<Badge value={((c.status as Record<string, unknown>)?.status as string) || "N/A"} size="sm" />
													</TableCell>
													<TableCell>₦{parseInt((c.outStandingBalance as string) || "0").toLocaleString()}</TableCell>
													<TableCell>{new Date(c.createdAt as string).toLocaleDateString()}</TableCell>
													<TableCell>
														<div className="flex items-center">
															<Link to={_router.dashboard.contractDetails.replace(":id", c.id as string)} className=" p-2 flex items-center">
																<IconWrapper>
																	<EditIcon />
																</IconWrapper>
															</Link>
															<ExportTrigger className="text-primary" />
														</div>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						</div>

						<div className="mt-8 flex flex-col md:flex-row text-center md:text-start justify-center items-center">
							<span className="text-sm text-nowrap">
								Showing <span className="font-medium">{(page - 1) * 10 + 1}</span>-
								<span className="font-medium">{Math.min(page * 10, (paginationData?.total as number) || 0)}</span> of{" "}
								<span className="font-medium">{(paginationData?.total as number) || 0}</span> results
							</span>
							<div className="ml-auto">
								<CompactPagination page={page} pages={pages} onPageChange={setPage} />
							</div>
						</div>
					</CustomCard>
				)}
				<CreateContractModal open={createOpen} onOpenChange={setCreateOpen} />
			</div>
		</div>
	);
}
