import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditIcon, FilterIcon, IconWrapper, PlusIcon, SearchIcon, TrashIcon } from "@/assets/icons";
// import { EyeIcon } from "@/assets/icons";
import PageTitles from "@/components/common/PageTitles";
import { inputStyle, preTableButtonStyle } from "@/components/common/commonStyles";
import { Input } from "@/components/ui/input";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import EmptyData from "../../../components/common/EmptyData";
import { twMerge } from "tailwind-merge";
// Button import removed (not used)

// Sample categories data
const categories = [
	{
		id: "electronics",
		title: "Electronics",
		subs: "Mobile Phones & Tablets, Laptops & Computers, Televisions, Home Audio & Speakers, Cameras & Drones, Gaming Consoles, Accessories (Chargers, Headphones, Power Banks)",
		count: 15,
	},
	{
		id: "fashion",
		title: "Fashion",
		subs: "Men's Clothing, Women's Clothing, Kids' Clothing, Shoes, Bags & Accessories, Jewelry & Watches",
		count: 15,
	},
	{
		id: "home",
		title: "Home & Kitchen",
		subs: "Furniture, Kitchen Appliances, Cookware & Dining, Home Decor, Bedding, Cleaning & Storage",
		count: 15,
	},
	{
		id: "beauty",
		title: "Beauty & Personal Care",
		subs: "Skincare, Haircare, Makeup, Fragrances, Men's Grooming, Personal Hygiene",
		count: 15,
	},
	{
		id: "health",
		title: "Health & Wellness",
		subs: "Supplements, Medical Equipment, Fitness Equipment, Health Monitors, First Aid",
		count: 15,
	},
];
export default function ManageCategories() {
	const [isEmpty] = React.useState(false);

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="All Categories" description="" />
				<div className="flex items-center gap-3">
					<button type="button" className="flex items-center gap-2 bg-primary/10 rounded-sm px-4 py-2.5 active-scale transition text-primary">
						<span className="text-sm">Export</span>
					</button>
					<button type="button" className="flex items-center gap-2 bg-primary rounded-sm px-4 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<PlusIcon />
						</IconWrapper>
						<span className="text-sm">Add Category</span>
					</button>
				</div>
			</div>
			<div className="min-h-96 flex">
				{!isEmpty ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<div className="w-full">
							<div className="flex items-center justify-between flex-wrap gap-6">
								<h2 className="font-semibold">Product Categories</h2>
								<div className="flex items-center gap-2">
									<div className="relative md:w-80">
										<Input
											placeholder="Search categories"
											aria-label="Search categories"
											className={twMerge(inputStyle, `max-w-[320px] h-10 pl-9`)}
										/>
										<IconWrapper className="absolute top-1/2 -translate-y-1/2 opacity-50 left-5 -translate-x-1/2">
											<SearchIcon />
										</IconWrapper>
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
											<TableHead>Product Categories</TableHead>
											<TableHead>Sub Categories</TableHead>
											<TableHead>Number Of Products</TableHead>
											<TableHead>Action</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{categories.map((row) => (
											<TableRow key={row.id} className="hover:bg-[#F6FBFF]">
												<TableCell className="text-[#13121280] align-top">{row.title}</TableCell>
												<TableCell className="text-[#13121280] align-top">
													<div className="text-balance w-80">{row.subs}</div>
												</TableCell>
												<TableCell className="text-[#13121280] align-top">{row.count}</TableCell>
												<TableCell className="flex items-center gap-1">
													<button type="button" className="p-2 flex items-center text-slate-600">
														<IconWrapper className="text-xl">
															<EditIcon />
														</IconWrapper>
													</button>
													<button type="button" className="text-red-500 bg-transparent p-2 flex items-center">
														<IconWrapper>
															<TrashIcon />
														</IconWrapper>
													</button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</div>

						<div className="mt-8 flex flex-col md:flex-row text-center md:text-start justify-center items-center">
							<span className="text-sm text-nowrap">
								Showing <span className="font-medium">1-10</span> of <span className="font-medium">100</span> results
							</span>
							<div className="ml-4">
								<CompactPagination page={1} pages={5} onPageChange={() => {}} />
							</div>
						</div>
					</CustomCard>
				) : (
					<div className="flex-grow flex items-center justify-center">
						<EmptyData text="No Customers at the moment" />
					</div>
				)}
			</div>
		</div>
	);
}
