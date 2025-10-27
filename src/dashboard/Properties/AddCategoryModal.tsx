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
	// react-query mutation status: 'idle' | 'loading' | 'success' | 'error'
	savingStatus?: "idle" | "loading" | "success" | "error";
};

export default function AddCategoryModal({ open, onOpenChange, mode = "add", initial, onSave, savingStatus }: Props) {
	const [category, setCategory] = React.useState(initial?.category ?? "");
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
	}, [open, initial]);

	const addSub = () => setSubCats((s) => [...s, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`, name: "" }]);
	const updateSub = (id: string, val: string) => setSubCats((s) => s.map((v) => (v.id === id ? { ...v, name: val } : v)));
	const removeSub = (id: string) => setSubCats((s) => s.filter((v) => v.id !== id));

	const saving = (savingStatus ?? "idle") as "idle" | "loading" | "success" | "error";
	const isSaveDisabled = saving === "loading" || !String(category).trim();

	const handleSave = () => {
		onSave?.({ category, subCategories: subCats.map((s) => s.name) });
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle()}>
				<div className="text-center py-4">
					<div className="text-lg font-medium">{mode === "edit" ? "Edit Category" : "Add Category"}</div>
				</div>

				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Category Type*</label>
						<Select value={category} onValueChange={(v) => setCategory(v)}>
							<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11")}>
								<SelectValue placeholder="Enter Category type" className="text-sm" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="electronics">Electronics</SelectItem>
								<SelectItem value="vehicles">Vehicles & Automobiles</SelectItem>
								<SelectItem value="fashion">Fashion</SelectItem>
								<SelectItem value="home">Home & Kitchen</SelectItem>
								<SelectItem value="babies">Babies, Kids & Toys</SelectItem>
								<SelectItem value="phones">Phones & Accessories</SelectItem>
								<SelectItem value="computer">Computer & Accessories</SelectItem>
								<SelectItem value="sport">Sport & Fitness</SelectItem>
								<SelectItem value="books">Books & Stationaries</SelectItem>
								<SelectItem value="properties">Properties</SelectItem>
								<SelectItem value="tools">Tools & Hardware</SelectItem>
								<SelectItem value="services">Services</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<button
							type="button"
							onClick={addSub}
							className="inline-flex items-center gap-2 bg-sky-500 text-white text-sm px-4 py-2 rounded-md"
							disabled={saving === "loading"}>
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
									disabled={saving === "loading"}
								/>
								<button
									type="button"
									onClick={() => removeSub(s.id)}
									className="bg-red-600 text-white px-3 py-2 rounded-md"
									disabled={saving === "loading"}>
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
							isLoading={saving === "loading"}
							className={twMerge("w-full", isSaveDisabled ? "opacity-50 cursor-not-allowed" : "")}
							disabled={isSaveDisabled}>
							{saving === "loading" ? "Loading..." : mode === "edit" ? "Save Changes" : "Add Category"}
						</ActionButton>
					</div>
				</div>

				<DialogFooter />
			</DialogContent>
		</Dialog>
	);
}
