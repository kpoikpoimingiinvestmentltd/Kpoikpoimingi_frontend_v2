import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import DocumentGroupView, { type DocumentGroup } from "@/components/common/DocumentGroupView";
import { useGetContractDocuments } from "@/api/contracts";
import { formatDate } from "@/lib/utils";

export default function TabDocument({ contract }: { contract?: { id?: string } }) {
	const contractId = contract?.id;
	const { data, isLoading, isError } = useGetContractDocuments(contractId, !!contractId);

	const groups: DocumentGroup[] = data
		? [
				{
					key: data.contractId,
					title: data.contractCode,
					subtitle: data.contractDate ? formatDate(data.contractDate) : undefined,
					documents: data.documents,
				},
			]
		: [];

	return (
		<CustomCard className="border-none p-0 bg-white">
			<SectionTitle title="Document Uploaded" />
			<div className="mt-6">
				<DocumentGroupView
					groups={groups}
					contractId={contractId}
					isLoading={isLoading}
					isError={isError}
					emptyMessage="No documents uploaded for this contract."
				/>
			</div>
		</CustomCard>
	);
}
