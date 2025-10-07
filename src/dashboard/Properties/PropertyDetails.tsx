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

export default function PropertyDetails() {
	const images = [media.images._product1, media.images._product2, media.images._product3];

	const [editOpen, setEditOpen] = React.useState(false);

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
								id: "ID123456",
								name: "25kg gas cylinder",
								price: "80,000",
								quantity: "8",
								status: "Available",
								numberAssigned: "4",
								category: "Gas",
								addedOn: "2025-03-12",
								images: images,
							}}
						/>
					</div>

					<ImageGallery images={images} mode="view" thumbVariant="solid" thumbBg="bg-primary/10" />
				</section>

				<section aria-label="property details" className="mt-4 gap-6">
					<KeyValueRow leftClassName="text-black" label="Property ID" value="ID123456" />
					<KeyValueRow leftClassName="text-black" label="Property Name" value="25kg gas cylinder" />
					<KeyValueRow leftClassName="text-black" label="Amount" value="80,000" />
					<KeyValueRow leftClassName="text-black" label="Quantity" value="8" />
					<KeyValueRow leftClassName="text-black" label="Status" value="Available" />
					<KeyValueRow leftClassName="text-black" label="Number Assigned" value="4" />
					<KeyValueRow leftClassName="text-black" label="Category" value="Gas" />
					<KeyValueRow leftClassName="text-black" label="Added On" value="2025-03-12" />
				</section>
			</CustomCard>
		</PageWrapper>
	);
}
