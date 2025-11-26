import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
// Link import kept for potential future use

export default function TabDocument({ documents }: { documents?: Record<string, unknown> | undefined }) {
	// normalize safe access
	const docs = (documents || {}) as Record<string, any>;

	const pickUrl = (item: any) => {
		if (!item) return null;
		if (typeof item === "string") return item;
		if (typeof item === "object") return item.fileUrl ?? item.url ?? null;
		return null;
	};

	const renderSection = (title: string, arr?: any[]) => {
		if (!arr || !Array.isArray(arr) || arr.length === 0) {
			return (
				<div>
					<h6 className="text-sm">{title}</h6>
					<div className="border-dashed border-2 min-h-40 border-gray-200 rounded-md p-8 flex flex-col items-center justify-center">
						<Image src={media.images.noDocument} alt="No Document" className="w-16" />
						<p className="text-sm text-muted-foreground mt-4">No documents uploaded</p>
					</div>
				</div>
			);
		}

		return (
			<div>
				<h6 className="text-sm">{title}</h6>
				<div className="flex items-center gap-6 flex-wrap pb-3">
					{arr.map((it: any, i: number) => {
						const url = pickUrl(it);
						const isPdf = typeof url === "string" && url.toLowerCase().endsWith(".pdf");
						const label = it?.label || it?.name || (isPdf ? `Document ${i + 1}` : `Image ${i + 1}`);

						return (
							<div key={i} className="flex flex-col items-start gap-2.5 w-36">
								{url ? (
									<a href={url} target="_blank" rel="noreferrer" download className="flex flex-col items-start gap-2.5">
										<Image src={isPdf ? media.images.pdfImage : url} className={isPdf ? "w-14 rounded-md" : "max-w-sm rounded-md"} />
										<div className="text-xs text-muted-foreground text-start break-words">{label}</div>
									</a>
								) : (
									<div className="flex flex-col items-start gap-2.5">
										<Image src={media.images.noDocument} alt="No Document" className="w-16" />
										<div className="text-xs text-muted-foreground text-start">{label}</div>
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

			<div className="mt-6 space-y-6">
				{renderSection("Identification Documents", docs.identificationDocument as any[])}
				{renderSection("Driver's License", docs.driverLicense as any[])}
				{renderSection("Indigene Certificate", docs.indegeneCertificate as any[])}
				{renderSection("Guarantor (1) Documents", docs.guarantor_0_doc as any[])}
				{renderSection("Guarantor (2) Documents", docs.guarantor_1_doc as any[])}
				{renderSection("Signed Contract", docs.signedContract as any[])}
				{renderSection("Other Documents", docs.other as any[])}
			</div>
		</CustomCard>
	);
}
