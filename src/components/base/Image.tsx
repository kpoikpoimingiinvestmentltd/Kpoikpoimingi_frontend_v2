import { twMerge } from "tailwind-merge";

export default function Image({
	src,
	className = "",
	alt = "",
	objectFit = "cover",
}: {
	src: string;
	className?: string;
	alt?: string;
	objectFit?: "cover" | "contain";
}) {
	return (
		<figure className={`${twMerge(className)} flex items-center justify-center`}>
			<img
				src={src}
				alt={alt}
				className={twMerge(
					"w-full h-full max-w-full",
					objectFit === "contain" ? "object-contain" : "object-cover object-top",
				)}
			/>
		</figure>
	);
}
