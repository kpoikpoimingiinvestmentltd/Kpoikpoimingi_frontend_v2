import * as React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { FileIcon, IconWrapper } from "../../assets/icons";
import { twMerge } from "tailwind-merge";

type FileItem = { url: string; label?: string };

type Props = {
	label: React.ReactNode;
	/** main value for text or action variants */
	value?: React.ReactNode;
	className?: string;
	copyable?: boolean;
	leftClassName?: string;
	rightClassName?: string;
	leftProps?: React.HTMLAttributes<HTMLDivElement>;
	rightProps?: React.HTMLAttributes<HTMLDivElement>;
	/** optional node rendered to the far right (e.g. Edit button) */
	action?: React.ReactNode;
	/** when true value is rendered as a subtle link */
	link?: boolean;
	href?: string;
	/** variant: 'text' = simple text, 'action' = show action node, 'files' = show downloadable icons */
	variant?: "text" | "action" | "files";
	/** files to render when variant='files' */
	files?: FileItem[];
	actionClassName?: string;
};

export default function KeyValueRow({
	label,
	value,
	className = "",
	copyable = false,
	leftClassName,
	rightClassName,
	leftProps,
	rightProps,
	action,
	href = "",
	link = false,
	variant = "text",
	files,
	actionClassName,
}: Props) {
	const handleCopy = async () => {
		try {
			if (typeof value === "string") await navigator.clipboard.writeText(value);
		} catch (e) {}
	};

	return (
		<div className={twMerge(`flex items-start justify-between py-2 gap-4`, className)}>
			<aside {...(leftProps || {})} className={`text-start text-wrap`}>
				<p className={twMerge("text-muted-foreground text-sm", leftClassName)}>{label}</p>
			</aside>

			<aside {...(rightProps || {})} className={twMerge(`flex items-center gap-4 justify-end max-w-[120px]`, rightClassName)}>
				<div className="flex-1 text-right">
					{variant === "text" ? (
						link ? (
							<Link to={href} className="text-primary underline-offset-2 hover:underline text-sm">
								{value}
							</Link>
						) : (
							<div className="text-sm text-balance sm:text-nowrap">{value}</div>
						)
					) : variant === "action" ? (
						<div className="text-sm">{value}</div>
					) : (
						<div />
					)}
				</div>

				{copyable ? (
					<Button variant="ghost" size="sm" onClick={handleCopy}>
						<span className="sr-only">Copy</span>
						📋
					</Button>
				) : null}

				{variant === "action" && action ? <div className={`flex items-center ${actionClassName || ""}`}>{action}</div> : null}

				{variant === "files" && files && files.length ? (
					<div className="flex flex-col items-end space-y-3">
						{files.map((f, i) => (
							<Link key={i} to={f.url} download className="inline-flex items-center p-1" aria-label={f.label || `Download file ${i + 1}`}>
								<IconWrapper className="text-4xl sm:text-5xl">
									<FileIcon />
								</IconWrapper>
							</Link>
						))}
					</div>
				) : null}
			</aside>
		</div>
	);
}
