import CustomCard from "@/components/base/CustomCard";
import PageTitles from "@/components/common/PageTitles";
import { IconWrapper } from "@/assets/icons";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import EmptyData from "../../components/common/EmptyData";
import { useGetNotifications } from "@/api/notifications";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setNotifications, setPagination, setLoading } from "@/store/notificationsSlice";
import type { NotificationItem as NotificationType } from "@/types/notifications";
import { useMarkAllNotificationsRead } from "@/api/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function NotificationsPage() {
	const [page, setPage] = React.useState(1);
	const [limit] = React.useState(20);
	const dispatch = useDispatch();
	const storeState = useSelector((s: RootState) => s.notifications);

	const { data, isFetching, isLoading, isError } = useGetNotifications(page, limit, true);

	const queryClient = useQueryClient();
	const markAllMutation = useMarkAllNotificationsRead();

	React.useEffect(() => {
		dispatch(setLoading(!!isFetching || !!isLoading));
	}, [isFetching, isLoading, dispatch]);

	React.useEffect(() => {
		dispatch(setLoading(!!markAllMutation.isPending));
	}, [markAllMutation.isPending, dispatch]);

	React.useEffect(() => {
		if (!data) return;
		dispatch(setNotifications(data.data as NotificationType[]));
		dispatch(setPagination(data.pagination));
	}, [data, dispatch]);

	const notifications = storeState.items;
	const pagination = storeState.pagination;

	const isEmpty = notifications.length === 0;

	return (
		<div>
			<div className="flex items-center justify-between">
				<PageTitles title="Notifications" description="All Notification for the activities carried out everyday." />
				<button
					type="button"
					onClick={() =>
						markAllMutation.mutate(undefined, {
							onSuccess: (res: any) => {
								// update store: mark local notifications as read
								dispatch(setNotifications((storeState.items || []).map((n) => ({ ...n, read: true }))));
								// invalidate queries to refresh data
								queryClient.invalidateQueries({ queryKey: ["notifications"] });
								queryClient.invalidateQueries({ queryKey: ["notifications", "unreadCount"] });
								toast.success(res?.count ? `${res.count} notifications marked read` : "All notifications marked read");
							},
							onError: (err: any) => {
								console.error("Failed to mark notifications read", err);
								toast.error("Failed to mark notifications read");
							},
						})
					}
					className="bg-primary text-white px-4 py-2 rounded-md">
					{markAllMutation.isPending ? "Processing..." : "Mark all read"}
				</button>
			</div>

			<div className="min-h-96 flex">
				{!isEmpty ? (
					<CustomCard className="mt-5 p-6 sm:p-8 md:w-11/12">
						<div className="flex flex-col gap-y-5">
							<h3 className="text-lg font-semibold">Today</h3>
							<div className="flex flex-col gap-3">
								{notifications.map((n, i) => (
									<NotificationItem key={n.id ?? i} {...n} />
								))}
							</div>

							<div>
								<CompactPagination page={pagination.page} pages={pagination.totalPages || 1} onPageChange={(p) => setPage(p)} showRange />
							</div>
						</div>
					</CustomCard>
				) : (
					<div className="flex-grow flex items-center justify-center">
						{isError ? <EmptyData text="Failed to load notifications" /> : <EmptyData text="Notification Unavailable" />}
					</div>
				)}
			</div>
		</div>
	);
}

type Notification = {
	title: string;
	subtitle?: string;
	time?: string;
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
						{subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
					</div>
					<p className="text-xs text-end text-gray-400">{time ?? ""}</p>
				</div>
			</div>
		</div>
	);
}
