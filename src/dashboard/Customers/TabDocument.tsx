import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import DocumentGroupView, { type DocumentGroup } from "@/components/common/DocumentGroupView";
import { formatDate } from "@/lib/utils";

type CustomerDocumentsResponse = {
	groups?: Array<{
		registrationId: string;
		registrationCode: string;
		registrationDate: string;
		approvedAt?: string | null;
		contracts?: Array<{
			contractId: string;
			contractCode: string;
			contractDate: string;
			propertyName?: string | null;
		}>;
		documents: DocumentGroup["documents"];
	}>;
};

function buildGroupTitle(group: NonNullable<CustomerDocumentsResponse["groups"]>[number]) {
	const contract = group.contracts?.[0];
	if (contract) {
		return contract.contractCode;
	}
	return group.registrationCode;
}

function buildGroupSubtitle(group: NonNullable<CustomerDocumentsResponse["groups"]>[number]) {
	const contract = group.contracts?.[0];

	if (contract?.contractDate) {
		return formatDate(contract.contractDate);
	}

	return formatDate(group.registrationDate);
}

export default function TabDocument({
	documents,
	customerId,
}: {
	documents?: CustomerDocumentsResponse | undefined;
	customerId?: string;
}) {
	const groups: DocumentGroup[] = (documents?.groups ?? []).map((group) => ({
		key: group.registrationId,
		title: buildGroupTitle(group),
		subtitle: buildGroupSubtitle(group),
		documents: group.documents,
	}));

	return (
		<CustomCard className="border-none p-0 bg-white">
			<SectionTitle title="Document Uploaded" />
			<div className="mt-6">
				<DocumentGroupView groups={groups} customerId={customerId} />
			</div>
		</CustomCard>
	);
}
