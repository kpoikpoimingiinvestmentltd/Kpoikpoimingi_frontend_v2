import { useState } from "react";
import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import { Link } from "react-router";
import { getFileIcon } from "@/lib/utils";
import { IconWrapper, TrashIcon } from "@/assets/icons";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useDeleteCustomerDocument } from "@/api/customer";
import { useQueryClient } from "@tanstack/react-query";
import { useIsSuperAdmin } from "@/hooks/usePermissions";
import { toast } from "sonner";
import { extractErrorMessage } from "@/lib/utils";

type DocItem = {
	id?: string;
	fileUrl?: string;
	url?: string;
};

export default function TabDocument({
	documents,
	customerId,
}: {
	documents?: Record<string, unknown> | undefined;
	customerId?: string;
}) {
	const docs = (documents || {}) as Record<string, unknown>;
	const canDelete = useIsSuperAdmin();
	const queryClient = useQueryClient();
	const deleteMutation = useDeleteCustomerDocument();
	const [pendingDelete, setPendingDelete] = useState<{ id: string; label: string } | null>(null);

	const pickUrl = (item: unknown) => {
		if (!item) return null;

		const asString =
			typeof item === "string"
				? item
				: typeof item === "object"
					? ((item as Record<string, unknown>).fileUrl ?? (item as Record<string, unknown>).url ?? null)
					: null;

		if (!asString || typeof asString !== "string") return null;

		const trimmed = asString.trim();
		const isLikelyUrl =
			trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/") || trimmed.startsWith("data:");

		return isLikelyUrl ? trimmed : null;
	};

	const pickId = (item: unknown): string | null => {
		if (!item || typeof item !== "object") return null;
		const id = (item as DocItem).id;
		return typeof id === "string" && id.length > 0 ? id : null;
	};

	const handleConfirmDelete = async () => {
		if (!pendingDelete) return false;
		try {
			await deleteMutation.mutateAsync(pendingDelete.id);
			toast.success("Document deleted successfully");
			if (customerId) {
				await queryClient.invalidateQueries({ queryKey: ["customer-documents", customerId] });
				await queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
			}
			setPendingDelete(null);
			return true;
		} catch (err) {
			toast.error(extractErrorMessage(err, "Failed to delete document"));
			return false;
		}
	};

	const renderSection = (title: string, arr?: unknown[]) => {
		if (!arr || !Array.isArray(arr) || arr.length === 0) {
			return (
				<div className="max-w-xs flex flex-col gap-3">
					<h6 className="text-sm">{title}</h6>
					<div className="rounded-md flex flex-col items-start justify-center">
						<Image src={media.images.noImage} alt="No Document" className="w-16" />
						<p className="text-xs text-muted-foreground mt-4">No documents uploaded</p>
					</div>
				</div>
			);
		}

		return (
			<div className="max-w-xs flex flex-col justify-center gap-3">
				<h6 className="text-sm">{title}</h6>
				<div className="flex items-center gap-6 flex-wrap pb-3">
					{arr.map((it: unknown, i: number) => {
						const url = pickUrl(it);
						const mediaId = pickId(it);

						return (
							<div key={mediaId ?? i} className="relative flex flex-col items-start gap-2.5 w-20">
								{url && typeof url === "string" ? (
									<>
										<Link
											to={url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex flex-col items-start gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
											<Image src={getFileIcon(url, media.images)} className="w-14 rounded-md" />
											<div className="text-xs text-muted-foreground text-start">Document</div>
										</Link>
										{canDelete && mediaId && (
											<button
												type="button"
												aria-label={`Delete ${title} document`}
												title="Delete document"
												className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border border-red-100 bg-white text-destructive shadow-sm hover:bg-red-50"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													setPendingDelete({ id: mediaId, label: title });
												}}>
												<IconWrapper className="text-xs">
													<TrashIcon />
												</IconWrapper>
											</button>
										)}
									</>
								) : (
									<div className="flex flex-col items-start gap-2.5">
										<Image src={media.images.noImage} alt="No Document" className="w-16" />
										<div className="text-xs text-muted-foreground text-start">Not provided</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<CustomCard className="border-none p-0 bg-white">
			<SectionTitle title="Document Uploaded" />

			<div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
				{renderSection(
					"Identification Documents",
					Array.isArray(docs.identificationDocument) ? (docs.identificationDocument as unknown[]) : [],
				)}
				{renderSection("Driver's License", Array.isArray(docs.driverLicense) ? (docs.driverLicense as unknown[]) : [])}
				{renderSection(
					"Indigene Certificate",
					Array.isArray(docs.indegeneCertificate) ? (docs.indegeneCertificate as unknown[]) : [],
				)}
				{renderSection("Guarantor (1) Documents", Array.isArray(docs.guarantor_0_doc) ? (docs.guarantor_0_doc as unknown[]) : [])}
				{renderSection("Guarantor (2) Documents", Array.isArray(docs.guarantor_1_doc) ? (docs.guarantor_1_doc as unknown[]) : [])}
				{renderSection("Signed Contract", Array.isArray(docs.signedContract) ? (docs.signedContract as unknown[]) : [])}
				{renderSection("Other Documents", Array.isArray(docs.other) ? (docs.other as unknown[]) : [])}
			</div>

			<ConfirmModal
				open={!!pendingDelete}
				onOpenChange={(open) => {
					if (!open) setPendingDelete(null);
				}}
				title="Delete document?"
				subtitle={
					pendingDelete
						? `This will permanently remove this ${pendingDelete.label.toLowerCase()} file. This cannot be undone.`
						: undefined
				}
				actions={[
					{
						label: "Cancel",
						variant: "outline",
						onClick: () => setPendingDelete(null),
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
