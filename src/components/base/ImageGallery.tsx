import React from "react";
import Image from "./Image";
import { twMerge } from "tailwind-merge";
import { IconWrapper, UploadCloudIcon } from "../../assets/icons";
import ActionButton from "./ActionButton";

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
	onChange?: (files: File[]) => void; // upload handler
	placeholderText?: string;
	uploadButtonText?: string;
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
}: Props) {
	const imgs = Array.isArray(images) ? images : images ? [images] : [];
	const [selected, setSelected] = React.useState(0);

	const borderClass = (i: number) => {
		if (thumbVariant === "none") return "border-transparent";
		if (thumbVariant === "solid") return i === selected ? "border-gray-300" : "border-gray-200";
		return i === selected ? "border-dashed border-2" : "border-dashed border-2"; // dashed
	};

	// local images state when component manages images internally (demo friendly)
	const [localImgs, setLocalImgs] = React.useState<string[]>(imgs);
	const inputRef = React.useRef<HTMLInputElement | null>(null);
	const effectiveImgs = localImgs.length ? localImgs : imgs;

	const handleFiles = (files?: FileList | null) => {
		if (!files) return;
		const arr = Array.from(files);
		if (onChange) onChange(arr);
		// if no onChange provided, we still allow preview by creating object URLs
		if (!onChange) {
			const urls = arr.map((f) => URL.createObjectURL(f));
			setLocalImgs((s) => [...s, ...urls]);
		}
	};

	// (removed small add button) only main upload control remains

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
			<div className={twMerge(`rounded-md p-6 flex flex-grow items-center justify-center relative min-h-52`, containerBg, containerBorderClass)}>
				{effectiveImgs[selected] ? (
					<Image src={effectiveImgs[selected]} alt={`image-${selected}`} className="w-52" />
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
							className="gap-2 font-normal rounded-sm"
							onClick={() => {
								inputRef.current?.click();
							}}>
							<span>{uploadButtonText}</span>
							<IconWrapper>
								<UploadCloudIcon />
							</IconWrapper>
						</ActionButton>
					</div>
				)}
			</div>

			{effectiveImgs && effectiveImgs.length > 1 && (
				<div className="flex items-center gap-3 mt-2">
					{effectiveImgs.map((s, i) => (
						<div
							key={i}
							className={`rounded-md p-1 ${
								thumbBg === "white" ? "bg-white" : thumbBg === "transparent" ? "bg-transparent" : thumbBg
							} border ${borderClass(i)} cursor-pointer`}
							onClick={() => setSelected(i)}>
							<Image src={s} alt={`thumb-${i}`} className="w-20 h-14 p-2 object-contain" />
						</div>
					))}
				</div>
			)}
		</div>
	);
}
