import CustomCard from "@/components/base/CustomCard";
import PageTitles from "../../components/common/PageTitles";
import { IconWrapper, PlusIcon } from "@/assets/icons";
import React from "react";
import AddCategoryModal from "./AddCategoryModal";
import EmptyData from "../../components/common/EmptyData";
import PageWrapper from "../../components/common/PageWrapper";

export default function ManageCategories() {
	const [isEmpty] = React.useState(false);
	const [addOpen, setAddOpen] = React.useState(false);
	const [editOpen, setEditOpen] = React.useState(false);
	const [editing, setEditing] = React.useState<{ category?: string; subCategories?: string[] } | null>(null);

	const categories = [
		{ id: "c1", name: "Electronics", subs: ["Mobile Phones & Tablets", "Laptops & Computers"] },
		{ id: "c2", name: "Vehicles", subs: ["Cars", "Motorcycles"] },
		{ id: "c3", name: "Fashion", subs: ["Men", "Women"] },
	];

	return (
		<PageWrapper>
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Manage Category" description="Set, delete and edit categories" />
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => setAddOpen(true)}
						className="flex items-center gap-2 bg-primary rounded-sm px-4 py-2.5 active-scale transition text-white">
						<IconWrapper className="text-lg">
							<PlusIcon />
						</IconWrapper>
						<span className="text-sm">Add New Category</span>
					</button>
				</div>
			</div>
			<div className="min-h-96 flex">
				{!isEmpty ? (
					<CustomCard className="bg-white flex-grow w-full rounded-lg p-4 border border-gray-100">
						<div className="w-full">
							<div className="flex items-center justify-between flex-wrap gap-6">
								<h2 className="font-medium">Product Categories</h2>
								{/* <div className="flex items-center gap-2">
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
								</div> */}
							</div>
							<div className="w-full mt-8 rounded-md py-3 bg-gray-50">
								<ul className="space-y-4">
									{categories.map((cat) => (
										<li key={cat.id} className="flex items-center justify-between px-4 rounded-md">
											<p>{cat.name}</p>
											<div>
												<button
													type="button"
													onClick={() => {
														setEditing({ category: cat.name, subCategories: cat.subs });
														setEditOpen(true);
													}}
													className="text-primary">
													Edit
												</button>
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					</CustomCard>
				) : (
					<div className="flex-grow flex items-center justify-center">
						<EmptyData text="No Customers at the moment" />
					</div>
				)}
			</div>
			<AddCategoryModal open={addOpen} onOpenChange={setAddOpen} mode="add" onSave={() => {}} />
			<AddCategoryModal open={editOpen} onOpenChange={setEditOpen} mode="edit" initial={editing ?? undefined} onSave={() => {}} />
		</PageWrapper>
	);
}
