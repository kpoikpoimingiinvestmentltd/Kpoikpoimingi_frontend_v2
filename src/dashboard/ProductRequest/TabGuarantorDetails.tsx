import CustomCard from "@/components/base/CustomCard";
import KeyValueRow from "@/components/common/KeyValueRow";
import SectionTitle from "@/components/common/SectionTitle";

export default function TabGuarantorDetails() {
	const guarantors = [
		{
			name: "Grace Collins",
			phone: "+2348173635636",
			occupation: "Teacher",
			email: "dummy@gmail.com",
			employmentStatus: "Civil Servant",
			address: "9 ikorudu street, Lagos",
			state: "Lagos State",
			uploaded: 2,
		},
	];

	return (
		<CustomCard className="border-none p-0 h-auto bg-white">
			<div className="flex flex-col gap-y-4">
				{guarantors.map((g, i) => (
					<div key={i}>
						<SectionTitle title={`Guarantor ${i + 1}`} />
						<CustomCard className="grid grid-cols-1 gap-y-1 mt-4">
							<KeyValueRow label="Full name" value={g.name} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
							<KeyValueRow label="Occupation" value={g.occupation} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
							<KeyValueRow label="Phone Number" value={g.phone} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
							<KeyValueRow label="Email" value={g.email} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
							<KeyValueRow
								label="Employment Status"
								value={g.employmentStatus}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow label="Home address" value={g.address} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
							<KeyValueRow label="State Of Origin" value={g.state} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						</CustomCard>
					</div>
				))}
			</div>
		</CustomCard>
	);
}
