import CustomCard from "@/components/base/CustomCard";
import KeyValueRow from "@/components/common/KeyValueRow";
import { useState } from "react";
import type { CustomerRegistration, PropertyInterest } from "@/types/productRequest";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddProperties from "@/dashboard/Properties/AddProperties";
import { Button } from "@/components/ui/button";
import { modalContentStyle } from "../../components/common/commonStyles";
import { CardSkeleton } from "@/components/common/Skeleton";
import ImageGallery from "@/components/base/ImageGallery";

export default function TabProductInformation({
	data,
	loading,
	onPropertyAdded,
}: {
	data?: CustomerRegistration | null;
	loading?: boolean;
	onPropertyAdded?: () => void;
}) {
	if (loading) {
		return (
			<CustomCard className="mt-4 border-none p-0 bg-white">
				<CardSkeleton lines={6} />
			</CustomCard>
		);
	}
	const propertyInterests: PropertyInterest[] = Array.isArray(data?.propertyInterestRequest)
		? (data!.propertyInterestRequest as PropertyInterest[])
		: [];

	const firstPropertyRequestId = propertyInterests.length > 0 ? String(propertyInterests[0].id) : undefined;

	const [addOpen, setAddOpen] = useState(false);

	const hasCustomerProperty = propertyInterests.some((p) => !!p.isCustomProperty);

	if (!propertyInterests.length) {
		return (
			<CustomCard className="mt-4 border-none p-0 bg-white">
				<p className="text-muted-foreground">No property interests found</p>
			</CustomCard>
		);
	}

	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<div className="flex flex-col gap-y-6">
				{hasCustomerProperty && (
					<>
						<div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-amber-50 rounded">
							<div className="text-sm text-amber-700">Property Not In System</div>
							<div>
								<Button className="bg-primary text-white" onClick={() => setAddOpen(true)}>
									+ Add Property
								</Button>
							</div>
						</div>
						<Dialog open={addOpen} onOpenChange={setAddOpen}>
							<Dialog open={addOpen} onOpenChange={setAddOpen}>
								<DialogContent className={modalContentStyle()}>
									<AddProperties
										propertyRequestId={firstPropertyRequestId}
										onComplete={() => {
											setAddOpen(false);
											onPropertyAdded?.();
										}}
									/>
								</DialogContent>
							</Dialog>
						</Dialog>
					</>
				)}
				{propertyInterests.map((property: Record<string, unknown>, index: number) => {
					const propertyData = property.property as Record<string, unknown>;
					const propertyImages = (propertyData?.images as string[]) || [];
					const durationUnit =
						(property.durationUnitId as number) === 1 ? "day(s)" : (property.durationUnitId as number) === 2 ? "month(s)" : "year(s)";

					return (
						<div key={index}>
							{/* Property Image */}
							{propertyImages.length > 0 && (
								<ImageGallery
									images={propertyImages[0]}
									uploadedImages={propertyImages.map((src) => ({ src }))}
									mode="view"
									containerBg="bg-blue-50"
									thumbBg="bg-gray-100"
									thumbVariant="solid"
									containerBorder="dashed"
								/>
							)}

							{/* Property Details */}
							<CustomCard className="mt-6 p-0 border-0">
								<div className="grid grid-cols-1 gap-4 text-sm">
									<KeyValueRow
										label="Property Name"
										value={(propertyData?.name as string) || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right md:text-left"
									/>
									<KeyValueRow
										label="Amount"
										value={`₦${(propertyData?.price as string) || 0}`}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right md:text-left"
									/>
									<KeyValueRow
										label="Payment Method"
										value={
											(property.paymentIntervalId as number) === 1
												? "One-time"
												: (property.paymentIntervalId as number) === 2
												? "Hire Purchase"
												: "N/A"
										}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right md:text-left"
									/>
									<KeyValueRow
										label="Payment Frequency"
										value={(property.paymentIntervalId as number) === 1 ? "N/A" : (property.paymentIntervalId as number) === 2 ? "Monthly" : "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right md:text-left"
									/>
									<KeyValueRow
										label="Payment Duration"
										value={`${(property.durationValue as number) || 0} ${durationUnit}`}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right md:text-left"
									/>
									{data?.purposeOfProperty && (
										<KeyValueRow
											label="Reason for Property"
											value={(data.purposeOfProperty as string) || "N/A"}
											leftClassName="text-sm text-muted-foreground"
											rightClassName="text-right md:text-left"
										/>
									)}
									<KeyValueRow
										label="Down Payment"
										value={`₦${(property.downPayment as number) || 0}`}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right md:text-left"
									/>
									<KeyValueRow
										label="Quantity"
										value={String((property.quantity as number) || 1)}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right md:text-left"
									/>
								</div>
							</CustomCard>
						</div>
					);
				})}
			</div>
		</CustomCard>
	);
}
