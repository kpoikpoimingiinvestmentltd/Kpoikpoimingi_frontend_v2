import CustomCard from "@/components/base/CustomCard";
import KeyValueRow from "@/components/common/KeyValueRow";

export default function TabNextOfKin() {
	const next = {
		fullName: "Tom Doe James",
		phone: "+2348134567890",
		relationship: "Brother",
		spouseName: "Rose Doe James",
		spousePhone: "+2348134567890",
		address: "9 ikorudu street, Lagos",
	};

	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<CustomCard className="mt-6 p-6 bg-card">
				<div className="grid grid-cols-1 gap-y-0.5 text-sm">
					<KeyValueRow label="Full Name" value={next.fullName} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow label="Phone Number" value={next.phone} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow label="Relationship" value={next.relationship} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow label="Spouse Name" value={next.spouseName} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow
						label="Spouse Phone Number"
						value={next.spousePhone}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow label="Address" value={next.address} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
				</div>
			</CustomCard>
		</CustomCard>
	);
}
