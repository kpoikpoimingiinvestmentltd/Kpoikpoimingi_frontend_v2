import CustomCard from "@/components/base/CustomCard";
import KeyValueRow from "@/components/common/KeyValueRow";

export default function TabEmploymentDetails({ data }: { data: Record<string, unknown> }) {
	const emp = (data?.employmentDetails as Record<string, unknown>) || {};

	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<CustomCard className="mt-6 p-6 bg-card">
				<div className="grid grid-cols-1 gap-y-0.5 text-sm">
					<KeyValueRow
						label="Employer/Company"
						value={(emp?.employerName as string) || (emp?.companyName as string) || "N/A"}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						label="Employment Status"
						value={(emp?.employmentStatusId as string) || "N/A"}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						label="Company Address"
						value={(emp?.employerAddress as string) || (emp?.businessAddress as string) || "N/A"}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						label="Home Address"
						value={(emp?.homeAddress as string) || "N/A"}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
				</div>
			</CustomCard>
		</CustomCard>
	);
}
