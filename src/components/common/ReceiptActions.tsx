import React, { useCallback } from "react";
import { IconWrapper, PrinterIcon, ShareIcon, DownloadCloudIcon } from "@/assets/icons";
import Image from "@/components/base/Image";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";

type ActionItem = {
	label: string;
	icon?: React.ReactNode;
	action?: () => void;
};

type ShareItem = { label: string; src: string; onSelect: () => void };

type Props = {
	actions?: ActionItem[];
	shareItems?: ShareItem[];
	showPrint?: boolean;
	onPrint?: () => void;
	showShare?: boolean;
	showDownload?: boolean;
	onDownload?: () => void;
};

export default function ReceiptActions({
	actions = [],
	shareItems,
	showPrint = true,
	onPrint,
	showShare = true,
	showDownload = true,
	onDownload,
}: Props) {
	const handleEmail = useCallback(() => {
		const subject = encodeURIComponent("Receipt from Kpoikpoimingi");
		const body = encodeURIComponent("Please find attached the receipt.");
		window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
	}, []);

	const handleWhatsApp = useCallback(() => {
		const text = encodeURIComponent("Please find the receipt attached.");
		window.open(`https://wa.me/?text=${text}`, "_blank");
	}, []);

	const finalActions: ActionItem[] = actions.length
		? actions
		: [
				...(showPrint ? [{ label: "Print", icon: <PrinterIcon />, action: onPrint }] : []),
				...(showShare ? [{ label: "Share", icon: <ShareIcon />, action: undefined }] : []),
				...(showDownload ? [{ label: "Download", icon: <DownloadCloudIcon />, action: onDownload }] : []),
		  ];

	const renderShareMenu = () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="flex active-scale items-center gap-2 p-2 px-3 bg-primary/10 rounded-sm hover:bg-primary/60 text-primary hover:text-white">
					<IconWrapper>
						<ShareIcon />
					</IconWrapper>
					<span className="hidden min-[450px]:text-sm min-[450px]:inline-block min-[600px]:text-sm">Share</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="shadow-md px-2">
				<DropdownMenuLabel>Share to</DropdownMenuLabel>
				{(
					shareItems || [
						{ label: "Email", src: "/", onSelect: handleEmail },
						{ label: "Whatsapp", src: "/", onSelect: handleWhatsApp },
					]
				).map((opt) => (
					<DropdownMenuItem key={opt.label} onSelect={opt.onSelect} className="cursor-pointer py-1.5 px-3">
						<Image src={opt.src} className="w-5" />
						<span>{opt.label}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);

	return (
		<div className="flex items-center gap-2">
			{finalActions.map((action, index) => {
				if (action.label.toLowerCase() === "share") {
					return <span key={index}>{renderShareMenu()}</span>;
				}

				return (
					<button
						key={index}
						onClick={action.action}
						className="flex active-scale items-center gap-2 p-2 px-3 bg-primary/10 rounded-sm hover:bg-primary/60 text-primary hover:text-white">
						<IconWrapper>{action.icon}</IconWrapper>
						<span className="hidden min-[450px]:text-sm min-[450px]:inline-block min-[600px]:text-sm">{action.label}</span>
					</button>
				);
			})}
		</div>
	);
}
