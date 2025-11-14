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
								name: property.name,
								price: property.price,
								quantity: property.quantityTotal.toString(),
								status: property.status.status,
								numberAssigned: property.quantityAssigned.toString(),
								category: property.category.category,
								categoryId: property.category.id,
								addedOn: formattedDate,
								images: images,
							}}
							onSave={(formData: any) => {
								if (property?.id) {
									const mediaKeysArray = formData.mediaKeys || [];
									const mediaKeysObject = mediaKeysArray.reduce((acc: any, key: string, idx: number) => {
										acc[`media_${idx}`] = key;
										return acc;
									}, {});

									const payload = {
										name: formData.name,
										categoryId: formData.categoryId,
										price: Number(formData.price),
										quantityTotal: Number(formData.quantity),
										condition: formData.condition || property.description || "Good",
										mediaKeys: mediaKeysObject || {},
									};
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
					<KeyValueRow leftClassName="text-black" label="Added On" value={formattedDate} />
				</section>
			</CustomCard>
		</PageWrapper>
	);
}
