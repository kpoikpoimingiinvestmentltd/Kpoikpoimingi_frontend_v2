import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import { useGetSignedContract } from "@/api/contracts";
import { getFileIcon } from "@/lib/utils";
import { Link } from "react-router";

export default function TabDocument({ contract }: { contract?: { id?: string } }) {
	const contractId = contract?.id;
	const { data: signedData, isLoading: signedLoading, isError: signedError } = useGetSignedContract(contractId, !!contractId);
	const signedDocs = signedData?.signedContract ?? [];

	return (
		<CustomCard className="border-none p-0 bg-white">
			<SectionTitle title="Document Uploaded" />

			<div className="mt-8 flex flex-col gap-y-6">
				<h6 className="text-sm">Signed Contract</h6>
				<div className="flex items-center gap-6 flex-wrap pb-3">
					{signedLoading && <div className="text-sm text-muted-foreground">Loading signed contract...</div>}
					{signedError && <div className="text-sm text-destructive">Failed to load signed contract</div>}

					{!signedLoading && signedDocs.length === 0 && <div className="text-sm text-muted-foreground">No signed contract uploaded.</div>}

					{signedDocs.map((d, idx) => (
						<div key={idx} className="flex flex-col items-start gap-2.5 w-20">
							<Link
								to={d.fileUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex flex-col items-start gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
								<Image src={getFileIcon(d.fileUrl, media.images)} className="w-14 rounded-md" />
								<div className="text-xs text-muted-foreground text-start">Document</div>
							</Link>
						</div>
					))}
				</div>
			</div>
		</CustomCard>
	);
}
