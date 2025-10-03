import { twMerge } from "tailwind-merge";

export default function SectionTitle({ title, children, className }: { title: string; children?: React.ReactNode; className?: string }) {
	return (
		<header className={twMerge(`flex justify-between items-center flex-wrap gap-x-4 gap-y-3`, className)}>
			<h4 className="font-medium">{title}</h4>
			{children && <>{children}</>}
		</header>
	);
}
