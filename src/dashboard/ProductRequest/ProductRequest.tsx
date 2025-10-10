import React from "react";
import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CompactPagination from "@/components/ui/compact-pagination";
import { inputStyle, preTableButtonStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import { IconWrapper, FilePlusIcon, SearchIcon, EditIcon, TrashIcon, FilterIcon } from "@/assets/icons";
import { _router } from "@/routes/_router";
import { Link } from "react-router";

export default function ProductRequest() {
	const [page, setPage] = React.useState(1);
	const pages = 13;

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Property Request" description="This is all the product request from customers" />
				<div className="flex items-center gap-3">
					<Link
						to={_router.dashboard.productRequestDetails.replace(":id", "123")}
						className="flex items-center gap-2 bg-primary rounded-sm px-4 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<FilePlusIcon />
						</IconWrapper>
						<span className="text-sm">Create Request</span>
					</Link>
				</div>
			</div>

			<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
				<div className="flex items-center justify-between flex-wrap gap-6">
					<h2 className="font-semibold">All Request</h2>
					<div className="flex items-center gap-2">
						<div className="relative md:w-80">
							<CustomInput placeholder="Search here" className={`${inputStyle} h-10 pl-9`} iconLeft={<SearchIcon />} />
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
						<TableHeader className="[&_tr]:border-0">
							<TableRow className="bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
								<TableHead>Request From</TableHead>
								<TableHead>Property Type</TableHead>
								<TableHead>Payment Method</TableHead>
								<TableHead>Total amount</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{Array.from({ length: 10 }).map((_, idx) => (
								<TableRow key={idx} className="hover:bg-[#F6FBFF]">
									<TableCell>Tom Doe James</TableCell>
									<TableCell>12 inches HP laptop</TableCell>
									<TableCell>Full payment</TableCell>
									<TableCell>500,000</TableCell>
									<TableCell>
										<span className="bg-yellow-100 text-yellow-700 rounded-md px-3 py-1 text-sm">Unapproved</span>
									</TableCell>
									<TableCell>30-4-2025</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Link to={_router.dashboard.productRequestDetails.replace(":id", String(idx))} className="p-2 flex items-center">
												<IconWrapper className="text-xl">
													<EditIcon />
												</IconWrapper>
											</Link>
											<button type="button" className="text-red-500">
												<IconWrapper className="text-xl">
													<TrashIcon />
												</IconWrapper>
											</button>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				<div className="mt-8 flex flex-col md:flex-row text-center md:text-start justify-center items-center">
					<span className="text-sm text-nowrap">
						Showing <span className="font-medium">1-10</span> of <span className="font-medium">100</span> results
					</span>
					<div className="ml-auto">
						<CompactPagination page={page} pages={pages} onPageChange={setPage} />
					</div>
				</div>
			</CustomCard>
		</div>
	);
}
