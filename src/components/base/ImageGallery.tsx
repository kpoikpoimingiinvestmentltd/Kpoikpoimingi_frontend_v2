import React from "react";
import Image from "./Image";
import { twMerge } from "tailwind-merge";
import { IconWrapper, UploadCloudIcon, CloseIcon } from "../../assets/icons";
import ActionButton from "./ActionButton";
import { Spinner } from "@/components/ui/spinner";

type ThumbVariant = "dashed" | "solid" | "none";

type ContainerBorder = "none" | "solid" | "dashed";
type UploadButtonPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "center";

type Props = {
	images?: string[] | string;
	className?: string;
	thumbVariant?: ThumbVariant;
	thumbBg?: "transparent" | "white" | string;
	mode?: "upload" | "view"; // upload shows upload controls, view is read-only
	containerBorder?: ContainerBorder;
	containerBg?: string; // tailwind or raw color
	uploadButtonPosition?: UploadButtonPosition;
	onChange?: (files: File[]) => void | Promise<void>; // upload handler
	placeholderText?: string;
	uploadButtonText?: string;
	labelText?: string;
	uploadedImages?: { src: string; onRemove?: () => void }[];
	isUploading?: boolean;
	isUploaded?: boolean;
};

export default function ImageGallery({
	images,
	className = "",
	thumbVariant = "dashed",
	thumbBg = "transparent",
	mode = "view",
	containerBorder = "dashed",
	containerBg = "bg-[#f3fbff]",
	uploadButtonPosition = "top-right",
	onChange,
	placeholderText = "Upload Voters card",
	uploadButtonText = "Upload",
	labelText = "Property Image",
	uploadedImages = [],
	isUploading = false,
}: Props) {
	const imgs = Array.isArray(images) ? images : images ? [images] : [];
	const [selected, setSelected] = React.useState(0);

	const thumbBorderClass = (i: number) => {
		if (thumbVariant === "none") return "border-transparent";
		if (thumbVariant === "solid") return `${i === selected ? "border-primary" : "border-stone-100"} border-2`;
		// dashed
		return `${i === selected ? "border-primary" : "border-transparent"} border-dashed border-2`;
	};

	// local images state when component manages images internally (demo friendly)
	const [localImgs, setLocalImgs] = React.useState<string[]>(imgs);
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	// Combine uploaded images with local images for display
	const uploadedImageSrcs = uploadedImages.map((img) => img.src);
	const effectiveImgs = [...uploadedImageSrcs, ...(localImgs.length ? localImgs : imgs)];

	const handleFiles = async (files?: FileList | null) => {
		if (!files) return;
		const arr = Array.from(files);

		// Set loading state if onChange is provided
		if (onChange) {
			const result = onChange(arr);
			// Handle both Promise and void returns
			if (result && typeof result === "object" && "then" in result) {
				await result;
			}
		} else {
			// if no onChange provided, we still allow preview by creating object URLs
			const urls = arr.map((f) => URL.createObjectURL(f));
			setLocalImgs((s) => [...s, ...urls]);
		}
	}; // (removed small add button) only main upload control remains

	const containerBorderClass = containerBorder === "none" ? "border-0" : containerBorder === "solid" ? "border" : "border-dashed border-2";

	if (!effectiveImgs.length && mode === "view") {
		return (
			<div className={twMerge(`rounded-md p-6 flex items-center justify-center`, className, containerBg, containerBorderClass)}>
				<div className="text-sm text-muted-foreground">No image available</div>
			</div>
		);
	}

	return (
		<div className={`${twMerge("flex flex-col gap-4", className)}`}>
			<div className={twMerge(`rounded-md p-6 flex flex-grow items-center justify-center relative md:h-56 h-92`, containerBg, containerBorderClass)}>
				<div className="absolute top-4 left-4">{mode === "view" && <p className="text-sm text-black">{labelText}</p>}</div>

				{effectiveImgs[selected] ? (
					<Image src={effectiveImgs[selected]} alt={`image-${selected}`} className="w-full md:w-52 h-52 md:h-40 object-center" />
				) : (
					<div className="flex items-center justify-center gap-y-3 flex-col text-center text-black">
						<IconWrapper className="text-2xl rotate-y-180">
							<UploadCloudIcon />
						</IconWrapper>
						<p className="text-sm">{placeholderText}</p>
					</div>
				)}

				{mode === "upload" && (
					<div
						className={`absolute ${
							uploadButtonPosition === "top-right"
								? "top-4 right-4"
								: uploadButtonPosition === "top-left"
								? "top-4 left-4"
								: uploadButtonPosition === "bottom-right"
								? "bottom-4 right-4"
								: uploadButtonPosition === "bottom-left"
								? "bottom-4 left-4"
								: "inset-0 flex items-center justify-center"
						}`}>
						{/* hidden file input triggered by the ActionButton */}
						<input id="kkm-image-upload-input" ref={inputRef} type="file" className="hidden" multiple onChange={(e) => handleFiles(e.target.files)} />

						<ActionButton
							type="button"
							disabled={isUploading}
							className="gap-2 font-normal rounded-sm"
							onClick={() => {
								inputRef.current?.click();
							}}>
							{isUploading ? (
								<>
									<Spinner className="size-4" />
									<span>Uploading...</span>
								</>
							) : (
								<>
									<span>{uploadButtonText}</span>
									<IconWrapper>
										<UploadCloudIcon />
									</IconWrapper>
								</>
							)}
						</ActionButton>
					</div>
				)}
			</div>

			{effectiveImgs && effectiveImgs.length >= 1 && (
				<div className="flex items-center gap-3 mt-2">
					{uploadedImages.map((uploadedImg, idx) => (
						<div
							key={idx}
							className={`rounded-md p-1 ${
								thumbBg === "white" ? "bg-white" : thumbBg === "transparent" ? "bg-transparent" : thumbBg
							} ${thumbBorderClass(idx)} cursor-pointer relative group`}
							onClick={() => setSelected(idx)}>
							<Image src={uploadedImg.src} alt={`thumb-${idx}`} className="w-20 h-14 p-2 object-contain" />
							{uploadedImg.onRemove && (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										uploadedImg.onRemove?.();
									}}
									className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
									<IconWrapper>
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
