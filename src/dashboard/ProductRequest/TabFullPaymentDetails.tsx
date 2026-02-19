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
	const nextOfKin = data.nextOfKin as Record<string, unknown> | undefined;
	const employmentDetails = data.employmentDetails as Record<string, unknown> | undefined;
	const guarantors = Array.isArray(data.guarantors) ? (data.guarantors as Record<string, unknown>[]) : [];

	const getPropertyImages = (property: Record<string, unknown>) => {
		// Get images from nested property object first
		const nestedProperty = property.property as Record<string, unknown> | undefined;
		if (nestedProperty && Array.isArray(nestedProperty.images)) {
			return (nestedProperty.images as string[]).filter(Boolean);
		}
		// Fallback to direct property fields
		const imageUrl = (property.imageUrl as string) || (property.media as string);
		return imageUrl ? [imageUrl] : [];
	};

	return (
		<CustomCard className="mt-4 border-none bg-white">
			<div className="flex flex-col gap-y-6">
				{/* Registration Overview */}
				<CustomCard className="bg-card border-0 p-0">
					<SectionTitle title="Registration Details" />
					<div className="grid grid-cols-1 gap-y-0.5 mt-4 text-sm">
						<KeyValueRow
							label="Registration Code"
							value={(data.registrationCode as string) || "N/A"}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow label="Payment Type" value="Full Payment" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							label="Source"
							value={((data.source as string) || "N/A").charAt(0).toUpperCase() + ((data.source as string) || "N/A").slice(1)}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Status"
							value={data.approved ? "Approved" : data.declined ? "Declined" : data.isContractSent ? "Contract Sent" : "Pending"}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Created Date"
							value={data.createdAt ? new Date(data.createdAt as string).toLocaleDateString("en-GB") : "N/A"}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						{(data.approvedAt as string | null) && (
							<KeyValueRow
								label="Approved Date"
								value={new Date(data.approvedAt as string).toLocaleDateString("en-GB")}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
						)}
						{(data.declinedAt as string | null) && (
							<KeyValueRow
								label="Declined Date"
								value={new Date(data.declinedAt as string).toLocaleDateString("en-GB")}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
						)}
						{(data.contractSentAt as string | null) && (
							<KeyValueRow
								label="Contract Sent Date"
								value={new Date(data.contractSentAt as string).toLocaleDateString("en-GB")}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
						)}
					</div>
				</CustomCard>

				{/* Customer Details */}
				<CustomCard className="bg-card border-0 p-0">
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
							label="Phone Number"
							value={(customer?.phoneNumber as string) || (data.phoneNumber as string) || "N/A"}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Date of Birth"
							value={(data.dateOfBirth as string) || "N/A"}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Home Address"
							value={(data.homeAddress as string) || "N/A"}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Is Driver"
							value={data.isDriver === null ? "N/A" : data.isDriver ? "Yes" : "No"}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Purpose of Property"
							value={(data.purposeOfProperty as string) || "N/A"}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Down Payment"
							value={`₦${parseFloat(data.downPayment as string) || 0}`}
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
									{/* Property Image Gallery */}
									<div className="mb-6">
										<ImageGallery
											images={getPropertyImages(property)[0]} // Main image
											uploadedImages={getPropertyImages(property).map((img: string) => ({
												src: img,
											}))}
											mode="view"
											labelText="Property Image"
											containerBg="bg-blue-50"
											containerBorder="none"
											className="rounded-lg"
											thumbVariant="solid"
										/>
									</div>

									{/* Property Details Card */}
									<CustomCard className="p-0 border-0">
										<div className="grid grid-cols-1 gap-y-0.5 text-sm">
											<KeyValueRow
												label="Property Name"
												value={
													(property.customPropertyName as string) ||
													((property.property as Record<string, unknown>)?.name as string) ||
													(property.propertyName as string) ||
													"N/A"
												}
												leftClassName="text-sm text-muted-foreground"
												rightClassName="text-right"
											/>
											<KeyValueRow
												label="Property Code"
												value={((property.property as Record<string, unknown>)?.propertyCode as string) || "N/A"}
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
												value={`₦${
													parseFloat(
														(property.customPropertyPrice ||
															(property.property as Record<string, unknown>)?.price ||
															property.totalAmount ||
															0) as string,
													) || 0
												}`}
												leftClassName="text-sm text-muted-foreground"
												rightClassName="text-right"
											/>
											<KeyValueRow
												label="Payment Method"
												value="One time payment"
												leftClassName="text-sm text-muted-foreground"
												rightClassName="text-right"
											/>
											{((property.property as Record<string, unknown>)?.description as string) && (
												<KeyValueRow
													label="Description"
													value={((property.property as Record<string, unknown>)?.description as string) || "N/A"}
													leftClassName="text-sm text-muted-foreground"
													rightClassName="text-right"
												/>
											)}
											{((property.property as Record<string, unknown>)?.condition as string) && (
												<KeyValueRow
													label="Condition"
													value={((property.property as Record<string, unknown>)?.condition as string) || "N/A"}
													leftClassName="text-sm text-muted-foreground"
													rightClassName="text-right"
												/>
											)}
											{((property.property as Record<string, unknown>)?.vehicleMake as string) && (
												<KeyValueRow
													label="Vehicle Make"
													value={((property.property as Record<string, unknown>)?.vehicleMake as string) || "N/A"}
													leftClassName="text-sm text-muted-foreground"
													rightClassName="text-right"
												/>
											)}
											{((property.property as Record<string, unknown>)?.vehicleModel as string) && (
												<KeyValueRow
													label="Vehicle Model"
													value={((property.property as Record<string, unknown>)?.vehicleModel as string) || "N/A"}
													leftClassName="text-sm text-muted-foreground"
													rightClassName="text-right"
												/>
											)}
											{((property.property as Record<string, unknown>)?.vehicleYear as string) && (
												<KeyValueRow
													label="Vehicle Year"
													value={((property.property as Record<string, unknown>)?.vehicleYear as string) || "N/A"}
													leftClassName="text-sm text-muted-foreground"
													rightClassName="text-right"
												/>
											)}
											{((property.property as Record<string, unknown>)?.vehicleColor as string) && (
												<KeyValueRow
													label="Vehicle Color"
													value={((property.property as Record<string, unknown>)?.vehicleColor as string) || "N/A"}
													leftClassName="text-sm text-muted-foreground"
													rightClassName="text-right"
												/>
											)}
											{((property.property as Record<string, unknown>)?.vehicleChassisNumber as string) && (
												<KeyValueRow
													label="Chassis Number"
													value={((property.property as Record<string, unknown>)?.vehicleChassisNumber as string) || "N/A"}
													leftClassName="text-sm text-muted-foreground"
													rightClassName="text-right"
												/>
											)}
											{((property.property as Record<string, unknown>)?.vehicleRegistrationNumber as string) && (
												<KeyValueRow
													label="Registration Number"
													value={((property.property as Record<string, unknown>)?.vehicleRegistrationNumber as string) || "N/A"}
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

				{/* Employment Details */}
				{employmentDetails && (
					<CustomCard className="bg-card border-0">
						<SectionTitle title="Employment Details" />
						<div className="grid grid-cols-1 gap-y-0.5 mt-4 text-sm">
							<KeyValueRow
								label="Employer Name"
								value={(employmentDetails.employerName as string) || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Employer Address"
								value={(employmentDetails.employerAddress as string) || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Position"
								value={(employmentDetails.position as string) || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Employment Type"
								value={(employmentDetails.employmentType as string) || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Monthly Income"
								value={`₦${(employmentDetails.monthlyIncome as number) || 0}`}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Years of Service"
								value={String((employmentDetails.yearsOfService as number) || 0)}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
						</div>
					</CustomCard>
				)}

				{/* Next of Kin */}
				{nextOfKin && (
					<CustomCard className="bg-card border-0">
						<SectionTitle title="Next of Kin Details" />
						<div className="grid grid-cols-1 gap-y-0.5 mt-4 text-sm">
							<KeyValueRow
								label="Full Name"
								value={(nextOfKin.fullName as string) || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Relationship"
								value={(nextOfKin.relationship as string) || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Phone Number"
								value={(nextOfKin.phoneNumber as string) || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Email"
								value={(nextOfKin.email as string) || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Address"
								value={(nextOfKin.address as string) || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
						</div>
					</CustomCard>
				)}

				{/* Guarantors */}
				{guarantors.length > 0 && (
					<div>
						{guarantors.map((guarantor: Record<string, unknown>, index: number) => (
							<CustomCard key={index} className="bg-card border-0 mt-4">
								<SectionTitle title={`Guarantor ${index + 1} Details`} />
								<div className="grid grid-cols-1 gap-y-0.5 mt-4 text-sm">
									<KeyValueRow
										label="Full Name"
										value={(guarantor.fullName as string) || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
									<KeyValueRow
										label="Relationship"
										value={(guarantor.relationship as string) || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
									<KeyValueRow
										label="Phone Number"
										value={(guarantor.phoneNumber as string) || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
									<KeyValueRow
										label="Email"
										value={(guarantor.email as string) || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
									<KeyValueRow
										label="Address"
										value={(guarantor.address as string) || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
									<KeyValueRow
										label="State of Origin"
										value={(guarantor.stateOfOrigin as string) || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
									<KeyValueRow
										label="Occupation"
										value={(guarantor.occupation as string) || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
								</div>
							</CustomCard>
						))}
					</div>
				)}

				{/* Hire Purchase History (if applicable) */}
				{(data.previousHirePurchase || data.previousCompany || data.wasPreviousCompleted !== null) && (
					<CustomCard className="bg-card border-0">
						<SectionTitle title="Previous Hire Purchase History" />
						<div className="grid grid-cols-1 gap-y-0.5 mt-4 text-sm">
							<KeyValueRow
								label="Previous Hire Purchase"
								value={data.previousHirePurchase === null ? "N/A" : data.previousHirePurchase ? "Yes" : "No"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Previous Company"
								value={(data.previousCompany as string) || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Was Previous Completed"
								value={data.wasPreviousCompleted === null ? "N/A" : data.wasPreviousCompleted ? "Yes" : "No"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
						</div>
					</CustomCard>
				)}
			</div>
		</CustomCard>
	);
}
