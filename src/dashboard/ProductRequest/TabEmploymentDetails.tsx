import CustomCard from "@/components/base/CustomCard";
import KeyValueRow from "@/components/common/KeyValueRow";
import React from "react";
import { useGetReferenceData } from "@/api/reference";
import { extractEmploymentStatusOptions } from "@/lib/referenceDataHelpers";

export default function TabEmploymentDetails({ data }: { data: Record<string, unknown> }) {
	const emp = (data?.employmentDetails as Record<string, unknown>) || {};

	const { data: refData } = useGetReferenceData();
	const employmentStatusOptions = React.useMemo(() => extractEmploymentStatusOptions(refData), [refData]);

	const getEmploymentStatusLabel = (statusId: string | number | undefined): string => {
		if (!statusId) return "N/A";
		const idStr = String(statusId);
		const found = employmentStatusOptions.find((opt) => opt.key === idStr);
		return found ? found.value : idStr;
	};

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
						value={getEmploymentStatusLabel(emp?.employmentStatusId as string | number | undefined)}
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
