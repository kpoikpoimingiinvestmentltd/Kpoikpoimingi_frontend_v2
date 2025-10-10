import CustomCard from "@/components/base/CustomCard";
import KeyValueRow from "@/components/common/KeyValueRow";

export default function TabEmploymentDetails() {
	const emp = {
		employer: "Acme Corp",
		position: "Sales Manager",
		employmentType: "Full-time",
		workEmail: "tom@acme.com",
		workPhone: "+2348134567890",
		monthlyIncome: "₦250,000",
		prevEmployer: "OldCorp Ltd",
	};

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
