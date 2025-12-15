import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { CheckIcon, IconWrapper } from "@/assets/icons";
import ActionButton from "@/components/base/ActionButton";
import type { ReactNode } from "react";
import { inputStyle, modalContentStyle, selectTriggerStyle } from "./commonStyles";

export type CsvFieldType = "date" | "text" | "select";

export interface CsvField {
	key: string;
	label: string;
	type: CsvFieldType;
	placeholder?: string;
	options?: { value: string; label: string }[];
	required?: boolean;
}

interface CsvExportModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title?: string;
	subtitle?: string;
	fields: CsvField[];
	onExport: (formData: Record<string, string>) => Promise<{ success: boolean; message?: string; downloadUrl?: string }>;
	isLoading?: boolean;
	downloadFileName?: string;
	triggerButton?: ReactNode;
}

export default function CsvExportModal({
	open,
	onOpenChange,
	title = "Export As CSV",
	subtitle = "Filter the data you wish to export",
	fields,
	onExport,
	isLoading = false,
	downloadFileName = "export.csv",
	triggerButton,
}: CsvExportModalProps) {
	const [formData, setFormData] = useState<Record<string, string>>({});
	const [isExporting, setIsExporting] = useState(false);
	const [exportSuccess, setExportSuccess] = useState(false);
	const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleFieldChange = (key: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleExport = async () => {
		setIsExporting(true);
		setErrorMessage(null);

		try {
			const result = await onExport(formData);

			if (result.success) {
				setExportSuccess(true);
				if (result.downloadUrl) {
					setDownloadUrl(result.downloadUrl);
				}
			} else {
				setErrorMessage(result.message || "Export failed");
			}
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : "An error occurred");
		} finally {
			setIsExporting(false);
		}
	};

	const handleDownload = () => {
		if (downloadUrl) {
			const link = document.createElement("a");
			link.href = downloadUrl;
			link.download = downloadFileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	const handleClose = (isOpen: boolean) => {
		if (!isOpen) {
			// Reset form when closing
			setFormData({});
			setExportSuccess(false);
			setDownloadUrl(null);
			setErrorMessage(null);
		}
		onOpenChange(isOpen);
	};

	return (
		<>
			{triggerButton ? (
				<div onClick={() => onOpenChange(true)} role="button" tabIndex={0}>
					{triggerButton}
				</div>
			) : (
				<ActionButton type="button" className="bg-primary/10 text-primary gap-2 hover:bg-primary/20" onClick={() => onOpenChange(true)}>
					<span className="text-sm">Export CSV</span>
				</ActionButton>
			)}

			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className={modalContentStyle("md:max-w-xl")}>
					<DialogHeader>
						<DialogTitle className="text-center text-lg">{title}</DialogTitle>
						<div className="text-center text-sm text-muted-foreground mt-2">{subtitle}</div>
					</DialogHeader>

					{!exportSuccess ? (
						<div className="flex flex-col gap-6 mt-6">
							{/* Form Fields */}
							<div className="flex flex-col gap-4">
								{fields.map((field) => (
									<div key={field.key}>
										<label className="text-sm font-medium mb-2 block">
											{field.label}
											{field.required && <span className="text-red-500 ml-1">*</span>}
										</label>

										{field.type === "date" && (
											<Input
												type="date"
												value={formData[field.key] || ""}
												onChange={(e) => handleFieldChange(field.key, e.target.value)}
												className={inputStyle}
												placeholder={field.placeholder}
											/>
										)}

										{field.type === "text" && (
											<Input
												type="text"
												value={formData[field.key] || ""}
												onChange={(e) => handleFieldChange(field.key, e.target.value)}
												className={inputStyle}
												placeholder={field.placeholder}
											/>
										)}

										{field.type === "select" && field.options && (
											<Select value={formData[field.key] || ""} onValueChange={(value) => handleFieldChange(field.key, value)}>
												<SelectTrigger className={selectTriggerStyle()}>
													<SelectValue placeholder={field.placeholder || "Select an option"} />
												</SelectTrigger>
												<SelectContent>
													{field.options.map((option) => (
														<SelectItem key={option.value} value={option.value}>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										)}
									</div>
								))}
							</div>

							{/* Error Message */}
							{errorMessage && <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">{errorMessage}</div>}

							{/* Export Button */}
							<Button
								onClick={handleExport}
								disabled={isExporting || isLoading}
								className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-md">
								{isExporting || isLoading ? "Exporting..." : "Export Now"}
							</Button>
						</div>
					) : (
						<div className="flex flex-col gap-6 mt-6">
							{/* Success State */}
							<div className="flex flex-col items-center gap-3">
								<IconWrapper className="text-5xl text-green-500">
									<CheckIcon />
								</IconWrapper>
								<div className="text-center">
									<h3 className="font-semibold text-lg">Export Ready</h3>
									<p className="text-sm text-muted-foreground mt-1">Your CSV file is ready to download</p>
								</div>
							</div>

							{/* Download Button */}
							<Button onClick={handleDownload} className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-md">
								Download File
							</Button>

							{/* Close Button */}
							<Button onClick={() => handleClose(false)} variant="outline" className="w-full">
								Close
							</Button>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
