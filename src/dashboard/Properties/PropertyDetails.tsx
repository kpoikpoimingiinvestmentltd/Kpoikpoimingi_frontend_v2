import CustomCard from "@/components/base/CustomCard";
import ImageGallery from "@/components/base/ImageGallery";
import { media } from "@/resources/images";
import KeyValueRow from "@/components/common/KeyValueRow";
import PageWrapper from "../../components/common/PageWrapper";
import ActionButton from "../../components/base/ActionButton";
import { EditIcon, IconWrapper } from "../../assets/icons";
import EditPropertyDetailsModal from "./EditPropertyDetailsModal";
import React from "react";
import PageTitles from "../../components/common/PageTitles";
import { useParams } from "react-router";
import { useGetPropertyById, useUpdateProperty } from "@/api/property";
import { _router } from "../../routes/_router";
import { RectangleSkeleton } from "@/components/common/Skeleton";
import type { PropertyData } from "@/types/property";
import { toast } from "sonner";

export default function PropertyDetails() {
	const { id } = useParams<{ id: string }>();
	const { data: propertyResponse, isLoading, refetch } = useGetPropertyById(id);
	const property = propertyResponse as any as PropertyData | undefined;

	const [editOpen, setEditOpen] = React.useState(false);

	const updateProperty = useUpdateProperty(
		() => {
			refetch();
			setEditOpen(false);
			toast.success("Property updated successfully");
		},
		(error: any) => {
			toast.error(error?.message || "Failed to update property");
			console.error("Update failed:", error);
		}
	);

	if (isLoading) {
		return (
			<PageWrapper>
				<header>
					<PageTitles title="Properties" description="All properties listed for sell" />
				</header>

				<CustomCard className="p-4 md:px-6">
					<section aria-label="property media" className="mb-6">
						<div className="flex justify-end mb-4">
							<RectangleSkeleton className="w-20 h-8" />
						</div>
						<RectangleSkeleton className="w-full h-64 rounded-lg" />
					</section>

					<section aria-label="property details" className="mt-4 gap-6 space-y-4">
						{Array.from({ length: 8 }).map((_, i) => (
							<div key={i} className="flex justify-between">
								<RectangleSkeleton className="w-1/4 h-4" />
								<RectangleSkeleton className="w-1/2 h-4" />
							</div>
						))}
					</section>
				</CustomCard>
			</PageWrapper>
		);
	}

	if (!property) {
		return (
			<PageWrapper>
				<div className="flex items-center justify-center min-h-96">
					<p className="text-muted-foreground">Property not found</p>
				</div>
			</PageWrapper>
		);
	}

	const images = property.media?.length > 0 ? property.media : [media.images._product1];
	const formattedDate = property.dateAdded
		? new Date(property.dateAdded).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
		  })
		: "N/A";

	// Check if this is a vehicle property
	const isVehicle = property.category?.parent?.category?.toLowerCase().includes("vehicle") || false;

	return (
		<PageWrapper>
			<header>
				<PageTitles title="Properties" description="All properties listed for sell" />
				<div className="flex items-center gap-3"></div>
			</header>

			<CustomCard className="p-4 md:px-6">
				<section aria-label="property media" className="mb-6">
					<div className="flex justify-end mb-4">
						<ActionButton
							variant="ghost"
							className="text-black underline underline-offset-4 px-0"
							aria-label="Edit property"
							leftIcon={
								<IconWrapper>
									<EditIcon />
								</IconWrapper>
							}
							onClick={() => setEditOpen(true)}>
							Edit
						</ActionButton>

						<EditPropertyDetailsModal
							open={editOpen}
							onOpenChange={setEditOpen}
							initial={{
								id: property.id,
								propertyCode: property.propertyCode,
								name: property.name,
								price: property.price,
								quantityTotal: property.quantityTotal,
								quantityAssigned: property.quantityAssigned,
								status: property.status,
								categoryId: property.category.id,
								condition: (property as any).condition || "Good",
								description: property.description || "",
								dateAdded: property.dateAdded,
								media: images,
								// Vehicle fields
								vehicleMake: (property as any).vehicleMake || "",
								vehicleModel: (property as any).vehicleModel || "",
								vehicleYear: (property as any).vehicleYear || 0,
								vehicleColor: (property as any).vehicleColor || "",
								vehicleChassisNumber: (property as any).vehicleChassisNumber || "",
								vehicleType: (property as any).vehicleType || "",
								vehicleRegistrationNumber: (property as any).vehicleRegistrationNumber || "",
								category: property.category,
							}}
							onSave={(formData: any) => {
								if (property?.id) {
									const mediaKeysArray = formData.mediaKeys || [];
									const mediaKeysObject = mediaKeysArray.reduce((acc: any, key: string, idx: number) => {
										acc[`media_${idx}`] = key;
										return acc;
									}, {});

									const payload: any = {
										name: formData.name,
										categoryId: formData.categoryId,
										price: Number(formData.price),
										quantityTotal: Number(formData.quantityTotal),
										condition: formData.condition || "Good",
										description: formData.description || "",
										mediaKeys: mediaKeysObject || {},
									};

									// Add vehicle fields if this is a vehicle
									if (isVehicle) {
										payload.vehicleMake = formData.vehicleMake;
										payload.vehicleModel = formData.vehicleModel;
										payload.vehicleYear = formData.vehicleYear ? Number(formData.vehicleYear) : undefined;
										payload.vehicleColor = formData.vehicleColor;
										payload.vehicleChassisNumber = formData.vehicleChassisNumber;
										payload.vehicleType = formData.vehicleType;
										payload.vehicleRegistrationNumber = formData.vehicleRegistrationNumber;
									}

									updateProperty.mutate({
										id: property.id,
										payload,
									});
								}
							}}
							isLoading={updateProperty.isPending}
						/>
					</div>

					<ImageGallery
						mode="view"
						thumbVariant="solid"
						thumbBg="bg-primary/10"
						uploadedImages={images.map((img) => ({
							src: img,
						}))}
					/>
				</section>

				<section aria-label="property details" className="mt-4 gap-6">
					<KeyValueRow leftClassName="text-black" label="Property ID" value={property.propertyCode} />
					<KeyValueRow leftClassName="text-black" label="Property Name" value={property.name} />
					<KeyValueRow leftClassName="text-black" label="Amount" value={`₦${property.price}`} />
					<KeyValueRow leftClassName="text-black" label="Quantity" value={property.quantityTotal.toString()} />
					<KeyValueRow leftClassName="text-black" label="Status" value={property.status.status} />
					<KeyValueRow leftClassName="text-black" label="Number Assigned" value={property.quantityAssigned.toString()} />
					<KeyValueRow leftClassName="text-black" label="Category" value={property.category.category} />
					<KeyValueRow leftClassName="text-black" label="Condition" value={(property as any).condition || "N/A"} />
					<KeyValueRow leftClassName="text-black" label="Added On" value={formattedDate} />

					{(property as any).description && <KeyValueRow leftClassName="text-black" label="Description" value={(property as any).description} />}

					{/* Vehicle Details Section */}
					{isVehicle && (
						<>
							<div className="border-t my-6 pt-6">
								<h3 className="font-semibold text-base mb-4">Vehicle Details</h3>
								<div className="space-y-4">
									{(property as any).vehicleMake && (
										<KeyValueRow leftClassName="text-black" label="Vehicle Make" value={(property as any).vehicleMake} />
									)}
									{(property as any).vehicleModel && (
										<KeyValueRow leftClassName="text-black" label="Vehicle Model" value={(property as any).vehicleModel} />
									)}
									{(property as any).vehicleYear && (
										<KeyValueRow leftClassName="text-black" label="Vehicle Year" value={(property as any).vehicleYear.toString()} />
									)}
									{(property as any).vehicleColor && (
										<KeyValueRow leftClassName="text-black" label="Vehicle Color" value={(property as any).vehicleColor} />
									)}
									{(property as any).vehicleType && (
										<KeyValueRow leftClassName="text-black" label="Vehicle Type" value={(property as any).vehicleType} />
									)}
									{(property as any).vehicleChassisNumber && (
										<KeyValueRow leftClassName="text-black" label="Chassis Number" value={(property as any).vehicleChassisNumber} />
									)}
									{(property as any).vehicleRegistrationNumber && (
										<KeyValueRow leftClassName="text-black" label="Registration Number" value={(property as any).vehicleRegistrationNumber} />
									)}
								</div>
							</div>
						</>
					)}
				</section>
			</CustomCard>
		</PageWrapper>
	);
}
