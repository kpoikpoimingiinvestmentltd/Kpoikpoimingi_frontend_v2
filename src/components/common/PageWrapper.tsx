import type React from "react";
import { twMerge } from "tailwind-merge";

export default function PageWrapper({ children, className = "" }: { children: React.ReactNode; className?: string }) {
	return <div className={twMerge("text-start w-full lg:w-11/12 flex flex-col gap-y-6", className)}>{children}</div>;
}
