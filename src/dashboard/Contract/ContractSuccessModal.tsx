import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IconWrapper, CheckIcon } from "@/assets/icons";
import ActionButton from "../../components/base/ActionButton";
import { toast } from "sonner";

type Props = {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	link: string;
};

export default function ContractSuccessModal({ open, onOpenChange, link }: Props) {
	const handleCopy = async () => {
		if (navigator?.clipboard) {
			await navigator.clipboard.writeText(link);
			toast.info("Link copied to clipboard!");
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<div className="flex flex-col items-center gap-6 py-6 px-4 w-full">
					<IconWrapper className="text-4xl text-emerald-500">
						<CheckIcon />
					</IconWrapper>

					<div className="text-lg font-semibold">Payment Link Generated</div>

					<div className="mb-3">
						<span className="text-sm font-medium mb-1">Link</span>
						<p className="text-sm [word-break:break-all] text-muted-foreground">
							<a href={link} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary">
								{link}
							</a>
						</p>
					</div>

					<div className="flex gap-3 justify-center mt-4">
						<ActionButton variant="outline" onClick={handleCopy} className="px-6 w-max">
							Copy Link
						</ActionButton>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
