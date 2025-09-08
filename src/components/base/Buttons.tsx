import { ArrowLeftIcon, ChevronLeftIcon, IconWrapper } from "@/assets/icons";
import { X } from "lucide-react";
import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";

export function BackButton({
	arrow = true,
	title,
	grouped = false,
	className = "",
}: {
	arrow?: boolean;
	title?: string;
	grouped?: boolean;
	className?: string;
}) {
	const navigate = useNavigate();

	const baseBtn = twMerge("border p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition", className);

	if (!grouped) {
		return (
			<div className="flex items-center gap-3">
				<button type="button" className={baseBtn} onClick={() => navigate(-1)}>
					<IconWrapper>{arrow ? <ArrowLeftIcon /> : <ChevronLeftIcon />}</IconWrapper>
				</button>
				{title && <h4 className="font-medium">{title}</h4>}
			</div>
		);
	}

	return (
		<button type="button" className={twMerge(baseBtn, "flex items-center gap-3")} onClick={() => navigate(-1)}>
			<IconWrapper>{arrow ? <ArrowLeftIcon /> : <ChevronLeftIcon />}</IconWrapper>
			{title && <span className="font-medium">{title}</span>}
		</button>
	);
}

export const CloseModalButton = ({ onClose }: { onClose?: () => void }) => (
	<button type="button" className="p-1 aspect-square rounded-full bg-gray-100 dark:bg-neutral-800" onClick={onClose}>
		<IconWrapper className="text-sm">
			<X size={16} />
		</IconWrapper>
	</button>
);
