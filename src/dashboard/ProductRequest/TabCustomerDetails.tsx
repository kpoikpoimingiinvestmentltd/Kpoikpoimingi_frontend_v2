import CustomCard from "@/components/base/CustomCard";
import KeyValueRow from "@/components/common/KeyValueRow";
import { useState } from "react";
import { FileIcon, IconWrapper } from "@/assets/icons";
import Image from "@/components/base/Image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { media } from "@/resources/images";
import { modalContentStyle } from "../../components/common/commonStyles";

export default function TabCustomerDetails({ data }: { data: Record<string, unknown> }) {
	const customer = {
		name: (data?.fullName as string) || "N/A",
		email: (data?.email as string) || "N/A",
		whatsapp: (data?.phoneNumber as string) || "N/A",
		dob: (data?.dateOfBirth as string) || "N/A",
		paymentMethod: "Hire Purchase",
	};

	const firstFile = (keys: string[]) => {
		const mf = (data?.mediaFiles as Record<string, unknown>) || {};
		for (const k of keys) {
			const arr = mf[k] as Record<string, unknown>[];
			if (Array.isArray(arr) && arr.length > 0) return arr[0] as Record<string, unknown>;
		}
		return null;
	};

	const driversLicenseFile = firstFile(["driverLicense", "driver_license"]);
	const ninFile = firstFile(["identificationDocument", "nin", "identification"]);
	const indigeneFile = firstFile(["indegeneCertificate", "indigeneCertificate", "indigene_certificate"]);

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [previewLabel, setPreviewLabel] = useState<string | null>(null);

	const openPreview = (img: string, label?: string) => {
		setPreviewImage(img);
		setPreviewLabel(label ?? null);
		setPreviewOpen(true);
	};

	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<CustomCard className="mt-6 p-6 bg-card">
				<div className="grid grid-cols-1 gap-y-0.5 text-sm">
					<KeyValueRow label="Customers Name" value={customer.name} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow label="Email" value={customer.email} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow label="Whatsapp Number" value={customer.whatsapp} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow label="Date of Birth" value={customer.dob} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					<KeyValueRow
						label="Payment Method"
						value={customer.paymentMethod}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						className="items-center"
						label="Driver's License"
						variant="action"
						leftClassName="text-sm text-muted-foreground"
						action={
							driversLicenseFile ? (
								<button
									aria-label="View Driver's License"
									onClick={() => openPreview(driversLicenseFile.fileUrl as string, (driversLicenseFile.filename as string) || "Driver's License")}
									className="inline-flex items-center p-1">
									<IconWrapper className="text-4xl sm:text-5xl">
										<FileIcon />
									</IconWrapper>
								</button>
							) : (
								<span className="text-sm text-muted-foreground">Driver's license not uploaded yet</span>
							)
						}
					/>

					<KeyValueRow
						className="items-center"
						label="NIN (National Identification Number)"
						variant="action"
						leftClassName="text-sm text-muted-foreground"
						action={
							ninFile ? (
								<button
									aria-label="View NIN"
									onClick={() => openPreview(ninFile.fileUrl as string, (ninFile.filename as string) || "NIN")}
									className="inline-flex items-center p-1">
									<IconWrapper className="text-4xl sm:text-5xl">
										<FileIcon />
									</IconWrapper>
								</button>
							) : (
								<span className="text-sm text-muted-foreground">NIN not uploaded yet</span>
							)
						}
					/>

					<KeyValueRow
						className="items-center"
						label="Indigene certificate"
						variant="action"
						leftClassName="text-sm text-muted-foreground"
						action={
							indigeneFile ? (
								<button
									aria-label="View Indigene certificate"
									onClick={() => openPreview(indigeneFile.fileUrl as string, (indigeneFile.filename as string) || "Indigene certificate")}
									className="inline-flex items-center p-1">
									<IconWrapper className="text-4xl sm:text-5xl">
										<FileIcon />
									</IconWrapper>
								</button>
							) : (
								<span className="text-sm text-muted-foreground">Indigene certificate not uploaded yet</span>
							)
						}
					/>
				</div>
			</CustomCard>
			<Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
				<DialogContent className={modalContentStyle()}>
					<DialogHeader className="justify-center mt-5 flex-row">
						<DialogTitle>{previewLabel ?? "Document"}</DialogTitle>
					</DialogHeader>

					<div className="p-6">
						<div className="max-w-md mx-auto">
							{previewImage ? (
								<div className="border-dashed border-2 border-gray-200 flex items-center justify-center rounded-md p-4">
									<Image src={previewImage} className="max-w-full rounded-md" />
								</div>
							) : (
								<div className="border-dashed border-2 min-h-52 border-gray-200 rounded-md p-8 flex flex-col items-center justify-center">
									<Image src={media.images.noDocument} alt="No Document" className="w-16" />
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
