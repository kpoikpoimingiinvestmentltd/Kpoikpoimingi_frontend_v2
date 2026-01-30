import React from "react";
import { FileIcon, IconWrapper, UploadCloudIcon, CloseIcon } from "@/assets/icons";
import { Spinner } from "@/components/ui/spinner";

type Props = {
	placeholder?: string;
	hint?: string;
	onChange?: (files: File[]) => void | Promise<void>;
	isUploading?: boolean;
	isUploaded?: boolean;
	uploadedFiles?: { name: string; onRemove?: () => void }[];
	multiple?: boolean;
};

export default function UploadBox({
	placeholder = "Upload document",
	hint = "PNG, JPG, PDF Only",
	onChange,
	isUploading = false,
	isUploaded = false,
	uploadedFiles = [],
	multiple = false,
}: Props) {
	const inputRef = React.useRef<HTMLInputElement | null>(null);
	const [localUploading, setLocalUploading] = React.useState(false);

	const handleFiles = async (files?: FileList | null) => {
		if (!files) return;
		const arr = Array.from(files);

		// Set local loading state if onChange is async
		if (onChange) {
			setLocalUploading(true);
			try {
				const result = onChange(arr);
				if (result instanceof Promise) {
					await result;
				}
			} finally {
				setLocalUploading(false);
			}
		}
	};

	const isCurrentlyUploading = isUploading || localUploading;

	return (
		<div>
			<input ref={inputRef} type="file" className="hidden" multiple={multiple} onChange={(e) => handleFiles(e.target.files)} />
			<div
				role="button"
				tabIndex={0}
				onClick={() => !isCurrentlyUploading && inputRef.current?.click()}
				onKeyDown={(e) => (e.key === "Enter" && !isCurrentlyUploading ? inputRef.current?.click() : null)}
				className="border-dashed border-2 border-gray-200 dark:border-neutral-500 text-black dark:text-gray-300 rounded-md p-8 flex flex-col items-center justify-center cursor-pointer">
				{isCurrentlyUploading ? (
					<>
						<Spinner className="size-6 text-primary" />
						<p className="mt-3 text-sm text-muted-foreground">Uploading...</p>
					</>
				) : isUploaded ? (
					<>
						<IconWrapper className="text-3xl">
							<FileIcon />
						</IconWrapper>
						<p className="mt-3 text-sm">File uploaded</p>
						<p className="mt-1 text-xs text-primary font-medium">Click to replace</p>
					</>
				) : (
					<>
						<IconWrapper className="text-xl">
							<UploadCloudIcon />
						</IconWrapper>
						<p className="mt-3 text-sm">{placeholder}</p>
					</>
				)}
			</div>
			<div className="text-xs text-muted-foreground text-center mt-2">{hint}</div>

			{uploadedFiles.length > 0 && (
				<div className="mt-4 space-y-2">
					{uploadedFiles.map((file, index) => (
						<div
							key={index}
							className="flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-md dark:bg-primary/50 bg-white hover:bg-gray-50 transition-colors">
							<div className="flex items-center gap-2 flex-1 min-w-0">
								<IconWrapper className="text-lg flex-shrink-0">
									<FileIcon />
								</IconWrapper>
								<span className="text-sm truncate dark:text-white overflow-hidden">{file.name}</span>
							</div>
							{file.onRemove && (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										file.onRemove?.();
									}}
									className="ml-2 p-1 hover:bg-gray-200 dark:text-white rounded transition-colors flex-shrink-0"
									aria-label="Remove file">
									<IconWrapper className="text-base hover:text-red-500">
										<CloseIcon />
									</IconWrapper>
								</button>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
