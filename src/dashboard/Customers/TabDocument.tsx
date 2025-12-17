import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import { Link } from "react-router";
import { getFileIcon } from "@/lib/utils";

export default function TabDocument({ documents }: { documents?: Record<string, unknown> | undefined }) {
	// normalize safe access
	const docs = (documents || {}) as Record<string, unknown>;

	const pickUrl = (item: unknown) => {
		if (!item) return null;
		if (typeof item === "string") return item;
		if (typeof item === "object") return (item as Record<string, unknown>).fileUrl ?? (item as Record<string, unknown>).url ?? null;
		return null;
	};

	const renderSection = (title: string, arr?: unknown[]) => {
		if (!arr || !Array.isArray(arr) || arr.length === 0) {
			return (
				<div className="max-w-xs flex flex-col gap-3">
					<h6 className="text-sm">{title}</h6>
					<div className="border-dashed border-2 min-h-40 border-gray-200 rounded-md p-8 flex flex-col items-center justify-center">
						<Image src={media.images.noImage} alt="No Document" className="w-16" />
						<p className="text-sm text-muted-foreground mt-4">No documents uploaded</p>
					</div>
				</div>
			);
		}

		return (
			<div className="max-w-xs flex flex-col gap-3">
				<h6 className="text-sm">{title}</h6>
				<div className="flex items-center gap-6 flex-wrap pb-3">
					{arr.map((it: unknown, i: number) => {
						const url = pickUrl(it);

						return (
							<div key={i} className="flex flex-col items-start gap-2.5 w-20">
								{url && typeof url === "string" ? (
									<Link
										to={url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex flex-col items-start gap-2.5 cursor-pointer hover:opacity-80 transition-opacity">
										<Image src={getFileIcon(url, media.images)} className="w-14 rounded-md" />
										<div className="text-xs text-muted-foreground text-start">Document</div>
									</Link>
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

			<div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
				{renderSection("Identification Documents", Array.isArray(docs.identificationDocument) ? (docs.identificationDocument as unknown[]) : [])}
				{renderSection("Driver's License", Array.isArray(docs.driverLicense) ? (docs.driverLicense as unknown[]) : [])}
				{renderSection("Indigene Certificate", Array.isArray(docs.indegeneCertificate) ? (docs.indegeneCertificate as unknown[]) : [])}
				{renderSection("Guarantor (1) Documents", Array.isArray(docs.guarantor_0_doc) ? (docs.guarantor_0_doc as unknown[]) : [])}
				{renderSection("Guarantor (2) Documents", Array.isArray(docs.guarantor_1_doc) ? (docs.guarantor_1_doc as unknown[]) : [])}
				{renderSection("Signed Contract", Array.isArray(docs.signedContract) ? (docs.signedContract as unknown[]) : [])}
				{renderSection("Other Documents", Array.isArray(docs.other) ? (docs.other as unknown[]) : [])}
			</div>
		</CustomCard>
	);
}
