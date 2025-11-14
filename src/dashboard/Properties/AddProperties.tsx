import PageTitles from "@/components/common/PageTitles";
import CustomInput from "@/components/base/CustomInput";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { inputStyle } from "@/components/common/commonStyles";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IconWrapper, CheckIcon } from "@/assets/icons";
import { twMerge } from "tailwind-merge";
import ImageGallery from "@/components/base/ImageGallery";
import { usePresignUploadMutation } from "@/api/presign-upload.api";
import { uploadFileToPresignedUrl } from "@/utils/media-upload";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useForm, Controller } from "react-hook-form";
import { useCreateProperty, type PropertyFormData } from "@/api/property";
import { useGetAllCategories } from "@/api/categories";
import { useNavigate } from "react-router";

export default function AddProperties() {
	const navigate = useNavigate();
	const {
		control,
		handleSubmit: handleHookFormSubmit,
		formState: { errors, isValid },
	} = useForm<PropertyFormData>({
		defaultValues: {
			name: "",
			categoryId: "",
			price: 0,
			quantityTotal: 1,
			vehicleMake: "",
			vehicleModel: "",
			vehicleYear: 0,
			vehicleType: "",
			vehicleColor: "",
			vehicleRegistrationNumber: "",
			vehicleChassisNumber: "",
			condition: "",
			description: "",
		},
		mode: "onChange",
	});

	const [presignUpload] = usePresignUploadMutation();
	const [successOpen, setSuccessOpen] = useState(false);
	const [uploadedImages, setUploadedImages] = useState<{ src: string }[]>([]);
	const [uploadedMediaKeys, setUploadedMediaKeys] = useState<string[]>([]);
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const [selectedParentCategoryId, setSelectedParentCategoryId] = useState<string>("");

	// Fetch categories
	const { data: categoriesData } = useGetAllCategories(1, 100, true);
	const categories = (categoriesData as any)?.data || [];

	// Get subcategories for selected parent category
	const selectedParentCategory = categories.find((cat: any) => cat.id === selectedParentCategoryId);
	const subcategories = selectedParentCategory?.children || [];

	// Check if selected parent category is a vehicle category
	const isVehicleCategory =
		selectedParentCategory && selectedParentCategory.category && selectedParentCategory.category.toLowerCase().includes("vehicle");

	const createPropertyMutation = useCreateProperty(
		() => {
			toast.success("Property created successfully!");
			setSuccessOpen(true);
		},
		(error: any) => {
			const errorMsg = error?.message || "Failed to create property";
			toast.error(errorMsg);
		}
	);

	// Upload a single property image and return mediaKey
	const handleSingleImageUpload = async (file: File): Promise<string | null> => {
		if (!file) return null;

		try {
			setIsUploadingImage(true);

			// Step 1: Get presigned URL
			const presignResult = await presignUpload({
				filename: file.name,
				contentType: file.type,
				relatedTable: "media",
			}).unwrap();

			const uploadUrl = (presignResult as any)?.url;
			if (!uploadUrl) {
				throw new Error("Presign upload did not return an uploadUrl");
			}

			// Step 2: Upload file to presigned URL
			const uploadResult = await uploadFileToPresignedUrl(uploadUrl, file);
			if (!uploadResult.success) {
				throw new Error(uploadResult.error ?? "Upload failed");
			}

			// Step 3: Get the media key
			const mediaKey = (presignResult as any)?.key ?? (presignResult as any)?.data?.key;
			if (mediaKey) {
				// Create object URL for preview
				const previewUrl = URL.createObjectURL(file);

				// Track uploaded media
				setUploadedImages((prev) => [...prev, { src: previewUrl }]);
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
		} finally {
			setIsUploadingImage(false);
		}
	};

	// Prevent mouse wheel changes on number inputs
	const handleNumberInputWheel = (e: React.WheelEvent<HTMLInputElement>) => {
		e.currentTarget.blur();
	};

	const onSubmit = async (formData: PropertyFormData) => {
		if (uploadedMediaKeys.length === 0) {
			toast.error("Please upload at least one property image");
			return;
		}

		if (!formData.description || formData.description.trim() === "") {
			toast.error("Please provide a product description");
			return;
		}

		// Convert mediaKeys array to object with image keys
		const mediaKeysObject = uploadedMediaKeys.reduce((acc, key, idx) => {
			acc[`image${idx + 1}`] = key;
			return acc;
		}, {} as Record<string, string>);

		// Build the complete property payload
		const propertyPayload = {
			name: formData.name,
			categoryId: formData.categoryId,
			price: Number(formData.price),
			quantityTotal: Number(formData.quantityTotal),
			condition: formData.condition,
			description: formData.description.trim(),
			mediaKeys: mediaKeysObject,
			...(isVehicleCategory && {
				vehicleMake: formData.vehicleMake,
				vehicleModel: formData.vehicleModel,
				vehicleYear: formData.vehicleYear ? Number(formData.vehicleYear) : undefined,
				vehicleColor: formData.vehicleColor,
				vehicleChassisNumber: formData.vehicleChassisNumber,
				vehicleType: formData.vehicleType,
				vehicleRegistrationNumber: formData.vehicleRegistrationNumber,
			}),
		};

		console.log("Property payload:", propertyPayload);
		await createPropertyMutation.mutateAsync(propertyPayload as any);
	};

	return (
		<div className="max-w-6xl flex flex-col gap-y-5">
			<PageTitles title="Add Property" description="Fill in the details to add property for sales" />
			<div className="bg-white max-w-5xl px-4 py-6 lg:py-12 rounded-lg">
				<div className="w-full lg:w-10/12 mx-auto">
					<ImageGallery
						mode="upload"
						placeholderText="Upload Property Image"
						uploadButtonText="Upload"
						className="min-h-28 mb-8"
						containerBorder="dashed"
						thumbBg="bg-primary/10"
						thumbVariant="dashed"
						isUploading={isUploadingImage}
						uploadedImages={uploadedImages.map((img, idx) => {
							return {
								src: img.src,
								onRemove: () => {
									const newImages = uploadedImages.filter((_, i) => i !== idx);
									const newKeys = uploadedMediaKeys.filter((_, i) => i !== idx);
									setUploadedImages(newImages);
									setUploadedMediaKeys(newKeys);
								},
							};
						})}
						onChange={async (files) => {
							if (files && files.length > 0) {
								await Promise.all(Array.from(files).map((file) => handleSingleImageUpload(file)));
							}
						}}
					/>

					<form className="space-y-5" onSubmit={handleHookFormSubmit(onSubmit)}>
						{/* Property Name */}
						<div>
							<Controller
								name="name"
								control={control}
								rules={{ required: "Property name is required" }}
								render={({ field }) => (
									<div>
										<CustomInput
											{...field}
											label="Property Name*"
											labelClassName="block text-sm font-medium text-gray-700 mb-2"
											type="text"
											className={twMerge(inputStyle)}
										/>
										{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
									</div>
								)}
							/>
						</div>

						{/* Category and Sub Category */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">Property Category*</label>
								<Select
									value={selectedParentCategoryId}
									onValueChange={(value) => {
										setSelectedParentCategoryId(value);
										// Reset subcategory selection when parent category changes
										const control_instance = (control as any)._formValues;
										control_instance.categoryId = "";
									}}>
									<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 capitalize text-sm")}>
										<SelectValue placeholder="Choose Category" />
									</SelectTrigger>
									<SelectContent>
										{categories.map((cat: any) => (
											<SelectItem key={cat.id} value={cat.id} className="capitalize">
												{cat.category || cat.title}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{/* Sub Category - Always show but disabled until parent category selected */}
							<div>
								<Controller
									name="categoryId"
									control={control}
									render={({ field }) => (
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Sub Category*</label>
											<Select value={field.value} onValueChange={field.onChange} disabled={!selectedParentCategoryId || subcategories.length === 0}>
												<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11 capitalize text-sm")}>
													<SelectValue
														placeholder={
															!selectedParentCategoryId
																? "Select category first"
																: subcategories.length === 0
																? "No subcategories available"
																: "Choose Sub Category"
														}
													/>
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
									)}
								/>
							</div>
						</div>

						{/* Price and Quantity */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Controller
									name="price"
									control={control}
									rules={{ required: "Price is required", min: { value: 0, message: "Price must be greater than 0" } }}
									render={({ field }) => (
										<div>
											<CustomInput
												{...field}
												label="Price*"
												labelClassName="block text-sm font-medium text-gray-700 mb-2"
												type="number"
												className={twMerge(inputStyle)}
												onWheel={handleNumberInputWheel}
											/>
											{errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
										</div>
									)}
								/>
							</div>
							<div>
								<Controller
									name="quantityTotal"
									control={control}
									rules={{ required: "Quantity is required", min: { value: 1, message: "Quantity must be at least 1" } }}
									render={({ field }) => (
										<div>
											<CustomInput
												{...field}
												label="Quantity*"
												labelClassName="block text-sm font-medium text-gray-700 mb-2"
												type="number"
												min="1"
												className={twMerge(inputStyle)}
												onWheel={handleNumberInputWheel}
												onChange={(e) => {
													const value = Math.max(1, Number(e.target.value) || 1);
													field.onChange(value);
												}}
											/>
											{errors.quantityTotal && <p className="text-red-500 text-sm mt-1">{errors.quantityTotal.message}</p>}
										</div>
									)}
								/>
							</div>
						</div>

						{/* Vehicle-specific fields */}
						{isVehicleCategory && (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Controller
											name="vehicleMake"
											control={control}
											rules={{ required: "Vehicle Make is required" }}
											render={({ field }) => (
												<div>
													<CustomInput
														{...field}
														label="Vehicle Make*"
														labelClassName="block text-sm font-medium text-gray-700 mb-2"
														className={twMerge(inputStyle)}
													/>
													{errors.vehicleMake && <p className="text-red-500 text-sm mt-1">{errors.vehicleMake.message}</p>}
												</div>
											)}
										/>
									</div>
									<div>
										<Controller
											name="vehicleModel"
											control={control}
											rules={{ required: "Vehicle Model is required" }}
											render={({ field }) => (
												<div>
													<CustomInput
														{...field}
														label="Vehicle Model*"
														labelClassName="block text-sm font-medium text-gray-700 mb-2"
														className={twMerge(inputStyle)}
													/>
													{errors.vehicleModel && <p className="text-red-500 text-sm mt-1">{errors.vehicleModel.message}</p>}
												</div>
											)}
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Controller
											name="vehicleYear"
											control={control}
											rules={{ required: "Vehicle Year is required" }}
											render={({ field }) => (
												<div>
													<CustomInput
														{...field}
														label="Vehicle Year*"
														labelClassName="block text-sm font-medium text-gray-700 mb-2"
														type="number"
														className={twMerge(inputStyle)}
													/>
													{errors.vehicleYear && <p className="text-red-500 text-sm mt-1">{errors.vehicleYear.message}</p>}
												</div>
											)}
										/>
									</div>
									<div>
										<Controller
											name="vehicleColor"
											control={control}
											rules={{ required: "Vehicle Color is required" }}
											render={({ field }) => (
												<div>
													<CustomInput
														{...field}
														label="Vehicle Color*"
														labelClassName="block text-sm font-medium text-gray-700 mb-2"
														className={twMerge(inputStyle)}
													/>
													{errors.vehicleColor && <p className="text-red-500 text-sm mt-1">{errors.vehicleColor.message}</p>}
												</div>
											)}
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Controller
											name="vehicleChassisNumber"
											control={control}
											rules={{ required: "Chassis Number is required" }}
											render={({ field }) => (
												<div>
													<CustomInput
														{...field}
														label="Chassis Number*"
														labelClassName="block text-sm font-medium text-gray-700 mb-2"
														className={twMerge(inputStyle)}
													/>
													{errors.vehicleChassisNumber && <p className="text-red-500 text-sm mt-1">{errors.vehicleChassisNumber.message}</p>}
												</div>
											)}
										/>
									</div>
									<div>
										<Controller
											name="vehicleType"
											control={control}
											rules={{ required: "Vehicle Type is required" }}
											render={({ field }) => (
												<div>
													<CustomInput
														{...field}
														label="Vehicle Type*"
														labelClassName="block text-sm font-medium text-gray-700 mb-2"
														className={twMerge(inputStyle)}
													/>
													{errors.vehicleType && <p className="text-red-500 text-sm mt-1">{errors.vehicleType.message}</p>}
												</div>
											)}
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Controller
											name="vehicleRegistrationNumber"
											control={control}
											rules={{ required: "Registration Number is required" }}
											render={({ field }) => (
												<div>
													<CustomInput
														{...field}
														label="Registration Number*"
														labelClassName="block text-sm font-medium text-gray-700 mb-2"
														className={twMerge(inputStyle)}
													/>
													{errors.vehicleRegistrationNumber && (
														<p className="text-red-500 text-sm mt-1">{errors.vehicleRegistrationNumber.message}</p>
													)}
												</div>
											)}
										/>
									</div>
								</div>
							</>
						)}

						{/* Description */}
						<div>
							<Controller
								name="description"
								control={control}
								rules={{ required: "Product description is required" }}
								render={({ field }) => (
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">Product Description*</label>
										<Textarea {...field} className={twMerge(inputStyle, "h-auto min-h-24")} rows={8} />
										{errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
									</div>
								)}
							/>
						</div>

						{/* Condition */}
						<div className="grid">
							<div>
								<Controller
									name="condition"
									control={control}
									rules={{ required: "Condition is required" }}
									render={({ field }) => (
										<div>
											<CustomInput
												{...field}
												label="Condition*"
												labelClassName="block text-sm font-medium text-gray-700 mb-2"
												type="text"
												className={twMerge(inputStyle)}
											/>
											{errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>}
										</div>
									)}
								/>
							</div>
						</div>

						<div className="flex justify-center mt-16">
							<Button
								type="submit"
								disabled={createPropertyMutation.isPending || !isValid || uploadedMediaKeys.length === 0}
								className="w-full md:w-1/2 rounded-md py-3 h-auto text-base active-scale disabled:opacity-60">
								{createPropertyMutation.isPending ? (
									<>
										<Spinner className="size-4 mr-2" />
										Adding Property...
									</>
								) : uploadedMediaKeys.length === 0 ? (
									"Please upload at least one image"
								) : !isValid ? (
									"Please fill in all required fields"
								) : (
									"Add Property"
								)}
							</Button>
						</div>
					</form>

					<Dialog open={successOpen} onOpenChange={setSuccessOpen}>
						<DialogContent className="max-w-xl">
							<div className="text-center pt-6">
								<div>
									<IconWrapper className="text-5xl text-green-600">
										<CheckIcon />
									</IconWrapper>
								</div>
								<div className="text-lg font-medium mt-4">Property Added</div>
								<div className="mt-2 text-sm text-muted-foreground">Property has been added successfully</div>
							</div>

							<footer className="flex items-center gap-6 justify-center py-4">
								<button
									onClick={() => {
										setSuccessOpen(false);
										navigate("/dashboard/properties");
									}}
									className="bg-primary w-full max-w-36 mx-auto text-white px-8 py-2.5 rounded-md">
									Ok
								</button>
							</footer>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</div>
	);
}
