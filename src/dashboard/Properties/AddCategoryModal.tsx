import React from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { IconWrapper, PlusIcon, MinusIcon } from "@/assets/icons";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import CustomInput from "@/components/base/CustomInput";
import { twMerge } from "tailwind-merge";
import { inputStyle, modalContentStyle } from "@/components/common/commonStyles";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mode?: "add" | "edit";
	initial?: { category?: string; subCategories?: string[] };
	onSave?: (payload: { category?: string; subCategories: string[] }) => void;
};

export default function AddCategoryModal({ open, onOpenChange, mode = "add", initial, onSave }: Props) {
	const [category, setCategory] = React.useState(initial?.category ?? "");
	const [subCats, setSubCats] = React.useState<string[]>(initial?.subCategories ?? ["Mobile Phones & Tablets"]);

	React.useEffect(() => {
		if (open) {
			setCategory(initial?.category ?? "");
			setSubCats(initial?.subCategories ?? ["Mobile Phones & Tablets"]);
		}
	}, [open, initial]);

	const addSub = () => setSubCats((s) => [...s, ""]);
	const updateSub = (idx: number, val: string) => setSubCats((s) => s.map((v, i) => (i === idx ? val : v)));
	const removeSub = (idx: number) => setSubCats((s) => s.filter((_, i) => i !== idx));

	const handleSave = () => {
		onSave?.({ category, subCategories: subCats });
		onOpenChange(false);
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
						<button type="button" onClick={addSub} className="inline-flex items-center gap-2 bg-sky-500 text-white text-sm px-4 py-2 rounded-md">
							<IconWrapper>
								<PlusIcon />
							</IconWrapper>
							<span>Add Sub category</span>
						</button>
					</div>

					<div className="space-y-3">
						{subCats.map((s, i) => (
							<div key={i} className="flex items-stretch gap-3">
								<CustomInput className={inputStyle} containerClassName="flex-1" value={s} onChange={(e) => updateSub(i, e.target.value)} />
								<button type="button" onClick={() => removeSub(i)} className="bg-red-600 text-white px-3 py-2 rounded-md">
									<IconWrapper>
										<MinusIcon />
									</IconWrapper>
								</button>
							</div>
						))}
					</div>

					<div className="pt-6">
						<button type="button" onClick={handleSave} className="w-full bg-primary text-white py-3.5 rounded-md text-sm">
							{mode === "edit" ? "Save Changes" : "Add Category"}
						</button>
					</div>
				</div>

				<DialogFooter />
			</DialogContent>
		</Dialog>
	);
}
