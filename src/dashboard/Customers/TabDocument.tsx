import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import { Link } from "react-router";

export default function TabDocument() {
	const signedDocs = Array.from({ length: 5 }).map((_, i) => ({ id: `s${i + 1}`, label: "Contract for 25kg gas cylinder", url: "#" }));
	const customerDocs = [
		{ id: "nin", title: "NIN", src: media.images.demoId },
		{ id: "dl", title: "Drivers License", src: media.images.demoId },
		{ id: "indigene", title: "Indigene certificate", src: null },
	];

	return (
		<CustomCard className="border-none p-0 bg-white">
			<SectionTitle title="Document Uploaded" />

			<div className="mt-8 flex flex-col gap-y-6">
				<h6 className="text-sm">Signed Contract</h6>
				<div className="flex items-center gap-6 flex-wrap pb-3">
					{signedDocs.map((d) => (
						<div key={d.id} className="flex flex-col items-start gap-2.5 w-20">
							<Link to={d.url} download={d.label} key={d.id} className="flex flex-col items-start gap-2.5">
								<Image src={media.images.pdfImage} className="w-14 rounded-md" />
								<div className="text-xs text-muted-foreground text-start">{d.label}</div>
							</Link>
						</div>
					))}
				</div>
			</div>

			<div className="mt-8 flex flex-col gap-y-6">
				<h6 className="text-sm">Customers document</h6>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{customerDocs.map((c) => (
						<div key={c.id} className="rounded-md">
							<div className="flex items-center justify-between mb-4">
								<p className="text-sm font-medium">{c.title}</p>
							</div>
							{c.src ? (
								<div className="border-dashed border-2 border-gray-200 flex items-center justify-center rounded-md p-4">
									<Image src={c.src} className="max-w-sm rounded-md" />
								</div>
							) : (
								<div className="border-dashed border-2 min-h-52 border-gray-200 rounded-md p-8 flex flex-col items-center justify-center">
									<Image src={media.images.noDocument} alt="No Document" className="w-16" />
									<p className="text-sm text-muted-foreground mt-4">Not a driver/car owner</p>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</CustomCard>
	);
}
