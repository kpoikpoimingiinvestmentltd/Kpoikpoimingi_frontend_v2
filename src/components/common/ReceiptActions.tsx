import React, { useCallback } from "react";
import { IconWrapper, PrinterIcon, ShareIcon, DownloadCloudIcon } from "@/assets/icons";
import Image from "@/components/base/Image";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

type ActionItem = {
	label: string;
	icon?: React.ReactNode;
	action?: () => void;
};

export type ShareItem = {
	label: string;
	src: string;
	onSelect?: () => void;
	onSelectA4?: () => void;
	onSelectThermal?: () => void;
};

type Props = {
	actions?: ActionItem[];
	shareItems?: ShareItem[];
	showPrint?: boolean;
	onPrint?: () => void;
	onPrintA4?: () => void;
	onPrintThermal?: () => void;
	showShare?: boolean;
	showDownload?: boolean;
	onDownload?: () => void;
	onDownloadA4?: () => void;
	onDownloadThermal?: () => void;
};

export default function ReceiptActions({
	actions = [],
	shareItems,
	showPrint = true,
	onPrint,
	onPrintA4,
	onPrintThermal,
	showShare = true,
	showDownload = true,
	onDownload,
	onDownloadA4,
	onDownloadThermal,
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

	const hasPrintFormats = Boolean(onPrintA4 || onPrintThermal);
	const printA4 = onPrintA4 ?? onPrint;
	const printThermal = onPrintThermal;

	const downloadA4 = onDownloadA4 ?? onDownload;
	const downloadThermal = onDownloadThermal;
	const showDownloadMenu = Boolean(downloadThermal || onDownloadA4);

	const finalActions: ActionItem[] = actions.length
		? actions
		: [
				...(showPrint ? [{ label: "Print", icon: <PrinterIcon />, action: onPrint }] : []),
				...(showShare ? [{ label: "Share", icon: <ShareIcon />, action: undefined }] : []),
				...(showDownload ? [{ label: "Download", icon: <DownloadCloudIcon />, action: onDownload }] : []),
		  ];

	const renderPrintMenu = () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex active-scale items-center gap-2 p-2 px-3 bg-primary/10 rounded-sm hover:bg-primary/60 text-primary hover:text-white">
					<IconWrapper>
						<PrinterIcon />
					</IconWrapper>
					<span className="hidden min-[450px]:text-sm min-[450px]:inline-block min-[600px]:text-sm">Print</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="shadow-md px-1 min-w-[11rem]">
				<DropdownMenuLabel>Print format</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{printA4 ? (
					<DropdownMenuItem onSelect={() => printA4()} className="cursor-pointer py-1.5 px-3">
						Print A4 Receipt
					</DropdownMenuItem>
				) : null}
				{printThermal ? (
					<DropdownMenuItem onSelect={() => printThermal()} className="cursor-pointer py-1.5 px-3">
						Print Thermal Receipt
					</DropdownMenuItem>
				) : null}
			</DropdownMenuContent>
		</DropdownMenu>
	);

	const renderDownloadMenu = () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex active-scale items-center gap-2 p-2 px-3 bg-primary/10 rounded-sm hover:bg-primary/60 text-primary hover:text-white">
					<IconWrapper>
						<DownloadCloudIcon />
					</IconWrapper>
					<span className="hidden min-[450px]:text-sm min-[450px]:inline-block min-[600px]:text-sm">Download</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="shadow-md px-1 min-w-[12rem]">
				<DropdownMenuLabel>Download format</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{downloadA4 ? (
					<DropdownMenuItem onSelect={() => downloadA4()} className="cursor-pointer py-1.5 px-3">
						Download A4 Receipt
					</DropdownMenuItem>
				) : null}
				{downloadThermal ? (
					<DropdownMenuItem onSelect={() => downloadThermal()} className="cursor-pointer py-1.5 px-3">
						Download Thermal Receipt
					</DropdownMenuItem>
				) : null}
			</DropdownMenuContent>
		</DropdownMenu>
	);

	const defaultShareItems: ShareItem[] = shareItems || [
		{ label: "Email", src: "/", onSelect: handleEmail },
		{ label: "Whatsapp", src: "/", onSelect: handleWhatsApp },
	];

	const renderShareMenu = () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className="flex active-scale items-center gap-2 p-2 px-3 bg-primary/10 rounded-sm hover:bg-primary/60 text-primary hover:text-white">
					<IconWrapper>
						<ShareIcon />
					</IconWrapper>
					<span className="hidden min-[450px]:text-sm min-[450px]:inline-block min-[600px]:text-sm">Share</span>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="shadow-md px-2 min-w-[12rem]">
				<DropdownMenuLabel>Share to</DropdownMenuLabel>
				{defaultShareItems.map((opt) => {
					const hasFormats = Boolean(opt.onSelectA4 || opt.onSelectThermal);
					if (hasFormats) {
						return (
							<DropdownMenuSub key={opt.label}>
								<DropdownMenuSubTrigger className="cursor-pointer py-1.5 px-3 gap-2">
									<Image src={opt.src} className="w-5" />
									<span>{opt.label}</span>
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent className="shadow-md min-w-[11rem]">
									{opt.onSelectA4 ? (
										<DropdownMenuItem onSelect={() => opt.onSelectA4?.()} className="cursor-pointer py-1.5 px-3">
											A4 Receipt
										</DropdownMenuItem>
									) : null}
									{opt.onSelectThermal ? (
										<DropdownMenuItem
											onSelect={() => opt.onSelectThermal?.()}
											className="cursor-pointer py-1.5 px-3">
											Thermal Receipt
										</DropdownMenuItem>
									) : null}
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						);
					}

					return (
						<DropdownMenuItem key={opt.label} onSelect={() => opt.onSelect?.()} className="cursor-pointer py-1.5 px-3">
							<Image src={opt.src} className="w-5" />
							<span>{opt.label}</span>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);

	return (
		<div className="flex items-center gap-2">
			{finalActions.map((action, index) => {
				if (action.label.toLowerCase() === "print" && hasPrintFormats) {
					return <span key={index}>{renderPrintMenu()}</span>;
				}

				if (action.label.toLowerCase() === "share") {
					return <span key={index}>{renderShareMenu()}</span>;
				}

				if (action.label.toLowerCase() === "download" && showDownloadMenu) {
					return <span key={index}>{renderDownloadMenu()}</span>;
				}

				return (
					<button
						key={index}
						type="button"
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
