import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import KeyValueRow from "@/components/common/KeyValueRow";
import ImageGallery from "@/components/base/ImageGallery";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddProperties from "@/dashboard/Properties/AddProperties";
import { Button } from "@/components/ui/button";
import { modalContentStyle } from "../../components/common/commonStyles";
import { CardSkeleton } from "@/components/common/Skeleton";

export default function TabFullPaymentDetails({
	data,
	loading,
	onPropertyAdded,
}: {
	data?: Record<string, unknown> | null;
	loading?: boolean;
	onPropertyAdded?: () => void;
}) {
	const [addOpenForPropertyId, setAddOpenForPropertyId] = useState<string | null>(null);

	if (loading) {
		return (
			<CustomCard className="mt-4 border-none p-0 bg-white">
				<CardSkeleton lines={6} />
			</CustomCard>
		);
	}

	if (!data) {
		return (
			<CustomCard className="mt-4 border-none p-0 bg-white">
				<p className="text-muted-foreground">No registration data found</p>
			</CustomCard>
		);
	}

	const customer = data.customer as Record<string, unknown> | undefined;
	const propertyInterests = Array.isArray(data.propertyInterestRequest) ? (data.propertyInterestRequest as Record<string, unknown>[]) : [];

	const getPropertyImages = (property: Record<string, unknown>) => {
		const imageUrl = (property.imageUrl as string) || (property.media as string);
		return imageUrl ? [imageUrl] : [];
	};

	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<div className="flex flex-col gap-y-6">
				<CustomCard className="bg-card border-0">
					<SectionTitle title="Customer Details" />
					<div className="grid grid-cols-1 gap-y-0.5 mt-4 text-sm">
						<KeyValueRow
							label="Customer Name"
							value={(customer?.fullName as string) || (data.fullName as string) || "N/A"}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Email"
							value={(customer?.email as string) || (data.email as string) || "N/A"}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Whatsapp Number"
							value={(customer?.phoneNumber as string) || (data.phoneNumber as string) || "N/A"}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
					</div>
				</CustomCard>

				{/* Property Details Section */}
				{propertyInterests.length > 0 && (
					<div>
						{propertyInterests.map((property: Record<string, unknown>, index: number) => {
							const propertyId = String(property.id);
							const isCustomProperty = (property.isCustomProperty as boolean) || false;

							return (
								<div key={index} className={index > 0 ? "mt-8" : ""}>
									{/* Property Image */}
									<div className="mb-6">
										<ImageGallery
											images={getPropertyImages(property)}
											mode="view"
											labelText="Property Image"
											containerBg="bg-blue-50"
											containerBorder="none"
											className="rounded-lg"
										/>
									</div>

									{/* Property Details Card */}
									<CustomCard className="p-0 border-0">
										<div className="grid grid-cols-1 gap-y-0.5 text-sm">
											<KeyValueRow
												label="Property Name"
												value={(property.customPropertyName as string) || (property.propertyName as string) || "N/A"}
												leftClassName="text-sm text-muted-foreground"
												rightClassName="text-right"
											/>
											<KeyValueRow
												label="Quantity"
												value={String((property.quantity as number) || 1)}
												leftClassName="text-sm text-muted-foreground"
												rightClassName="text-right"
											/>
											<KeyValueRow
												label="Amount"
												value={`₦${(property.customPropertyPrice || property.totalAmount || 0) as number}`}
												leftClassName="text-sm text-muted-foreground"
												rightClassName="text-right"
											/>
											<KeyValueRow
												label="Payment Method"
												value="One time payment"
												leftClassName="text-sm text-muted-foreground"
												rightClassName="text-right"
											/>
											{(property.vehicleMake as string) && (
												<KeyValueRow
													label="Vehicle Make"
													value={(property.vehicleMake as string) || "N/A"}
													leftClassName="text-sm text-muted-foreground"
													rightClassName="text-right"
												/>
											)}
											{(property.type as string) && (
												<KeyValueRow
													label="Type"
													value={(property.type as string) || "N/A"}
													leftClassName="text-sm text-muted-foreground"
													rightClassName="text-right"
												/>
											)}
											{(property.colour as string) && (
												<KeyValueRow
													label="Colour"
													value={(property.colour as string) || "N/A"}
													leftClassName="text-sm text-muted-foreground"
													rightClassName="text-right"
												/>
											)}
											{(property.registrationNumber as string) && (
												<KeyValueRow
													label="Registration number"
													value={(property.registrationNumber as string) || "N/A"}
													leftClassName="text-sm text-muted-foreground"
													rightClassName="text-right"
												/>
											)}
											{(property.chassisNo as string) && (
												<KeyValueRow
													label="Chassis No"
													value={(property.chassisNo as string) || "N/A"}
													leftClassName="text-sm text-muted-foreground"
													rightClassName="text-right"
												/>
											)}
											{(property.condition as string) && (
												<KeyValueRow
													label="Condition"
													value={(property.condition as string) || "N/A"}
													leftClassName="text-sm text-muted-foreground"
													rightClassName="text-right"
												/>
											)}
										</div>
									</CustomCard>

									{/* Show banner if custom property */}
									{isCustomProperty && (
										<>
											<div className="flex items-center justify-between flex-wrap gap-4 p-4 bg-amber-100 rounded mt-4">
												<div className="text-sm text-amber-700 font-medium">Property Not In System</div>
												<div>
													<Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => setAddOpenForPropertyId(propertyId)}>
														+ Add Property
													</Button>
												</div>
											</div>
											<Dialog
												open={addOpenForPropertyId === propertyId}
												onOpenChange={(open) => {
													if (!open) setAddOpenForPropertyId(null);
												}}>
												<DialogContent className={modalContentStyle()}>
													<AddProperties
														propertyRequestId={propertyId}
														onComplete={() => {
															setAddOpenForPropertyId(null);
															onPropertyAdded?.();
														}}
													/>
												</DialogContent>
											</Dialog>
										</>
									)}
								</div>
							);
						})}
					</div>
				)}

				{propertyInterests.length === 0 && (
					<CustomCard className="mt-4 border-none p-0 bg-white">
						<p className="text-muted-foreground">No property interests found</p>
					</CustomCard>
				)}
			</div>
		</CustomCard>
	);
}
