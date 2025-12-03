import CustomCard from "@/components/base/CustomCard";
import KeyValueRow from "@/components/common/KeyValueRow";

export default function TabNextOfKin({ data }: { data: Record<string, unknown> }) {
	const next = (data?.nextOfKin as Record<string, unknown>) || {};

	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<CustomCard className="mt-6 p-6 bg-card">
				<div className="grid grid-cols-1 gap-y-0.5 text-sm">
					<KeyValueRow
						label="Full Name"
						value={(next?.fullName as string) || "N/A"}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						label="Phone Number"
						value={(next?.phoneNumber as string) || "N/A"}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						label="Relationship"
						value={(next?.relationship as string) || "N/A"}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						label="Spouse Name"
						value={(next?.spouseFullName as string) || "N/A"}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						label="Spouse Phone Number"
						value={(next?.spousePhone as string) || "N/A"}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						label="Address"
						value={(next?.spouseAddress as string) || "N/A"}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
				</div>
			</CustomCard>
		</CustomCard>
	);
}
