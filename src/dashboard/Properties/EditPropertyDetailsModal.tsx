import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import CustomInput from "@/components/base/CustomInput";
import ActionButton from "@/components/base/ActionButton";
import ImageGallery from "@/components/base/ImageGallery";
import { media } from "@/resources/images";
import { inputStyle, modalContentStyle } from "../../components/common/commonStyles";
import { useGetAllCategories } from "@/api/categories";
import { usePresignUploadMutation } from "@/api/presign-upload.api";
import { uploadFileToPresignedUrl } from "@/utils/media-upload";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import type { EditPropertyDetailsModalProps } from "@/types/property";

export default function EditPropertyDetailsModal({ open, onOpenChange, initial, onSave, isLoading }: EditPropertyDetailsModalProps) {
	const initialImgs = initial?.images ?? [media.images._product1, media.images._product2];
	const [currentImages, setCurrentImages] = React.useState<string[]>(Array.isArray(initialImgs) ? initialImgs : [initialImgs as string]);
	const [uploadedMediaKeys, setUploadedMediaKeys] = React.useState<string[]>([]);
	const [isUploadingImages, setIsUploadingImages] = React.useState(false);

	const uploadedImages = currentImages.map((src) => ({
		src,
		onRemove: () => setCurrentImages((prev) => prev.filter((img) => img !== src)),
	}));

	// Fetch categories
	const { data: categoriesData } = useGetAllCategories(1, 100, true);
	const allCategories = (categoriesData as any)?.data || [];

	// Image upload mutation
	const [presignUpload] = usePresignUploadMutation();

	// Handle image upload with presigned URL
	const handleSingleImageUpload = async (file: File): Promise<string | null> => {
		if (!file) return null;

		try {
			const presignResult = await presignUpload({
				filename: file.name,
				contentType: file.type,
				relatedTable: "media",
			}).unwrap();

			const uploadUrl = (presignResult as any)?.url;
			if (!uploadUrl) {
				throw new Error("Presign upload did not return an uploadUrl");
			}

			const uploadResult = await uploadFileToPresignedUrl(uploadUrl, file);
			if (!uploadResult.success) {
				throw new Error(uploadResult.error ?? "Upload failed");
			}

			const mediaKey = (presignResult as any)?.key ?? (presignResult as any)?.data?.key;
			if (mediaKey) {
				// Create object URL for preview
				const previewUrl = URL.createObjectURL(file);

				// Track uploaded media
				setCurrentImages((prev) => [...prev, previewUrl]);
				setUploadedMediaKeys((prev) => [...prev, mediaKey]);

				return mediaKey;
			}

			return null;
		} catch (err: any) {
			console.error("Image upload error:", err);
			let message = "Unknown error";
			if (err instanceof Error) message = err.message;
			else if (typeof err === "string") message = err;
			else if (err && typeof (err as any).message === "string") message = (err as any).message;
			else message = String(err);
			toast.error(`Upload failed: ${message}`);
			return null;
		}
	};

	const [form, setForm] = React.useState({
		id: initial?.id ?? "",
		name: initial?.name ?? "",
		price: initial?.price ?? "",
		quantity: initial?.quantity ?? "",
		status: initial?.status ?? "",
		numberAssigned: initial?.numberAssigned ?? "",
		category: initial?.category ?? "",
		categoryId: initial?.categoryId ?? "",
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

	// Get the parent category and its subcategories based on the current categoryId
	const selectedCategory = allCategories.find((cat: any) => {
		return cat.children?.some((child: any) => child.id === form.categoryId);
	});
	const subcategories = selectedCategory?.children || [];

	React.useEffect(() => {
		const initialImgsArray = initial?.images ?? [media.images._product1, media.images._product2];
		setCurrentImages(Array.isArray(initialImgsArray) ? initialImgsArray : [initialImgsArray as string]);
		setUploadedMediaKeys([]);
		setForm({
			id: initial?.id ?? "",
			name: initial?.name ?? "",
			price: initial?.price ?? "",
			quantity: initial?.quantity ?? "",
			status: initial?.status ?? "",
			numberAssigned: initial?.numberAssigned ?? "",
			category: initial?.category ?? "",
			categoryId: initial?.categoryId ?? "",
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

	const handleNumberInputWheel = (e: React.WheelEvent<HTMLInputElement>) => {
		e.currentTarget.blur();
	};

	const handleImageUpload = async (files: File[]) => {
		// Upload each file and collect media keys
		if (files && files.length > 0) {
			setIsUploadingImages(true);
			try {
				await Promise.all(Array.from(files).map((file) => handleSingleImageUpload(file)));
			} finally {
				setIsUploadingImages(false);
			}
		}
	};

	const handleSave = () => {
		// Call API through callback if provided
		if (onSave) {
			// Combine original images (non-blob URLs) with newly uploaded media keys
			const originalImages = currentImages.filter((img) => !img.startsWith("blob:"));
			const allMediaKeys = [...originalImages, ...uploadedMediaKeys];

			onSave({ ...form, images: currentImages, mediaKeys: allMediaKeys });
		} else {
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle("md:max-w-3xl")}>
				<DialogHeader className="justify-center flex-row my-4">
					<DialogTitle className="font-medium">Edit Property Details</DialogTitle>
				</DialogHeader>

				<div className="mx-auto w-full md:max-w-2xl">
					<div className="grid grid-cols-1 gap-6">
						<ImageGallery
							uploadedImages={uploadedImages}
							mode="upload"
							uploadButtonPosition="top-right"
							thumbVariant="dashed"
							thumbBg="bg-primary/10"
							onChange={handleImageUpload}
							isUploading={isUploadingImages}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<CustomInput required label="Property ID" value={form.id} onChange={(e) => handleChange("id")(e.target.value)} />
							<CustomInput required label="Property Name" value={form.name} onChange={(e) => handleChange("name")(e.target.value)} />
							<CustomInput
								required
								label="Price"
								value={form.price}
								onChange={(e) => handleChange("price")(e.target.value)}
								onWheel={handleNumberInputWheel}
							/>
							<CustomInput
								required
								label="Quantity"
								value={form.quantity}
								onChange={(e) => handleChange("quantity")(e.target.value)}
								onWheel={handleNumberInputWheel}
							/>
							<CustomInput required label="Status" value={form.status} onChange={(e) => handleChange("status")(e.target.value)} />
							<CustomInput
								required
								label="Number Assigned"
								value={form.numberAssigned}
								onChange={(e) => handleChange("numberAssigned")(e.target.value)}
							/>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
								<Select
									value={selectedCategory?.id || ""}
									onValueChange={(value) => {
										const selected = allCategories.find((c: any) => c.id === value);
										setForm((s) => ({ ...s, categoryId: "", category: selected?.category || "" }));
									}}>
									<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 capitalize text-sm")}>
										<SelectValue placeholder="Choose Category" />
									</SelectTrigger>
									<SelectContent>
										{allCategories.map((cat: any) => (
											<SelectItem key={cat.id} value={cat.id} className="capitalize">
												{cat.category || cat.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Sub Category</label>
								<Select
									value={form.categoryId}
									onValueChange={(value) => {
										const selectedSubcat = subcategories.find((c: any) => c.id === value);
										setForm((s) => ({ ...s, categoryId: value, category: selectedSubcat?.category || "" }));
									}}
									disabled={!selectedCategory}>
									<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 capitalize text-sm")}>
										<SelectValue placeholder={!selectedCategory ? "Select category first" : "Choose Sub Category"} />
									</SelectTrigger>
									<SelectContent>
										{subcategories.map((subcat: any) => (
											<SelectItem key={subcat.id} value={subcat.id} className="capitalize">
												{subcat.category || subcat.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<CustomInput required label="Added On" value={form.addedOn} onChange={(e) => handleChange("addedOn")(e.target.value)} disabled />

							{/* vehicle specific fields - displayed only when parent category is vehicles */}
							{selectedCategory && selectedCategory.category && selectedCategory.category.toLowerCase().includes("vehicle") && (
								<>
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
								</>
							)}

							{/* Price and Quantity */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Price*</label>
								<CustomInput
									required
									value={form.price}
									onChange={(e) => handleChange("price")(e.target.value)}
									onWheel={handleNumberInputWheel}
									className={twMerge(inputStyle)}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Quantity*</label>
								<CustomInput
									required
									value={form.quantity}
									onChange={(e) => handleChange("quantity")(e.target.value)}
									onWheel={handleNumberInputWheel}
									className={twMerge(inputStyle)}
								/>
							</div>
						</div>

						<footer className="mt-2 w-full sm:w-11/12 sm:mx-auto">
							<ActionButton variant="primary" onClick={handleSave} disabled={isLoading} className="w-full">
								{isLoading ? "Saving..." : "Save Changes"}
							</ActionButton>
						</footer>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
