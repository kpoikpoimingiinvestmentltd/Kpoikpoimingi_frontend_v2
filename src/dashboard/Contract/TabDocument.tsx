import { useState } from "react";
import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import { useGetSignedContract } from "@/api/contracts";
import { getFileIcon, extractErrorMessage } from "@/lib/utils";
import { Link } from "react-router";
import { IconWrapper, TrashIcon } from "@/assets/icons";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useDeleteCustomerDocument } from "@/api/customer";
import { useQueryClient } from "@tanstack/react-query";
import { useIsSuperAdmin } from "@/hooks/usePermissions";
import { toast } from "sonner";

export default function TabDocument({ contract }: { contract?: { id?: string } }) {
	const contractId = contract?.id;
	const { data: signedData, isLoading: signedLoading, isError: signedError } = useGetSignedContract(contractId, !!contractId);
	const signedDocs = signedData?.signedContract ?? [];
	const canDelete = useIsSuperAdmin();
	const queryClient = useQueryClient();
	const deleteMutation = useDeleteCustomerDocument();
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

	const handleConfirmDelete = async () => {
		if (!pendingDeleteId) return false;
		try {
			await deleteMutation.mutateAsync(pendingDeleteId);
			toast.success("Document deleted successfully");
			await queryClient.invalidateQueries({ queryKey: ["contract-signed", contractId] });
			setPendingDeleteId(null);
			return true;
		} catch (err) {
			toast.error(extractErrorMessage(err, "Failed to delete document"));
			return false;
		}
	};

	return (
		<CustomCard className="border-none p-0 bg-white">
			<SectionTitle title="Document Uploaded" />

			<div className="mt-8 flex flex-col gap-y-6">
				<h6 className="text-sm">Signed Contract</h6>
				<div className="flex items-center gap-6 flex-wrap pb-3">
					{signedLoading && <div className="text-sm text-muted-foreground">Loading signed contract...</div>}
					{signedError && <div className="text-sm text-destructive">Failed to load signed contract</div>}

					{!signedLoading && signedDocs.length === 0 && (
						<div className="text-sm text-muted-foreground">No signed contract uploaded.</div>
					)}

					{signedDocs.map((d, idx) => (
						<div key={(d as { id?: string }).id ?? idx} className="relative flex flex-col items-start gap-2.5 w-20">
							<Link
								to={d.fileUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex flex-col items-start gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
								<Image src={getFileIcon(d.fileUrl, media.images)} className="w-14 rounded-md" />
								<div className="text-xs text-muted-foreground text-start">Document</div>
							</Link>
							{canDelete && (d as { id?: string }).id && (
								<button
									type="button"
									aria-label="Delete signed contract document"
									title="Delete document"
									className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border border-red-100 bg-white text-destructive shadow-sm hover:bg-red-50"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										setPendingDeleteId((d as { id: string }).id);
									}}>
									<IconWrapper className="text-xs">
										<TrashIcon />
									</IconWrapper>
								</button>
							)}
						</div>
					))}
				</div>
			</div>

			<ConfirmModal
				open={!!pendingDeleteId}
				onOpenChange={(open) => {
					if (!open) setPendingDeleteId(null);
				}}
				title="Delete document?"
				subtitle="This will permanently remove this signed contract file. This cannot be undone."
				actions={[
					{
						label: "Cancel",
						variant: "outline",
						onClick: () => setPendingDeleteId(null),
					},
					{
						label: deleteMutation.isPending ? "Deleting..." : "Delete",
						variant: "danger",
						loading: deleteMutation.isPending,
						closeOnClick: false,
						onClick: handleConfirmDelete,
					},
				]}
			/>
		</CustomCard>
	);
}
