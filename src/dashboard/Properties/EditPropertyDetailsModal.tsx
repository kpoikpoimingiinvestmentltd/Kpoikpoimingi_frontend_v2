import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CustomInput from "@/components/base/CustomInput";
import ActionButton from "@/components/base/ActionButton";
import ImageGallery from "@/components/base/ImageGallery";
import { media } from "@/resources/images";
import { modalContentStyle } from "../../components/common/commonStyles";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initial?: {
		id?: string;
		name?: string;
		price?: string;
		quantity?: string;
		status?: string;
		numberAssigned?: string;
		category?: string;
		addedOn?: string;
		// vehicle specific
		subCategory?: string;
		vehicleMake?: string;
		type?: string;
		colour?: string;
		registrationNumber?: string;
		chassisNumber?: string;
		condition?: string;
		description?: string;
		images?: string[];
	};
};

export default function EditPropertyDetailsModal({ open, onOpenChange, initial }: Props) {
	const imgs = initial?.images ?? [media.images._product1, media.images._product2];
	const [form, setForm] = React.useState({
		id: initial?.id ?? "",
		name: initial?.name ?? "",
		price: initial?.price ?? "",
		quantity: initial?.quantity ?? "",
		status: initial?.status ?? "",
		numberAssigned: initial?.numberAssigned ?? "",
		category: initial?.category ?? "",
		addedOn: initial?.addedOn ?? "",
		// vehicle specific
		subCategory: initial?.subCategory ?? "",
		vehicleMake: initial?.vehicleMake ?? "",
		type: initial?.type ?? "",
		colour: initial?.colour ?? "",
		registrationNumber: initial?.registrationNumber ?? "",
		chassisNumber: initial?.chassisNumber ?? "",
		condition: initial?.condition ?? "",
		description: initial?.description ?? "",
	});

	React.useEffect(() => {
		setForm({
			id: initial?.id ?? "",
			name: initial?.name ?? "",
			price: initial?.price ?? "",
			quantity: initial?.quantity ?? "",
			status: initial?.status ?? "",
			numberAssigned: initial?.numberAssigned ?? "",
			category: initial?.category ?? "",
			addedOn: initial?.addedOn ?? "",
			// vehicle specific
			subCategory: initial?.subCategory ?? "",
			vehicleMake: initial?.vehicleMake ?? "",
			type: initial?.type ?? "",
			colour: initial?.colour ?? "",
			registrationNumber: initial?.registrationNumber ?? "",
			chassisNumber: initial?.chassisNumber ?? "",
			condition: initial?.condition ?? "",
			description: initial?.description ?? "",
		});
	}, [initial, open]);

	const handleChange = (k: string) => (v: string) => setForm((s) => ({ ...s, [k]: v }));

	const handleSave = () => {
		// TODO: call API or emit event
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle("md:max-w-3xl")}>
				<DialogHeader className="justify-center flex-row my-4">
					<DialogTitle className="font-medium">Edit Property Details</DialogTitle>
				</DialogHeader>

				<div className="mx-auto w-full md:max-w-2xl">
					<div className="grid grid-cols-1 gap-6">
						<ImageGallery images={imgs} mode="upload" uploadButtonPosition="top-right" thumbVariant="dashed" thumbBg="bg-primary/10" />
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<CustomInput required label="Property ID" value={form.id} onChange={(e) => handleChange("id")(e.target.value)} />
							<CustomInput required label="Property Name" value={form.name} onChange={(e) => handleChange("name")(e.target.value)} />
							<CustomInput required label="Price" value={form.price} onChange={(e) => handleChange("price")(e.target.value)} />
							<CustomInput required label="Quantity" value={form.quantity} onChange={(e) => handleChange("quantity")(e.target.value)} />
							<CustomInput required label="Status" value={form.status} onChange={(e) => handleChange("status")(e.target.value)} />
							<CustomInput
								required
								label="Number Assigned"
								value={form.numberAssigned}
								onChange={(e) => handleChange("numberAssigned")(e.target.value)}
							/>
							<CustomInput required label="Category" value={form.category} onChange={(e) => handleChange("category")(e.target.value)} />
							<CustomInput required label="Added On" value={form.addedOn} onChange={(e) => handleChange("addedOn")(e.target.value)} />

							{/* vehicle specific fields - displayed only when category indicates a vehicle */}
							{form.category && form.category.toLowerCase().includes("veh") && (
								<>
									<CustomInput
										required
										label="Property Category"
										value={form.subCategory}
										onChange={(e) => handleChange("subCategory")(e.target.value)}
									/>
									<CustomInput required label="Sub Category" value={form.subCategory} onChange={(e) => handleChange("subCategory")(e.target.value)} />
									<CustomInput required label="Vehicle Make" value={form.vehicleMake} onChange={(e) => handleChange("vehicleMake")(e.target.value)} />
									<CustomInput required label="Type" value={form.type} onChange={(e) => handleChange("type")(e.target.value)} />
									<CustomInput required label="Colour" value={form.colour} onChange={(e) => handleChange("colour")(e.target.value)} />
									<CustomInput
										required
										label="Registration Number"
										value={form.registrationNumber}
										onChange={(e) => handleChange("registrationNumber")(e.target.value)}
									/>
									<CustomInput
										required
										label="Chassis Number"
										value={form.chassisNumber}
										onChange={(e) => handleChange("chassisNumber")(e.target.value)}
									/>
									<CustomInput required label="Condition" value={form.condition} onChange={(e) => handleChange("condition")(e.target.value)} />
									{/* long description textbox */}
									<textarea
										className="w-full border rounded-md p-2 col-span-2"
										value={form.description}
										onChange={(e) => handleChange("description")(e.target.value)}
									/>
								</>
							)}
						</div>

						<footer className="mt-2 w-full sm:w-11/12 sm:mx-auto">
							<ActionButton variant="primary" onClick={handleSave} className="w-full">
								Save Changes
							</ActionButton>
						</footer>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
