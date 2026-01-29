import React from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { IconWrapper, PlusIcon, MinusIcon } from "@/assets/icons";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import CustomInput from "@/components/base/CustomInput";
import { twMerge } from "tailwind-merge";
import { inputStyle, modalContentStyle } from "@/components/common/commonStyles";
import ActionButton from "@/components/base/ActionButton";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode?: "add" | "edit";
	initial?: { category?: string; subCategories?: string[] };
	onSave?: (payload: { category?: string; subCategories: string[] }) => void;
	savingStatus?: "idle" | "pending" | "success" | "error";
};

export default function AddCategoryModal({ open, onOpenChange, mode = "add", initial, onSave, savingStatus }: Props) {
	const [category, setCategory] = React.useState(initial?.category ?? "");

	// Available category labels (value uses the exact visible label)
	const CATEGORIES: string[] = [
		"Electronics",
		"Phones & Accessories",
		"Computers & Laptops",
		"Computer Accessories",
		"Tablets & iPads",
		"TVs & Audio",
		"Cameras & Photography",
		"Gaming & Consoles",
		"Home Appliances",
		"Kitchen Appliances", // Fashion & Lifestyle
		"Fashion",
		"Men's Fashion",
		"Women's Fashion",
		"Children's Fashion",
		"Shoes & Footwear",
		"Bags & Luggage",
		"Watches & Sunglasses",
		"Jewelry & Accessories",
		"Beauty & Personal Care",
		"Health & Wellness", // Home, Furniture & Outdoors
		"Home & Kitchen",
		"Furniture & Décor",
		"Bedding & Bath",
		"Lighting & Fans",
		"Garden & Outdoors",
		"Tools & Home Improvement",
		"Hardware & Construction", // Babies, Kids & Toys
		"Babies, Kids & Toys",
		"Baby Products",
		"Toys & Games",
		"School Supplies", // Vehicles & Automotive
		"Vehicles & Automobiles",
		"Motorcycles & Scooters",
		"Vehicle Parts & Accessories",
		"Car Electronics", // Sports, Fitness & Leisure
		"Sports & Fitness",
		"Gym & Exercise Equipment",
		"Outdoor & Adventure",
		"Musical Instruments",
		"Grocery & Supermarket",
		"Food & Beverages",
		"Drinks & Alcohol",
		"Fresh Produce",
		"Frozen & Dairy",
		"Properties",
		"Land & Plots",
		"Commercial Property",
		"Services",
		"Jobs & Recruitment",
		"Office Supplies & Stationery",
		"Industrial & Scientific",
		"Agriculture & Farming",
		"Manufacturing Equipment",
		"Books, Movies & Music",
		"Arts & Crafts",
		"Collectibles & Antiques",
		"Pet Supplies",
		"Mobile Phones & Tablets",
		"Solar & Power Solutions",
		"Generators & Power Backup",
		"Event Tickets & Experiences",
		"Gift Cards & Vouchers",
		"Religious & Spiritual Items",
		"Wedding & Events",
		"Travel & Tourism",
	];
	// store subcategories as objects with stable ids to avoid index-based key issues
	const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
	const [subCats, setSubCats] = React.useState<{ id: string; name: string }[]>(() => {
		// If initial provided (edit mode) use it; otherwise for add mode start with one empty entry
		const initialArr = initial?.subCategories;
		if (Array.isArray(initialArr) && initialArr.length > 0) {
			return initialArr.map((s) => ({ id: makeId(), name: s }));
		}
		// For add mode, default to a single empty subcategory input
		return [{ id: makeId(), name: "" }];
	});

	React.useEffect(() => {
		if (open) {
			setCategory(initial?.category ?? "");
			const initialArr = initial?.subCategories;
			if (Array.isArray(initialArr) && initialArr.length > 0) {
				setSubCats(initialArr.map((s) => ({ id: makeId(), name: s })));
			} else {
				// when opening in add mode or no initial subcategories, ensure there's one empty input
				setSubCats([{ id: makeId(), name: "" }]);
			}
		}
	}, [open]);

	const addSub = () => setSubCats((s) => [...s, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, name: "" }]);
	const updateSub = (id: string, val: string) => setSubCats((s) => s.map((v) => (v.id === id ? { ...v, name: val } : v)));
	const removeSub = (id: string) => setSubCats((s) => s.filter((v) => v.id !== id));

	const saving = (savingStatus ?? "idle") as "idle" | "pending" | "success" | "error";
	const isSaveDisabled = saving === "pending" || !String(category).trim();

	// search/filter state for the category select
	const [categoryFilter, setCategoryFilter] = React.useState("");
	const filteredCategories = React.useMemo(() => {
		const q = String(categoryFilter || "")
			.trim()
			.toLowerCase();
		if (!q) return CATEGORIES;
		return CATEGORIES.filter((c) => c.toLowerCase().includes(q));
	}, [categoryFilter]);

	const handleSave = () => {
		onSave?.({ category, subCategories: subCats.map((s) => s.name) });
	};

	// Prevent closing modal while saving
	const handleOpenChange = (newOpen: boolean) => {
		if (saving === "pending") return; // Don't allow closing while saving
		onOpenChange(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className={modalContentStyle()}>
				<div className="text-center py-4">
					<div className="text-lg font-medium">{mode === "edit" ? "Edit Category" : "Add Category"}</div>
				</div>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium mb-2">Category Type*</label>
						<Select value={category} onValueChange={(v) => setCategory(v)}>
							<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11")}>
								<SelectValue placeholder="Enter Category type" className="text-sm" />
							</SelectTrigger>
							<SelectContent>
								<div className="bg-white dark:bg-neutral-900 sticky top-0 z-1 mb-4 px-2">
									<CustomInput
										value={categoryFilter}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategoryFilter(e.target.value || "")}
										onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.stopPropagation()}
										placeholder="Search categories"
										className="w-full"
									/>
								</div>
								{filteredCategories.map((c) => (
									<SelectItem key={c} value={c}>
										{c}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<button
							type="button"
							onClick={addSub}
							className="inline-flex items-center gap-2 bg-sky-500 text-white text-sm px-4 py-2 rounded-md"
							disabled={saving === "pending"}>
							<IconWrapper>
								<PlusIcon />
							</IconWrapper>
							<span>{subCats.length >= 1 ? "Add more subcategories" : "Add Sub category"}</span>
						</button>
					</div>

					<div className="space-y-3">
						{subCats.map((s) => (
							<div key={s.id} className="flex items-stretch gap-3">
								<CustomInput
									className={inputStyle}
									containerClassName="flex-1"
									value={s.name}
									placeholder="Type in subcategory"
									onChange={(e) => updateSub(s.id, e.target.value)}
									disabled={saving === "pending"}
								/>
								<button
									type="button"
									onClick={() => removeSub(s.id)}
									className="bg-red-600 text-white px-3 py-2 rounded-md"
									disabled={saving === "pending"}>
									<IconWrapper>
										<MinusIcon />
									</IconWrapper>
								</button>
							</div>
						))}
					</div>

					<div className="pt-6">
						<ActionButton
							type="button"
							onClick={handleSave}
							isLoading={saving === "pending"}
							className={twMerge("w-full", isSaveDisabled ? "opacity-50 cursor-not-allowed" : "")}
							disabled={isSaveDisabled}>
							{saving === "pending" ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Category"}
						</ActionButton>
					</div>
				</div>

				<DialogFooter />
			</DialogContent>
		</Dialog>
	);
}
