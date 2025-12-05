import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import KeyValueRow from "@/components/common/KeyValueRow";
import { useState } from "react";
import type { CustomerRegistration, PropertyInterest } from "@/types/productRequest";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddProperties from "@/dashboard/Properties/AddProperties";
import { Button } from "@/components/ui/button";
import { modalContentStyle } from "../../components/common/commonStyles";
import { CardSkeleton } from "@/components/common/Skeleton";

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
				{propertyInterests.map((property: Record<string, unknown>, index: number) => (
					<div key={index}>
						<SectionTitle title={`Property Interest ${index + 1}`} />
						<CustomCard className="mt-6 p-0 border-0">
							<div className="grid grid-cols-1 gap-y-0.5 text-sm">
								<KeyValueRow
									label="Property ID"
									value={(property.propertyId as string) || "N/A"}
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
									label="Down Payment"
									value={`₦${(property.downPayment as number) || 0}`}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								<KeyValueRow
									label="Payment Interval ID"
									value={String((property.paymentIntervalId as string) || "N/A")}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								<KeyValueRow
									label="Is Assigned"
									value={(property.isAssigned as boolean) ? "Yes" : "No"}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								{(property.customPropertyName as string) && (
									<KeyValueRow
										label="Custom Property Name"
										value={property.customPropertyName as string}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
								)}
								{(property.customPropertyPrice as number) && (
									<KeyValueRow
										label="Custom Property Price"
										value={`₦${property.customPropertyPrice as number}`}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
								)}
							</div>
						</CustomCard>
					</div>
				))}
			</div>
		</CustomCard>
	);
}
