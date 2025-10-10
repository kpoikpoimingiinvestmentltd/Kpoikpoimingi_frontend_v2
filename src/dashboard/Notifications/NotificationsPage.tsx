import CustomCard from "@/components/base/CustomCard";
import PageTitles from "@/components/common/PageTitles";
import { IconWrapper } from "@/assets/icons";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import EmptyData from "../../components/common/EmptyData";

export default function NotificationsPage() {
	const [isEmpty] = React.useState(false);
	return (
		<div>
			<PageTitles title="Notifications" description="All Notification for the activities carried out everyday." />

			<div className="min-h-96 flex">
				{!isEmpty ? (
					<CustomCard className="mt-5 p-6 sm:p-8 md:w-11/12">
						<div className="flex flex-col gap-y-5">
							<h3 className="text-lg font-semibold">Today</h3>
							<div className="flex flex-col gap-3">
								{notifications.map((n, i) => (
									<NotificationItem key={i} {...n} />
								))}
							</div>

							<div>
								<CompactPagination page={1} pages={5} onPageChange={() => {}} showRange />
							</div>
						</div>
					</CustomCard>
				) : (
					<div className="flex-grow flex items-center justify-center">
						<EmptyData text="Notification Unavailable" />
					</div>
				)}
			</div>
		</div>
	);
}

type Notification = {
	title: string;
	subtitle?: string;
	time: string;
	type?: string; // for icon selection
};

function NotificationItem({ title, subtitle, time, type }: Notification) {
	const iconMap: Record<string, string> = {
		customer: "🧑‍💼",
		contract: "📄",
		payment: "💸",
		default: "🔔",
	};
	const icon = iconMap[type ?? "default"] ?? iconMap.default;
	return (
		<div className="flex items-start gap-4 p-5 rounded-md  bg-card">
			<IconWrapper className="bg-[#1312120D] w-10 h-10 text-primary rounded-md">{icon}</IconWrapper>
			<div className="flex-1">
				<div className="flex justify-between items-start">
					<div>
						<div className="font-medium">{title}</div>
						{subtitle && <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>}
					</div>
					<div className="text-xs text-gray-400">{time}</div>
				</div>
			</div>
		</div>
	);
}

const notifications: Notification[] = [
	{
		title: "New Customer Registration",
		subtitle: "New customer registration submitted by [Staff Name] - awaiting contract upload",
		time: "5 minutes ago",
		type: "customer",
	},
	{ title: "Contract Uploaded", subtitle: "Contract uploaded for Customer X - pending approval", time: "4:22 pm", type: "contract" },
	{ title: "Contract Approved", subtitle: "Contract for Customer X approved - assign property", time: "4:22 pm", type: "contract" },
	{ title: "Property Assigned", subtitle: "Property [Name] assigned to Customer X", time: "4:22 pm", type: "contract" },
	{ title: "Payment received", subtitle: "NXXX payment received from Customer X via [method]", time: "4:22 pm", type: "payment" },
];
