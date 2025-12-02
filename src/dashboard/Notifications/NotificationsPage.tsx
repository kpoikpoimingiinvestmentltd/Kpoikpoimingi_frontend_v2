import CustomCard from "@/components/base/CustomCard";
import PageTitles from "@/components/common/PageTitles";
import {
	ContractCancelledIcon,
	ContractPausedIcon,
	ContractResumedIcon,
	ContractTerminatedIcon,
	IconWrapper,
	MissedPaymentIcon,
	NewCustomerAddIcon,
	NotificationIcon,
	ReceiptIssuedIcon,
} from "@/assets/icons";
import CompactPagination from "@/components/ui/compact-pagination";
import React from "react";
import EmptyData from "../../components/common/EmptyData";
import { useGetNotifications } from "@/api/notifications";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { setNotifications, setPagination, setLoading } from "@/store/notificationsSlice";
import { useMarkAllNotificationsRead } from "@/api/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

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
		dispatch(setNotifications(data.data.map((n) => ({ id: n.id, title: n.message, time: n.createdAt, read: n.isRead, type: n.type?.type }))));
		dispatch(setPagination(data.pagination));
	}, [data, dispatch]);

	const notifications = storeState.items;
	const pagination = storeState.pagination;

	const isEmpty = notifications.length === 0;

	return (
		<div>
			<div className="flex items-center flex-wrap gap-5 justify-between">
				<PageTitles title="Notifications" description="All Notification for the activities carried out everyday." />
				<button
					type="button"
					onClick={() =>
						markAllMutation.mutate(undefined, {
							onSuccess: (res) => {
								// update store: mark local notifications as read
								dispatch(setNotifications((storeState.items || []).map((n) => ({ ...n, read: true }))));
								// invalidate queries to refresh data
								queryClient.invalidateQueries({ queryKey: ["notifications"] });
								queryClient.invalidateQueries({ queryKey: ["notifications", "unreadCount"] });
								toast.success(res?.count ? `${res.count} notifications marked read` : "All notifications marked read");
							},
							onError: (err: unknown) => {
								console.error("Failed to mark notifications read", err);
								toast.error("Failed to mark notifications read");
							},
						})
					}
					className="bg-primary text-white px-4 text-sm py-2 rounded-md">
					{markAllMutation.isPending ? "Processing..." : "Mark all as read"}
				</button>
			</div>

			<div className="min-h-96 flex">
				{isLoading ? (
					<CustomCard className="mt-5 p-6 sm:p-8 md:w-11/12 w-full">
						<div className="flex flex-col gap-y-5">
							<Skeleton className="h-6 w-24" />
							<div className="flex flex-col gap-3">
								{Array.from({ length: 5 }).map((_, i) => (
									<div key={i} className="flex items-center gap-4 p-5 rounded-md bg-card">
										<Skeleton className="w-10 h-10 rounded-md" />
										<div className="flex-1">
											<Skeleton className="h-4 w-3/4 mb-2" />
											<Skeleton className="h-3 w-1/3" />
										</div>
									</div>
								))}
							</div>
						</div>
					</CustomCard>
				) : !isEmpty ? (
					<CustomCard className="mt-5 p-6 sm:p-8 md:w-11/12">
						<div className="flex flex-col gap-y-5">
							<h3 className="text-lg font-semibold">Today</h3>
							<div className="flex flex-col gap-3">
								{notifications.map((n, i) => (
									<NotificationItem key={n.id ?? i} title={n.title} time={new Date(n.time || "").toLocaleString()} type={n.type} />
								))}
							</div>

							<CompactPagination page={pagination.page} pages={pagination.totalPages || 1} onPageChange={(p) => setPage(p)} showRange />
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
	type?: string;
};

function NotificationItem({ title, time, type }: Notification) {
	const iconMap: Record<string, string | React.ReactNode> = {
		CONTRACT_PAUSED: <ContractPausedIcon />,
		CONTRACT_RESUMED: <ContractResumedIcon />,
		CONTRACT_TERMINATED: <ContractTerminatedIcon />,
		CONTRACT_CANCELLED: <ContractCancelledIcon />,
		NEW_CUSTOMER_REGISTRATION: <NewCustomerAddIcon />,
		MISSED_PAYMENT: <MissedPaymentIcon />,
		RECEIPT_ISSUED: <ReceiptIssuedIcon />,
		default: <NotificationIcon />,
	};
	const icon = iconMap[type ?? "default"] ?? iconMap.default;
	return (
		<div className="flex items-start sm:items-center gap-4 p-5 rounded-md bg-card">
			<IconWrapper className="bg-[#1312120D] w-10 h-10 text-xl text-primary rounded-md">{icon}</IconWrapper>
			<div className="flex-1">
				<div className="flex justify-between items-center gap-5 flex-wrap">
					<div className="max-w-2xl">
						<p className="text-sm">{title}</p>
					</div>
					<p className="text-sm text-end ml-auto text-gray-400">{time ?? ""}</p>
				</div>
			</div>
		</div>
	);
}
