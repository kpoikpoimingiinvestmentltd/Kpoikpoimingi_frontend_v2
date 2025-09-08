import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { CloseModalButton } from "@/components/base/Buttons";
import { DownloadReceiptIcon, IconWrapper, SquigglyCheckIcon } from "@/assets/icons";
import { smBtnStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";

export const SubscriptionHistoryModal = ({
	open,
	onOpenChange,
	details,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	details: { type: string; subscriptionDate: string; dueDate: string; amount: string } | null;
}) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={false} className="p-0 overflow-hidden w-full pb-4">
				<DialogHeader className="bg-stone-200 dark:bg-neutral-700 p-3 py-3.5">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-[1.05rem] font-medium">Transaction Details</DialogTitle>
						<DialogClose asChild>
							<CloseModalButton onClose={() => onOpenChange(false)} />
						</DialogClose>
					</div>
				</DialogHeader>
				<div className="p-4">
					<div className="flex flex-col items-center text-center gap-y-6">
						<IconWrapper className="text-5xl text-primary">
							<SquigglyCheckIcon />
						</IconWrapper>
						<div className="flex flex-col gap-y-4">
							<h2 className="font-semibold text-xl">Success</h2>
							<span className="text-sm">User is successfully subscribed to Storm</span>
						</div>
						<div className="rounded-lg text-center flex-col items-center gap-y-2.5 flex bg-gray-200 dark:bg-neutral-800 p-3.5">
							<h3 className="text-lg font-semibold">$120</h3>
							<p className="text-sm">Subscription Amount</p>
						</div>
						<div className="text-start mx-auto">
							{details ? (
								<div className="grid grid-cols-2 gap-4">
									<aside>
										<small className="text-gray-600">From: </small>
										<p className="text-[.9rem] text-balance">{details.type}</p>
									</aside>
									<aside>
										<small className="text-gray-600">Credit Card: </small>
										<p className="text-[.9rem] text-balance">{details.subscriptionDate}</p>
									</aside>
									<aside>
										<small className="text-gray-600">Due Date: </small>
										<p className="text-[.9rem] text-balance">{details.dueDate}</p>
									</aside>
									<aside>
										<small className="text-gray-600">Amount: </small>
										<p className="text-[.9rem] text-balance">{details.amount}</p>
									</aside>
								</div>
							) : (
								<p>No details available.</p>
							)}
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 w-full sm:w-auto">
							<button
								type="button"
								className={`${twMerge(smBtnStyle, "bg-transparent border-2 border-primary dark:text-gray-300 gap-2 p-2 w-full sm:w-auto")}`}>
								<IconWrapper className="hidden sm:flex">
									<DownloadReceiptIcon />
								</IconWrapper>
								<span className="text-sm">Download Receipt</span>
							</button>
							<button
								type="button"
								onClick={() => onOpenChange(false)}
								className={`${twMerge(smBtnStyle, "p-2 w-full sm:w-auto border-2 border-primary")}`}>
								<span className="text-sm">Close</span>
							</button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export const AddNewSubscriptionModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={false} className="p-0 border-transparent overflow-hidden w-full pb-4">
				<DialogHeader className="bg-stone-200 dark:bg-neutral-700 p-3 py-3.5">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-[1.05rem] font-medium">Add New Subscriber</DialogTitle>
						<DialogClose asChild>
							<CloseModalButton onClose={() => onOpenChange(false)} />
						</DialogClose>
					</div>
				</DialogHeader>
				<div></div>
			</DialogContent>
		</Dialog>
	);
};
