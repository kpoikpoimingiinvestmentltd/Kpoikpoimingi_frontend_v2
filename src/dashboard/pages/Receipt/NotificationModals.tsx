import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// avatar imports intentionally omitted in this notification modal (not used)
import { IconWrapper, UploadImageIcon } from "@/assets/icons";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { inputStyle, switchStyle } from "@/components/common/commonStyles";
import { Textarea } from "@/components/ui/textarea";
import { twMerge } from "tailwind-merge";
import { CloseModalButton } from "@/components/base/Buttons";

interface NotificationModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	notification?: {
		title?: string;
		date?: string;
		message?: string;
		image?: string;
	};
}

export default function NotificationModals({ open, onOpenChange, notification }: NotificationModalProps) {
	const [manageOpen, setManageOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={false} className="p-0 overflow-hidden w-full pb-4">
				<DialogHeader className="bg-stone-200 dark:bg-neutral-700 p-3 py-3.5">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-[1.05rem] font-medium">Notification</DialogTitle>
						<DialogClose asChild>
							<CloseModalButton onClose={() => onOpenChange(false)} />
						</DialogClose>
					</div>
				</DialogHeader>

				<div className="flex flex-col gap-y-4 px-5">
					<div>
						<div className="text-sm text-muted-foreground">Title</div>
						<div className="font-medium mt-2">{notification?.title ?? "Notification title"}</div>
					</div>

					<div>
						<div className="text-sm text-muted-foreground">Date</div>
						<div className="font-medium">{notification?.date ?? "Sep 03, 2025"}</div>
					</div>

					<div>
						<div className="text-sm text-muted-foreground">Message</div>
						<div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{notification?.message ?? "Notification message goes here..."}</div>
					</div>

					<div>
						<div className="w-20 h-20 bg-gray-100 dark:bg-neutral-800 rounded-md flex items-center justify-center">
							<svg
								width="36"
								height="36"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round">
								<rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
								<path d="M8 14s1.5-2 4-2 4 2 4 2" />
								<path d="M8 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
							</svg>
						</div>
					</div>

					<div className="pt-4">
						<Button
							className={"w-full active-scale bg-primary text-black h-11 hover:bg-primary"}
							onClick={() => {
								setManageOpen(true);
								onOpenChange(false);
							}}>
							Manage
						</Button>
					</div>
				</div>
			</DialogContent>

			<ManageNotificationModal open={manageOpen} onOpenChange={setManageOpen} initialText={notification?.message ?? ""} />
		</Dialog>
	);
}

function ManageNotificationModal({
	open,
	onOpenChange,
	initialText,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialText?: string;
}) {
	const [addImage, setAddImage] = useState(false);
	const [text, setText] = useState(initialText ?? "");

	useEffect(() => {
		if (open) {
			setText(initialText ?? "");
			setAddImage(false);
		}
	}, [open, initialText]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={false} className="p-0 border-transparent overflow-hidden w-full pb-4">
				<DialogHeader className="bg-stone-200 dark:bg-neutral-700 p-3 py-3.5">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-[1.05rem] font-medium">Manage Notification</DialogTitle>
						<DialogClose asChild>
							<button className="p-1 aspect-square rounded-full bg-gray-100 dark:bg-neutral-800">
								<IconWrapper className="text-sm">
									<X size={16} />
								</IconWrapper>
							</button>
						</DialogClose>
					</div>
				</DialogHeader>
				<div className="flex flex-col gap-y-4 px-5">
					<div>
						<label className="text-sm font-medium">Message</label>
						<Textarea
							value={text}
							placeholder="Enter message..."
							onChange={(e) => setText(e.target.value)}
							className={`${twMerge(inputStyle, "w-full h-28 mt-2")} text-sm rounded-md border p-3 resize-none `}
						/>
					</div>

					<div className="flex items-center justify-between">
						<label className="text-sm font-medium">Attach image</label>
						<div className="flex items-center gap-2">
							<span className="text-xs text-muted-foreground">(optional)</span>
							<Switch checked={addImage} className={`${switchStyle}`} onCheckedChange={(v) => setAddImage(Boolean(v))} />
						</div>
					</div>

					{addImage && (
						<div className="border-2 border-dashed border-yellow-300 rounded-md p-6 text-center">
							<label className="flex flex-col items-center gap-2 cursor-pointer">
								<IconWrapper>
									<UploadImageIcon />
								</IconWrapper>
								<div className="text-sm text-muted-foreground">Click to upload or drag and drop</div>
								<div className="text-xs text-muted-foreground">PDF, JPG, PNG (max 2mb)</div>
								<input type="file" accept="image/*,application/pdf" className="hidden" />
							</label>
						</div>
					)}

					<div className="mt-4">
						<Button className="w-full bg-primary h-10 text-black hover:bg-primary" onClick={() => onOpenChange(false)}>
							Acknowledge
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
