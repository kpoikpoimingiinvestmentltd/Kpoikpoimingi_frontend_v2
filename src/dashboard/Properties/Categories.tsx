import CustomCard from "@/components/base/CustomCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditIcon, FilterIcon, IconWrapper, PlusIcon, SearchIcon, TrashIcon } from "@/assets/icons";
import PageTitles from "@/components/common/PageTitles";
import { inputStyle, preTableButtonStyle } from "@/components/common/commonStyles";
import CustomInput from "@/components/base/CustomInput";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import AddCategoryModal from "./AddCategoryModal";
import EmptyData from "../../components/common/EmptyData";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router";
import { _router } from "../../routes/_router";

// (moved into component state)

export default function Categories() {
	const [isEmpty] = React.useState(false);
	const [categories, setCategories] = React.useState(() => [
		{
			id: "electronics",
			title: "Electronics",
			subs: ["Mobile Phones & Tablets", "Laptops & Computers", "Televisions"],
			count: 15,
		},
		{
			id: "fashion",
			title: "Fashion",
			subs: ["Men's Clothing", "Women's Clothing", "Kids' Clothing"],
			count: 15,
		},
		{
			id: "home",
			title: "Home & Kitchen",
			subs: ["Furniture", "Kitchen Appliances"],
			count: 15,
		},
	]);
	const [editOpen, setEditOpen] = React.useState(false);
	const [editing, setEditing] = React.useState<{ id?: string; title?: string; subs?: string[] } | null>(null);

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="All Categories" description="Manage your product categories" />
				<div className="flex items-center gap-3">
					<button type="button" className="flex items-center gap-2 bg-primary/10 rounded-sm px-4 py-2.5 active-scale transition text-primary">
						<span className="text-sm">Export</span>
					</button>
					<Link
						to={_router.dashboard.manageCategories}
						className="flex items-center gap-2 bg-primary rounded-sm px-4 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<PlusIcon />
						</IconWrapper>
						<span className="text-sm">Add Category</span>
					</Link>
				</div>
			</div>
			<div className="min-h-96 flex">
				{!isEmpty ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<div className="w-full">
							<div className="flex items-center justify-between flex-wrap gap-6">
								<h2 className="font-medium">Product Categories</h2>
								<div className="flex items-center gap-2">
									<div className="relative md:w-80">
										<CustomInput
											placeholder="Search categories"
											aria-label="Search categories"
											className={twMerge(inputStyle, `max-w-[320px] h-10 pl-9`)}
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
													<div className="text-balance w-80">{row.subs.join(", ")}</div>
												</TableCell>
												<TableCell className="text-[#13121280] align-top">{row.count}</TableCell>
												<TableCell className="flex items-center gap-1">
													<button
														type="button"
														className="p-2 flex items-center text-slate-600"
														onClick={() => {
															setEditing({ id: row.id, title: row.title, subs: row.subs });
															setEditOpen(true);
														}}>
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

							<AddCategoryModal
								open={editOpen}
								onOpenChange={(open) => {
									setEditOpen(open);
									if (!open) setEditing(null);
								}}
								mode="edit"
								initial={editing ? { category: editing.title, subCategories: editing.subs } : undefined}
								onSave={(payload) => {
									if (!editing) return;
									setCategories((prev) =>
										prev.map((c) => (c.id === editing.id ? { ...c, title: payload.category ?? c.title, subs: payload.subCategories } : c))
									);
								}}
							/>
						</div>

						<div className="mt-8">
							<CompactPagination showRange page={1} pages={5} onPageChange={() => {}} />
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
