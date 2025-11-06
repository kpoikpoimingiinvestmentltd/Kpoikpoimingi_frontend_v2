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
import { useNavigate } from "react-router";

export default function AddProperties() {
	const navigate = useNavigate();
	const {
		control,
		handleSubmit: handleHookFormSubmit,
		watch,
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
	});

	const [presignUpload] = usePresignUploadMutation();
	const [successOpen, setSuccessOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [uploadedImages, setUploadedImages] = useState<File[]>([]);
	const categoryValue = watch("categoryId");

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

	// Upload property images and return mediaKeys
	const uploadPropertyImages = async (files: File[]): Promise<string[]> => {
		const uploadPromises = files.map(async (file) => {
			try {
				const res = await presignUpload({
					filename: file.name,
					contentType: file.type,
					relatedTable: "property",
				}).unwrap();

				const uploadUrl = (res as any)?.url;
				if (!uploadUrl) {
					throw new Error("Presign upload did not return an uploadUrl");
				}

				const uploadResult = await uploadFileToPresignedUrl(uploadUrl, file);
				if (!uploadResult.success) {
					throw new Error(uploadResult.error ?? "Upload failed");
				}

				// Return the key from presign response
				const mediaKey = (res as any)?.key ?? (res as any)?.data?.key;
				if (!mediaKey) {
					throw new Error("No media key returned");
				}

				return mediaKey;
			} catch (error) {
				console.error("Image upload error:", error);
				throw error;
			}
		});

		return Promise.all(uploadPromises);
	};

	const onSubmit = async (formData: PropertyFormData) => {
		if (uploadedImages.length === 0) {
			toast.error("Please upload at least one property image");
			return;
		}

		try {
			setIsLoading(true);

			// Upload images and get mediaKeys
			const mediaKeys = await uploadPropertyImages(uploadedImages);

			// Build the complete property payload
			const propertyPayload = {
				name: formData.name,
				categoryId: formData.categoryId,
				price: Number(formData.price),
				quantityTotal: Number(formData.quantityTotal),
				condition: formData.condition,
				mediaKeys,
				...(categoryValue.toLowerCase().includes("veh") && {
					vehicleMake: formData.vehicleMake,
					vehicleModel: formData.vehicleModel,
					vehicleYear: formData.vehicleYear ? Number(formData.vehicleYear) : undefined,
					vehicleColor: formData.vehicleColor,
					vehicleChassisNumber: formData.vehicleChassisNumber,
					vehicleType: formData.vehicleType,
					vehicleRegistrationNumber: formData.vehicleRegistrationNumber,
				}),
				...(formData.propertyRequestId && { propertyRequestId: formData.propertyRequestId }),
			};

			console.log("Property payload:", propertyPayload);
			await createPropertyMutation.mutateAsync(propertyPayload);
		} catch (error: any) {
			console.error("Property creation error:", error);
		} finally {
			setIsLoading(false);
		}
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
						onChange={(files) => setUploadedImages(files)}
					/>

					<form className="space-y-5" onSubmit={handleHookFormSubmit(onSubmit)}>
						{/* Property Name */}
						<div>
							<Controller
								name="name"
								control={control}
								rules={{ required: "Property name is required" }}
								render={({ field }) => (
									<CustomInput
										{...field}
										label="Property Name*"
										labelClassName="block text-sm font-medium text-gray-700 mb-2"
										type="text"
										className={twMerge(inputStyle)}
									/>
								)}
							/>
						</div>

						{/* Category and Condition */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Controller
									name="categoryId"
									control={control}
									rules={{ required: "Category is required" }}
									render={({ field }) => (
										<>
											<label className="block text-sm font-medium text-gray-700 mb-2">Property Category*</label>
											<Select value={field.value} onValueChange={field.onChange}>
												<SelectTrigger className={twMerge(inputStyle, "w-full min-h-11")}>
													<SelectValue placeholder="Choose Category" />
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
										</>
									)}
								/>
							</div>

							<div>
								<Controller
									name="condition"
									control={control}
									rules={{ required: "Condition is required" }}
									render={({ field }) => (
										<CustomInput
											{...field}
											label="Condition*"
											labelClassName="block text-sm font-medium text-gray-700 mb-2"
											type="text"
											className={twMerge(inputStyle)}
										/>
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
									rules={{ required: "Price is required", min: 0 }}
									render={({ field }) => (
										<CustomInput
											{...field}
											label="Price*"
											labelClassName="block text-sm font-medium text-gray-700 mb-2"
											type="number"
											className={twMerge(inputStyle)}
										/>
									)}
								/>
							</div>
							<div>
								<Controller
									name="quantityTotal"
									control={control}
									rules={{ required: "Quantity is required", min: 1 }}
									render={({ field }) => (
										<CustomInput
											{...field}
											label="Quantity*"
											labelClassName="block text-sm font-medium text-gray-700 mb-2"
											type="number"
											className={twMerge(inputStyle)}
										/>
									)}
								/>
							</div>
						</div>

						{/* Vehicle-specific fields */}
						{categoryValue && categoryValue.toLowerCase().includes("veh") && (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Controller
											name="vehicleMake"
											control={control}
											render={({ field }) => (
												<CustomInput
													{...field}
													label="Vehicle Make*"
													labelClassName="block text-sm font-medium text-gray-700 mb-2"
													className={twMerge(inputStyle)}
												/>
											)}
										/>
									</div>
									<div>
										<Controller
											name="vehicleModel"
											control={control}
											render={({ field }) => (
												<CustomInput
													{...field}
													label="Vehicle Model*"
													labelClassName="block text-sm font-medium text-gray-700 mb-2"
													className={twMerge(inputStyle)}
												/>
											)}
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Controller
											name="vehicleYear"
											control={control}
											render={({ field }) => (
												<CustomInput
													{...field}
													label="Vehicle Year*"
													labelClassName="block text-sm font-medium text-gray-700 mb-2"
													type="number"
													className={twMerge(inputStyle)}
												/>
											)}
										/>
									</div>
									<div>
										<Controller
											name="vehicleColor"
											control={control}
											render={({ field }) => (
												<CustomInput
													{...field}
													label="Vehicle Color*"
													labelClassName="block text-sm font-medium text-gray-700 mb-2"
													className={twMerge(inputStyle)}
												/>
											)}
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Controller
											name="vehicleChassisNumber"
											control={control}
											render={({ field }) => (
												<CustomInput
													{...field}
													label="Chassis Number*"
													labelClassName="block text-sm font-medium text-gray-700 mb-2"
													className={twMerge(inputStyle)}
												/>
											)}
										/>
									</div>
									<div>
										<Controller
											name="vehicleType"
											control={control}
											render={({ field }) => (
												<CustomInput
													{...field}
													label="Vehicle Type*"
													labelClassName="block text-sm font-medium text-gray-700 mb-2"
													className={twMerge(inputStyle)}
												/>
											)}
										/>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<Controller
											name="vehicleRegistrationNumber"
											control={control}
											render={({ field }) => (
												<CustomInput
													{...field}
													label="Registration Number*"
													labelClassName="block text-sm font-medium text-gray-700 mb-2"
													className={twMerge(inputStyle)}
												/>
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
								render={({ field }) => (
									<>
										<label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
										<Textarea {...field} className={twMerge(inputStyle, "h-auto min-h-24")} rows={8} />
									</>
								)}
							/>
						</div>

						{/* Optional Property Request ID */}
						<div>
							<Controller
								name="propertyRequestId"
								control={control}
								render={({ field }) => (
									<CustomInput
										{...field}
										label="Property Request ID (Optional)"
										labelClassName="block text-sm font-medium text-gray-700 mb-2"
										type="text"
										className={twMerge(inputStyle)}
									/>
								)}
							/>
						</div>

						<div className="flex justify-center mt-16">
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full md:w-1/2 rounded-md py-3 h-auto text-base active-scale disabled:opacity-60">
								{isLoading ? (
									<>
										<Spinner className="size-4 mr-2" />
										Adding Property...
									</>
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
