import { useState } from "react";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import { Link } from "react-router";
import { formatDate, getFileIcon, extractErrorMessage } from "@/lib/utils";
import { IconWrapper, TrashIcon } from "@/assets/icons";
import ConfirmModal from "@/components/common/ConfirmModal";
import { useDeleteCustomerDocument } from "@/api/customer";
import { useQueryClient } from "@tanstack/react-query";
import { useIsSuperAdmin } from "@/hooks/usePermissions";
import { toast } from "sonner";

export type DocumentItem = {
	id?: string;
	fileUrl: string;
	uploadedAt?: string;
	label?: string;
};

export type DocumentBuckets = {
	identificationDocument: DocumentItem[];
	indegeneCertificate: DocumentItem[];
	driverLicense: DocumentItem[];
	guarantor_0_doc: DocumentItem[];
	guarantor_1_doc: DocumentItem[];
	signedContract: DocumentItem[];
	other: DocumentItem[];
};

export type DocumentGroup = {
	key: string;
	title: string;
	subtitle?: string;
	documents: DocumentBuckets;
};

const SECTIONS: { key: keyof DocumentBuckets; title: string }[] = [
	{ key: "identificationDocument", title: "Identification Documents" },
	{ key: "driverLicense", title: "Driver's License" },
	{ key: "indegeneCertificate", title: "Indigene Certificate" },
	{ key: "guarantor_0_doc", title: "Guarantor (1) Documents" },
	{ key: "guarantor_1_doc", title: "Guarantor (2) Documents" },
	{ key: "signedContract", title: "Signed Contract" },
	{ key: "other", title: "Other Documents" },
];

function hasAnyDocuments(buckets: DocumentBuckets) {
	return SECTIONS.some(({ key }) => (buckets[key]?.length ?? 0) > 0);
}

type DocumentGroupViewProps = {
	groups: DocumentGroup[];
	customerId?: string;
	contractId?: string;
	isLoading?: boolean;
	isError?: boolean;
	emptyMessage?: string;
};

export default function DocumentGroupView({
	groups,
	customerId,
	contractId,
	isLoading,
	isError,
	emptyMessage = "No documents uploaded yet.",
}: DocumentGroupViewProps) {
	const canDelete = useIsSuperAdmin();
	const queryClient = useQueryClient();
	const deleteMutation = useDeleteCustomerDocument();
	const [pendingDelete, setPendingDelete] = useState<{ id: string; label: string } | null>(null);

	const invalidate = async () => {
		if (customerId) {
			await queryClient.invalidateQueries({ queryKey: ["customer-documents", customerId] });
			await queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
		}
		if (contractId) {
			await queryClient.invalidateQueries({ queryKey: ["contract-documents", contractId] });
			await queryClient.invalidateQueries({ queryKey: ["contract-signed", contractId] });
		}
	};

	const handleConfirmDelete = async () => {
		if (!pendingDelete) return false;
		try {
			await deleteMutation.mutateAsync(pendingDelete.id);
			toast.success("Document deleted successfully");
			await invalidate();
			setPendingDelete(null);
			return true;
		} catch (err) {
			toast.error(extractErrorMessage(err, "Failed to delete document"));
			return false;
		}
	};

	const renderSection = (title: string, items: DocumentItem[]) => {
		if (!items.length) {
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
					{items.map((item, index) => (
						<div key={item.id ?? `${title}-${index}`} className="relative flex flex-col items-start gap-2.5 w-20">
							<Link
								to={item.fileUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex flex-col items-start gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
								<Image src={getFileIcon(item.fileUrl, media.images)} className="w-14 rounded-md" />
								<div className="text-xs text-muted-foreground text-start">
									{item.uploadedAt ? formatDate(item.uploadedAt) : "Document"}
								</div>
							</Link>
							{canDelete && item.id && (
								<button
									type="button"
									aria-label={`Delete ${title} document`}
									title="Delete document"
									className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border border-red-100 bg-white text-destructive shadow-sm hover:bg-red-50"
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										if (!item.id) return;
										setPendingDelete({ id: item.id, label: title });
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
		);
	};

	if (isLoading) {
		return <div className="text-sm text-muted-foreground py-4">Loading documents...</div>;
	}

	if (isError) {
		return <div className="text-sm text-destructive py-4">Failed to load documents</div>;
	}

	if (!groups.length) {
		return <div className="text-sm text-muted-foreground py-4">{emptyMessage}</div>;
	}

	const visibleGroups = groups.filter((group) => hasAnyDocuments(group.documents));

	if (!visibleGroups.length) {
		return <div className="text-sm text-muted-foreground py-4">{emptyMessage}</div>;
	}

	return (
		<>
			<div className="flex flex-col gap-8">
				{visibleGroups.map((group) => (
					<div key={group.key} className="rounded-lg border border-border/60 bg-muted/20 p-4 md:p-6">
						<div className="mb-6 border-b border-border/50 pb-4">
							<h5 className="text-base font-semibold text-foreground">{group.title}</h5>
							{group.subtitle && <p className="mt-1 text-sm text-muted-foreground">{group.subtitle}</p>}
						</div>

						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							{SECTIONS.filter(({ key }) => (group.documents[key]?.length ?? 0) > 0).map(({ key, title }) =>
								renderSection(title, group.documents[key] ?? []),
							)}
						</div>
					</div>
				))}
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
		</>
	);
}
