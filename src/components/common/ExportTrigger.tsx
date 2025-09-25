import { twMerge } from "tailwind-merge";
import { ExportFileIcon, IconWrapper } from "../../assets/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function ExportTrigger({ title, className }: { title?: string; className?: string }) {
	return (
		<Popover>
			<PopoverTrigger className={twMerge("flex items-center gap-2 underline-offset-2 underline", className)}>
				<IconWrapper>
					<ExportFileIcon />
				</IconWrapper>
				{title && <span>{title}</span>}
			</PopoverTrigger>
			<PopoverContent>Place content for the popover here.</PopoverContent>
		</Popover>
	);
}
