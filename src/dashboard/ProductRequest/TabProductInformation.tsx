import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import KeyValueRow from "@/components/common/KeyValueRow";
import ImageGallery from "@/components/base/ImageGallery";
import { media } from "@/resources/images";

export default function TabProductInformation() {
	const product = {
		propertyImage: media.images._product1,
		propertyName: "25kg gas cylinder",
		amount: "80,000",
		paymentMethod: "Hire Purchase",
		paymentFrequency: "Monthly",
		paymentDuration: "6 months",
		reason: "To replace the gas cylinder in my home",
	};

	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<SectionTitle title="Property Details" />

			<CustomCard className="mt-6 p-0 border-0">
				<div className="mb-6">
					<ImageGallery
						images={[product.propertyImage]}
						mode="view"
						containerBorder="none"
						thumbVariant="solid"
						thumbBg="bg-primary/10"
						labelText="Property Image"
						className="rounded-lg"
					/>
				</div>

				<div className="grid grid-cols-1 gap-y-0.5 text-sm">
					<KeyValueRow label="Property Name" value={product.propertyName} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow label="Amount" value={product.amount} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow
						label="Payment Method"
						value={product.paymentMethod}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						label="Payment Frequency"
						value={product.paymentFrequency}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						label="Payment duration"
						value={product.paymentDuration}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow label="Reason for property" value={product.reason} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
				</div>
			</CustomCard>
		</CustomCard>
	);
}
