import { twMerge } from "tailwind-merge";
import { media } from "../../resources/images";
import Image from "../base/Image";

export default function EmptyData({ text = "Empty data", className = "" }: { text?: string; className?: string }) {
	return (
		<div className={twMerge(`flex-grow flex items-center justify-center`, className)}>
			<div className="flex flex-col items-center justify-center text-center gap-y-3">
				<Image src={media.images.empty} className="w-28" />
				{text && <p className="text-center mt-2">{text}</p>}
			</div>
		</div>
	);
}
