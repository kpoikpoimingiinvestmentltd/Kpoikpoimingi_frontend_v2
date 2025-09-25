import { twMerge } from "tailwind-merge";

export default function Image({ src, className = "", alt = "" }: { src: string; className?: string; alt?: string }) {
	return (
		<figure className={`${twMerge(className)} flex items-center justify-center`}>
			<img src={src} alt={alt} className="w-full h-auto max-w-full" />
		</figure>
	);
}
