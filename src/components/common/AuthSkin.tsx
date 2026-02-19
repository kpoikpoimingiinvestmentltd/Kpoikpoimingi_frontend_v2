import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import type React from "react";

type Props = {
	children: React.ReactNode;
	title?: string;
	subtitle?: string;
};
export default function AuthSkin({ children, title, subtitle }: Props) {
	return (
		<>
			<Image src={media.logos.logo} className="w-28 md:w-36 mx-auto" />
			<section className="mt-4 flex flex-col gap-y-10 max-w-sm mx-auto">
				<header className="text-center flex flex-col items-center gap-y-2">
					<h3 className="text-2xl dark:text-black font-semibold">{title}</h3>
					<p className="max-w-md dark:text-black/70 text-muted-foreground text-sm block">{subtitle}</p>
				</header>
				<div>{children}</div>
			</section>
		</>
	);
}
