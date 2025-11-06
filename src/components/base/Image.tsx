import { twMerge } from "tailwind-merge";

export default function Image({ src, className = "", alt = "" }: { src: string; className?: string; alt?: string }) {
	return (
		<figure className={`${twMerge(className)} flex items-center justify-center`}>
			<img src={src} alt={alt} className="w-full h-full object-cover object-top max-w-full" />
		</figure>
	);
}
