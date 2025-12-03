import CustomCard from "@/components/base/CustomCard";
import KeyValueRow from "@/components/common/KeyValueRow";
import SectionTitle from "@/components/common/SectionTitle";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "@/components/base/Image";
import { FileIcon, IconWrapper } from "@/assets/icons";
import { modalContentStyle } from "../../components/common/commonStyles";
import React from "react";

export default function TabGuarantorDetails({ data }: { data: Record<string, unknown> }) {
	const guarantors = (data?.guarantors as Record<string, unknown>[]) || [];
	const [previewOpen, setPreviewOpen] = React.useState(false);
	const [previewImage, setPreviewImage] = React.useState<string | null>(null);
	const [previewLabel, setPreviewLabel] = React.useState<string | null>(null);

	const openPreview = (img: string, label?: string) => {
		setPreviewImage(img);
		setPreviewLabel(label ?? null);
		setPreviewOpen(true);
	};

	return (
		<CustomCard className="border-none p-0 h-auto">
			{guarantors.length === 0 ? (
				<p className="text-muted-foreground">No guarantors found</p>
			) : (
				<div className="flex flex-col gap-y-4">
					{guarantors.map((g: Record<string, unknown>, i: number) => (
						<div key={i}>
							<SectionTitle title={`Guarantor ${i + 1}`} />
							<CustomCard className="grid grid-cols-1 gap-y-1 mt-4 bg-card">
								<KeyValueRow
									label="Full name"
									value={(g.fullName as string) || "N/A"}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								<KeyValueRow
									label="Occupation"
									value={(g.occupation as string) || "N/A"}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								<KeyValueRow
									label="Phone Number"
									value={(g.phoneNumber as string) || "N/A"}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								<KeyValueRow
									label="Email"
									value={(g.email as string) || "N/A"}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								<KeyValueRow
									label="Employment Status"
									value={(g.employmentStatusId as string) || "N/A"}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								<KeyValueRow
									label="Home address"
									value={(g.homeAddress as string) || "N/A"}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								<KeyValueRow
									label="State Of Origin"
									value={(g.stateOfOrigin as string) || "N/A"}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
								<KeyValueRow
									className="items-center"
									label="Documents"
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
									variant="action"
									action={(() => {
										const mf = (data?.mediaFiles as Record<string, unknown>) || {};
										const arr = mf[`guarantor_${i}_doc`] as Record<string, unknown>[];
										if (Array.isArray(arr) && arr.length > 0) {
											const file = arr[0] as Record<string, unknown>;
											const url = (file?.fileUrl as string) || (file?.url as string) || "";
											const label = (file?.filename as string) || (url ? url.split("/").pop()?.split("?")[0] : `Guarantor ${i + 1} doc`);
											return (
												<button
													aria-label={`View guarantor ${i + 1} document`}
													onClick={() => url && openPreview(url, label)}
													className="inline-flex items-center p-1">
													<IconWrapper className="text-4xl sm:text-5xl">
														<FileIcon />
													</IconWrapper>
												</button>
											);
										}

										return <span className="text-sm text-muted-foreground">No documents uploaded</span>;
									})()}
								/>
							</CustomCard>
						</div>
					))}
				</div>
			)}
			<Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
				<DialogContent className={modalContentStyle()}>
					<DialogHeader className="justify-center mt-5 flex-row">
						<DialogTitle>{previewLabel ?? "Document"}</DialogTitle>
					</DialogHeader>

					<div className="p-6">
						<div className="max-w-md mx-auto">
							{previewImage ? (
								<div className="border-dashed border-2 border-gray-200 flex items-center justify-center rounded-md p-4">
									<Image src={previewImage} className="max-w-full min-h-64 rounded-md" />
								</div>
							) : (
								<div className="border-dashed border-2 min-h-52 border-gray-200 rounded-md p-8 flex flex-col items-center justify-center">
									<p className="text-sm text-muted-foreground mt-4">Not available</p>
								</div>
							)}
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</CustomCard>
	);
}
