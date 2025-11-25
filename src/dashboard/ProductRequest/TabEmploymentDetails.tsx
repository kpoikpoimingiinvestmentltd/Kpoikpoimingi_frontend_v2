import CustomCard from "@/components/base/CustomCard";
import KeyValueRow from "@/components/common/KeyValueRow";

export default function TabEmploymentDetails({ data }: { data: any }) {
	const emp = data?.employmentDetails || {};

	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<CustomCard className="mt-6 p-6 bg-card">
				<div className="grid grid-cols-1 gap-y-0.5 text-sm">
					<KeyValueRow
						label="Employer/Company"
						value={emp?.employerName || emp?.companyName || "N/A"}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						label="Employment Status"
						value={emp?.employmentStatusId || "N/A"}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						label="Company Address"
						value={emp?.employerAddress || emp?.businessAddress || "N/A"}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						label="Home Address"
						value={emp?.homeAddress || "N/A"}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
				</div>
			</CustomCard>
		</CustomCard>
	);

	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<CustomCard className="mt-6 p-6 bg-card">
				<div className="grid grid-cols-1 gap-y-05 text-sm">
					<KeyValueRow label="Employer" value={emp.employer} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow label="Position" value={emp.position} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow label="Employment Type" value={emp.employmentType} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow label="Work Email" value={emp.workEmail} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow label="Work Phone" value={emp.workPhone} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow label="Monthly Income" value={emp.monthlyIncome} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow label="Previous Employer" value={emp.prevEmployer} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
				</div>
			</CustomCard>
		</CustomCard>
	);
}
