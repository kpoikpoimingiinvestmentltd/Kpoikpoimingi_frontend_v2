import React from "react";
import { IconWrapper, UploadCloudIcon } from "@/assets/icons";

type Props = {
	placeholder?: string;
	hint?: string;
	onChange?: (files: File[]) => void;
};

export default function UploadBox({ placeholder = "Upload document", hint = "PNG, JPG, PDF Only", onChange }: Props) {
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	const handleFiles = (files?: FileList | null) => {
		if (!files) return;
		const arr = Array.from(files);
		onChange?.(arr);
	};

	return (
		<div>
			<input ref={inputRef} type="file" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
			<div
				role="button"
				tabIndex={0}
				onClick={() => inputRef.current?.click()}
				onKeyDown={(e) => (e.key === "Enter" ? inputRef.current?.click() : null)}
				className="border-dashed border-2 border-gray-200 rounded-md p-8 flex flex-col items-center justify-center cursor-pointer">
				<IconWrapper className="text-xl">
					<UploadCloudIcon />
				</IconWrapper>
				<p className="mt-3 text-sm">{placeholder}</p>
			</div>
			<div className="text-xs text-muted-foreground text-center mt-2">{hint}</div>
		</div>
	);
}
