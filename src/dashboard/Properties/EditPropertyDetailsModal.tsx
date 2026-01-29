import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CustomInput from "@/components/base/CustomInput";
import ActionButton from "@/components/base/ActionButton";
import ImageGallery from "@/components/base/ImageGallery";
import { Textarea } from "@/components/ui/textarea";
import { media } from "@/resources/images";
import { inputStyle, labelStyle, modalContentStyle, radioStyle } from "../../components/common/commonStyles";
import { useGetAllCategories } from "@/api/categories";
import { usePresignUploadMutation } from "@/api/presign-upload.api";
import { uploadFileToPresignedUrl } from "@/utils/media-upload";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import type { EditPropertyDetailsModalProps } from "@/types/property";
import type { PresignUploadResponse } from "@/types/media";

export default function EditPropertyDetailsModal({ open, onOpenChange, initial, onSave, isLoading }: EditPropertyDetailsModalProps) {
	const initialImgs = initial?.media ?? initial?.images ?? [media.images._product1, media.images._product2];
	const [currentImages, setCurrentImages] = React.useState<string[]>(Array.isArray(initialImgs) ? initialImgs : [initialImgs as string]);
	const [uploadedMediaKeys, setUploadedMediaKeys] = React.useState<string[]>([]);
	const [isUploadingImages, setIsUploadingImages] = React.useState(false);

	const uploadedImages = currentImages.map((src) => ({
		src,
		onRemove: () => setCurrentImages((prev) => prev.filter((img) => img !== src)),
	}));

	// Fetch categories
	const { data: categoriesData } = useGetAllCategories(1, 100, true);
	const allCategories = ((categoriesData as { data?: unknown[] })?.data || []) as Array<{
		id?: string;
		category?: string;
		title?: string;
		children?: Array<{ id?: string; category?: string; title?: string }>;
	}>;

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

			const uploadUrl = (presignResult as PresignUploadResponse).uploadUrl ?? (presignResult as PresignUploadResponse).url;
			if (!uploadUrl) {
				throw new Error("Presign upload did not return an uploadUrl");
			}

			const uploadResult = await uploadFileToPresignedUrl(uploadUrl, file);
			if (!uploadResult.success) {
				throw new Error(uploadResult.error ?? "Upload failed");
			}

			const mediaKey = (presignResult as PresignUploadResponse).key;
			if (mediaKey) {
				// Create object URL for preview
				const previewUrl = URL.createObjectURL(file); // Track uploaded media
				setCurrentImages((prev) => [...prev, previewUrl]);
				setUploadedMediaKeys((prev) => [...prev, mediaKey]);

				return mediaKey;
			}

			return null;
		} catch (err: unknown) {
			console.error("Image upload error:", err);
			let message = "Unknown error";
			if (err instanceof Error) message = err.message;
			else if (typeof err === "string") message = err;
			else if (err && typeof (err as Record<string, unknown>).message === "string") message = (err as Record<string, unknown>).message as string;
			else message = String(err);
			toast.error(`Upload failed: ${message}`);
			return null;
		}
	};

	const getStatusValue = () => {
		if (typeof initial?.status === "object" && initial.status?.status) return initial.status.status;
		if (typeof initial?.status === "string") return initial.status;
		return "";
	};

	const [form, setForm] = React.useState({
		id: initial?.id ?? "",
		propertyCode: initial?.propertyCode ?? "",
		name: initial?.name ?? "",
		price: initial?.price ?? "",
		quantityTotal: String(initial?.quantityTotal ?? ""),
		quantityAssigned: String(initial?.quantityAssigned ?? ""),
		status: getStatusValue(),
		categoryId: initial?.categoryId ?? "",
		parentCategoryId: "",
		condition: initial?.condition ?? "",
		description: initial?.description ?? "",
		isPublic: initial?.isPublic ?? true,
		vehicleMake: initial?.vehicleMake ?? "",
		vehicleModel: initial?.vehicleModel ?? "",
		vehicleYear: String(initial?.vehicleYear ?? ""),
		vehicleColor: initial?.vehicleColor ?? "",
		vehicleChassisNumber: initial?.vehicleChassisNumber ?? "",
		vehicleType: initial?.vehicleType ?? "",
		vehicleRegistrationNumber: initial?.vehicleRegistrationNumber ?? "",
	});

	const selectedParentCategory = allCategories.find((cat: unknown) => {
		const c = cat as { children?: unknown[] };
		return c.children?.some((child: unknown) => (child as { id: unknown }).id === form.categoryId);
	});
	const subcategories = (selectedParentCategory as { children?: unknown[] })?.children || [];

	const isVehicleCategory =
		selectedParentCategory &&
		(selectedParentCategory as { category?: string }).category &&
		(selectedParentCategory as { category?: string }).category!.toLowerCase().includes("vehicle");

	React.useEffect(() => {
		if (!open) return;

		const initialImgsArray = initial?.media ?? initial?.images ?? [media.images._product1, media.images._product2];
		setCurrentImages(Array.isArray(initialImgsArray) ? initialImgsArray : [initialImgsArray as string]);
		setUploadedMediaKeys([]);

		const statusVal = getStatusValue();

		// Find parent category ID based on categoryId
		const parentCat = allCategories.find((cat: unknown) => {
			const c = cat as { children?: unknown[] };
			return c.children?.some((child: unknown) => (child as { id: unknown }).id === initial?.categoryId);
		});

		setForm({
			id: initial?.id ?? "",
			propertyCode: initial?.propertyCode ?? "",
			name: initial?.name ?? "",
			price: initial?.price ?? "",
			quantityTotal: String(initial?.quantityTotal ?? ""),
			quantityAssigned: String(initial?.quantityAssigned ?? ""),
			status: statusVal,
			categoryId: initial?.categoryId ?? "",
			parentCategoryId: parentCat?.id ?? "",
			condition: initial?.condition ?? "",
			description: initial?.description ?? "",
			isPublic: initial?.isPublic ?? true,
			vehicleMake: initial?.vehicleMake ?? "",
			vehicleModel: initial?.vehicleModel ?? "",
			vehicleYear: String(initial?.vehicleYear ?? ""),
			vehicleColor: initial?.vehicleColor ?? "",
			vehicleChassisNumber: initial?.vehicleChassisNumber ?? "",
			vehicleType: initial?.vehicleType ?? "",
			vehicleRegistrationNumber: initial?.vehicleRegistrationNumber ?? "",
		});
	}, [open, allCategories]);

	const handleChange = (k: string) => (v: string | boolean) => {
		setForm((s) => ({ ...s, [k]: v }));
	};

	const handleNumberInputWheel = (e: React.WheelEvent<HTMLInputElement>) => {
		e.currentTarget.blur();
	};

	const handleImageUpload = async (files: File[]) => {
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
		if (onSave) {
			const originalImages = currentImages.filter((img) => !img.startsWith("blob:"));
			const allMediaKeys = [...originalImages, ...uploadedMediaKeys];

			const payload: Record<string, unknown> = {
				...form,
				images: currentImages,
				mediaKeys: allMediaKeys,
				price: Number(form.price),
				quantityTotal: Number(form.quantityTotal),
				quantityAssigned: Number(form.quantityAssigned),
			};

			if (isVehicleCategory) {
				payload.vehicleYear = form.vehicleYear ? Number(form.vehicleYear) : undefined;
			}

			onSave(payload);
		} else {
			onOpenChange(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={modalContentStyle("md:max-w-4xl max-h-[90vh] overflow-y-auto")}>
				<DialogHeader className="justify-center flex-row my-4">
					<DialogTitle className="font-medium">Edit Property Details</DialogTitle>
				</DialogHeader>

				<div className="mx-auto w-full md:max-w-3xl pb-4">
					<div className="grid grid-cols-1 gap-6">
						{/* Image Gallery */}
						<ImageGallery
							uploadedImages={uploadedImages}
							mode="upload"
							uploadButtonPosition="top-right"
							thumbVariant="dashed"
							thumbBg="bg-primary/10"
							onChange={handleImageUpload}
							isUploading={isUploadingImages}
						/>

						{/* Property Name */}
						<div>
							<CustomInput
								required
								label="Property Name"
								value={form.name}
								onChange={(e) => handleChange("name")(e.target.value)}
								className={twMerge(inputStyle)}
							/>
						</div>

						{/* Property Type - Public or Private */}
						<div>
							<label className={labelStyle()}>Property Type*</label>
							<RadioGroup
								value={form.isPublic ? "true" : "false"}
								onValueChange={(val) => handleChange("isPublic")(val === "true")}
								className="flex gap-8">
								<div className="flex items-center gap-3">
									<RadioGroupItem value="true" id="edit-public" className={radioStyle} />
									<label htmlFor="edit-public" className="text-sm cursor-pointer">
										Public property
									</label>
								</div>
								<div className="flex items-center gap-3">
									<RadioGroupItem value="false" id="edit-private" className={radioStyle} />
									<label htmlFor="edit-private" className="text-sm cursor-pointer">
										Private property
									</label>
								</div>
							</RadioGroup>
						</div>

						{/* Category and Sub Category */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className={labelStyle()}>Property Category*</label>
								<Select
									value={selectedParentCategory?.id || ""}
									onValueChange={(value) => {
										setForm((s) => ({
											...s,
											parentCategoryId: value,
											categoryId: "",
										}));
									}}>
									<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 capitalize text-sm")}>
										<SelectValue placeholder="Choose Category" />
									</SelectTrigger>
									<SelectContent>
										{allCategories.map((cat: unknown) => {
											const c = cat as { id: string; category?: string; title?: string };
											return (
												<SelectItem key={c.id} value={c.id} className="capitalize">
													{c.category || c.title}
												</SelectItem>
											);
										})}
									</SelectContent>
								</Select>
							</div>

							<div>
								<label className={labelStyle()}>Sub Category*</label>
								<Select
									value={form.categoryId}
									onValueChange={(value) => {
										setForm((s) => ({ ...s, categoryId: value }));
									}}
									disabled={!selectedParentCategory || subcategories.length === 0}>
									<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 capitalize text-sm")}>
										<SelectValue
											placeholder={
												!selectedParentCategory ? "Select category first" : subcategories.length === 0 ? "No subcategories" : "Choose Sub Category"
											}
										/>
									</SelectTrigger>
									<SelectContent>
										{subcategories.map((subcat: unknown) => {
											const s = subcat as { id: string; category?: string; title?: string };
											return (
												<SelectItem key={s.id} value={s.id} className="capitalize">
													{s.category || s.title}
												</SelectItem>
											);
										})}
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Price and Quantity */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<CustomInput
									required
									label="Price"
									type="number"
									value={form.price}
									onChange={(e) => handleChange("price")(e.target.value)}
									onWheel={handleNumberInputWheel}
									className={twMerge(inputStyle)}
								/>
							</div>
							<div>
								<CustomInput
									required
									label="Quantity"
									type="number"
									value={form.quantityTotal}
									onChange={(e) => handleChange("quantityTotal")(e.target.value)}
									onWheel={handleNumberInputWheel}
									className={twMerge(inputStyle)}
								/>
							</div>
						</div>

						{/* Status and Condition */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<CustomInput
									required
									label="Status"
									value={form.status}
									onChange={(e) => handleChange("status")(e.target.value)}
									className={twMerge(inputStyle)}
									disabled
								/>
							</div>
							<div>
								<CustomInput
									required
									label="Condition"
									value={form.condition}
									onChange={(e) => handleChange("condition")(e.target.value)}
									className={twMerge(inputStyle)}
								/>
							</div>
						</div>

						{/* Vehicle-specific fields */}
						{isVehicleCategory && (
							<>
								<div className="border-t pt-4 mt-4">
									<h3 className="font-medium text-sm text-gray-700 mb-4">Vehicle Details</h3>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<CustomInput
											required
											label="Vehicle Make"
											value={form.vehicleMake}
											onChange={(e) => handleChange("vehicleMake")(e.target.value)}
											className={twMerge(inputStyle)}
										/>
									</div>
									<div>
										<CustomInput
											required
											label="Vehicle Model"
											value={form.vehicleModel}
											onChange={(e) => handleChange("vehicleModel")(e.target.value)}
											className={twMerge(inputStyle)}
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<CustomInput
											required
											label="Vehicle Year"
											type="number"
											value={form.vehicleYear}
											onChange={(e) => handleChange("vehicleYear")(e.target.value)}
											onWheel={handleNumberInputWheel}
											className={twMerge(inputStyle)}
										/>
									</div>
									<div>
										<CustomInput
											required
											label="Vehicle Color"
											value={form.vehicleColor}
											onChange={(e) => handleChange("vehicleColor")(e.target.value)}
											className={twMerge(inputStyle)}
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<CustomInput
											required
											label="Chassis Number"
											value={form.vehicleChassisNumber}
											onChange={(e) => handleChange("vehicleChassisNumber")(e.target.value)}
											className={twMerge(inputStyle)}
										/>
									</div>
									<div>
										<CustomInput
											required
											label="Vehicle Type"
											value={form.vehicleType}
											onChange={(e) => handleChange("vehicleType")(e.target.value)}
											className={twMerge(inputStyle)}
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<CustomInput
											required
											label="Registration Number"
											value={form.vehicleRegistrationNumber}
											onChange={(e) => handleChange("vehicleRegistrationNumber")(e.target.value)}
											className={twMerge(inputStyle)}
										/>
									</div>
								</div>
							</>
						)}

						{/* Description */}
						<div>
							<label className={labelStyle()}>Description*</label>
							<Textarea
								value={form.description}
								onChange={(e) => handleChange("description")(e.target.value)}
								className={twMerge(inputStyle, "h-auto min-h-24")}
								rows={5}
							/>
						</div>

						{/* Action Button */}
						<footer className="mt-4 w-full">
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
