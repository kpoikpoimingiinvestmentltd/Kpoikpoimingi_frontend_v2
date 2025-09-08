import BackButton from "@/components/base/Buttons";
import CustomCard from "@/components/base/CustomCard";
import { HoldingMoney, IconWrapper, MoneyIcon } from "@/assets/icons";
import { Calendar, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { SubscriptionHistoryModal } from "./SubscriptionModals";

export default function SubscriptionHistory() {
	const [modalOpen, setModalOpen] = useState(false);
	const [subscriptionDetails, setSubscriptionDetails] = useState<{
		type: string;
		subscriptionDate: string;
		dueDate: string;
		amount: string;
	} | null>(null);

	const handleOpenModal = (details: { type: string; subscriptionDate: string; dueDate: string; amount: string }) => {
		setSubscriptionDetails(details);
		setModalOpen(true);
	};

	return (
		<div className="max-w-5xl mx-auto mt-3">
			<BackButton title="Back to Subscription" />

			<div className="mt-6">
				<ul className="flex flex-col gap-y-4">
					<EachSubscription onOpenModal={handleOpenModal} />
					<EachSubscription onOpenModal={handleOpenModal} />
					<EachSubscription onOpenModal={handleOpenModal} />
				</ul>
			</div>

			{modalOpen && <SubscriptionHistoryModal open={modalOpen} onOpenChange={setModalOpen} details={subscriptionDetails} />}
		</div>
	);
}

function EachSubscription({
	onOpenModal,
}: {
	onOpenModal: (details: { type: string; subscriptionDate: string; dueDate: string; amount: string }) => void;
}) {
	const subscription = {
		type: "Yearly Premium Subscription",
		subscriptionDate: "2 Mar. 2024, 12:00am",
		dueDate: "2 Mar. 2025, 12:00am",
		amount: "$102.95",
	};

	return (
		<li>
			<CustomCard className="flex flex-col gap-y-2 rounded-lg bg-gray-50/10">
				<div className="flex items-center justify-between gap-8">
					<small className="text-stone-500">{subscription.type}</small>
					<button
						type="button"
						className="flex p-1.5 rounded-full dark:bg-stone-700 dark:hover:bg-stone-800 bg-stone-100 hover:bg-stone-200 items-center justify-center"
						onClick={() => onOpenModal(subscription)}>
						<IconWrapper>
							<ChevronRight size={"1em"} />
						</IconWrapper>
					</button>
				</div>
				<div className="flex items-center justify-between gap-8">
					<aside className="text-start flex flex-col items-start gap-y-1">
						<small className="text-stone-500"> Subscription Date</small>
						<div className="flex items-center gap-2">
							<IconWrapper>
								<Calendar size={16} />
							</IconWrapper>
							<span className="text-[0.9rem]">{subscription.subscriptionDate}</span>
						</div>
					</aside>
				</div>
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<aside className="text-start flex flex-col gap-y-1">
						<small className="text-stone-500">Due Date</small>
						<div className="flex items-center gap-2">
							<IconWrapper>
								<Calendar size={16} />
							</IconWrapper>
							<span className="text-[0.9rem]">{subscription.dueDate}</span>
						</div>
					</aside>
					<aside className="text-start flex flex-col items-start gap-y-1">
						<small className="text-stone-500">Amount</small>
						<div className="flex items-center gap-2">
							<IconWrapper>
								<MoneyIcon />
							</IconWrapper>
							<span className="text-[0.9rem]">{subscription.amount}</span>
						</div>
					</aside>
				</div>
			</CustomCard>
		</li>
	);
}

export const EmptySubscriptionHistory = () => {
	return (
		<CustomCard className="flex flex-col gap-y-5 items-center justify-center py-12">
			<IconWrapper className="text-6xl text-stone-400 dark:text-stone-300/20">
				<HoldingMoney />
			</IconWrapper>
			<p className="text-stone-500 text-sm">No subscription history found.</p>
		</CustomCard>
	);
};

export const LoadingSubscriptionStack = () => (
	<div className="flex flex-col gap-y-4">
		<LoadingSubscription />
		<LoadingSubscription />
		<LoadingSubscription />
	</div>
);

export const LoadingSubscription = () => <Skeleton className="h-24 w-full bg-gray-100 dark:bg-neutral-800" />;
