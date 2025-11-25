import CustomCard from "@/components/base/CustomCard";
import KeyValueRow from "@/components/common/KeyValueRow";
import SectionTitle from "@/components/common/SectionTitle";

export default function TabGuarantorDetails({ data }: { data: any }) {
	const guarantors = data?.guarantors || [];

	return (
		<CustomCard className="border-none p-0 h-auto">
			{guarantors.length === 0 ? (
				<p className="text-muted-foreground">No guarantors found</p>
			) : (
				<div className="flex flex-col gap-y-4">
					{guarantors.map((g: any, i: number) => (
						<div key={i}>
							<SectionTitle title={`Guarantor ${i + 1}`} />
							<CustomCard className="grid grid-cols-1 gap-y-1 mt-4 bg-card">
								<KeyValueRow
									label="Full name"
									value={g.fullName || "N/A"}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								<KeyValueRow
									label="Occupation"
									value={g.occupation || "N/A"}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								<KeyValueRow
									label="Phone Number"
									value={g.phoneNumber || "N/A"}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								<KeyValueRow label="Email" value={g.email || "N/A"} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
								<KeyValueRow
									label="Employment Status"
									value={g.employmentStatusId || "N/A"}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								<KeyValueRow
									label="Home address"
									value={g.homeAddress || "N/A"}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								<KeyValueRow
									label="State Of Origin"
									value={g.stateOfOrigin || "N/A"}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
							</CustomCard>
						</div>
					))}
				</div>
			)}
		</CustomCard>
	);
}
