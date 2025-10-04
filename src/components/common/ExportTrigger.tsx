import { twMerge } from "tailwind-merge";
import { ExportFileIcon, IconWrapper, CSVIcon, PDFIcon } from "../../assets/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type ExportTriggerProps = {
	title?: string;
	className?: string;
	onSelect?: (format: "csv" | "pdf") => void;
};

export default function ExportTrigger({ title, className, onSelect }: ExportTriggerProps) {
	const handle = (format: "csv" | "pdf") => {
		onSelect?.(format);
		// default behavior could trigger download; leave hook for parent to implement
	};

	return (
		<Popover>
			<PopoverTrigger className={twMerge("flex items-center gap-2 underline-offset-[4px] underline", className)}>
				<IconWrapper>
					<ExportFileIcon />
				</IconWrapper>
				{title && <span>{title}</span>}
			</PopoverTrigger>

			<PopoverContent className="w-48 p-4 ml-4 md:ml-0 md:mr-4">
				<div className="text-sm font-medium mb-3">Export As</div>

				<div className="flex flex-col gap-3">
					<button onClick={() => handle("csv")} className="flex items-center gap-3 rounded text-sm text-gray-700" type="button">
						<IconWrapper className="text-2xl">
							<CSVIcon />
						</IconWrapper>
						<span>CSV</span>
					</button>

					<button onClick={() => handle("pdf")} className="flex items-center gap-3 rounded text-sm text-gray-700" type="button">
						<IconWrapper className="text-xl">
							<PDFIcon />
						</IconWrapper>
						<span>PDF</span>
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
