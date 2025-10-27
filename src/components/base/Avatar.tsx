import React from "react";
import { twMerge } from "tailwind-merge";
import { IconWrapper, UploadCloudIcon } from "@/assets/icons";
import Image from "@/components/base/Image";

type AvatarProps = {
	src?: string | null;
	alt?: string;
	size?: number; // pixels
	variant?: "view" | "editable";
	onChange?: (file: File | null, preview?: string) => void;
	className?: string;
};

export default function Avatar({ src = null, alt = "avatar", size = 128, variant = "view", onChange, className = "" }: AvatarProps) {
	const [preview, setPreview] = React.useState<string | null>(src);
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	React.useEffect(() => {
		setPreview(src ?? null);
	}, [src]);

	const handleFile = (file: File | null) => {
		if (!file) {
			setPreview(src ?? null);
			onChange?.(null);
			return;
		}

		const url = URL.createObjectURL(file);
		setPreview(url);
		onChange?.(file, url);
	};

	const baseClasses = twMerge(
		"bg-card rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden group",
		className
	);
	const overlayBtn =
		"flex items-center text-center flex-col gap-y-2 absolute justify-center inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition";

	return (
		<div className={baseClasses} style={{ width: size, height: size }}>
			{preview ? <Image src={preview} alt={alt} className="w-full h-full object-cover" /> : <div className="text-gray-400">No image</div>}

			{variant === "editable" && (
				<>
					<input
						ref={inputRef}
						type="file"
						accept="image/*"
						className="hidden"
						onChange={(e) => {
							const f = e.target.files && e.target.files[0];
							handleFile(f ?? null);
						}}
					/>

					<button type="button" onClick={() => inputRef.current?.click()} className={twMerge(overlayBtn)}>
						<IconWrapper className="text-lg">
							<UploadCloudIcon />
						</IconWrapper>
						<div className="text-sm">Upload Profile</div>
					</button>
				</>
			)}
		</div>
	);
}
