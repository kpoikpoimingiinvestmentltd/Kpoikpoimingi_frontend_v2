import React from "react";
import { _router } from "@/routes/_router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { ChevronLeftIcon, IconWrapper, LogoutIcon, MenuIcon, NotificationIcon, ReceiptPlusIcon, SettingIcon, UserIcon } from "@/assets/icons";
import { useGetCurrentUser } from "@/api/user";
import { useGetUnreadNotificationCount } from "@/api/notifications";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AvatarSkeleton, RectangleSkeleton } from "@/components/common/Skeleton";
import GenerateReceiptModal from "@/dashboard/Receipt/GenerateReceiptModal";
import { Link, NavLink, useLocation, useNavigate } from "react-router";

const PAGES_WITH_BACK_BUTTON = [
	_router.dashboard.customerDetails,
	_router.dashboard.propertiesDetails,
	_router.dashboard.contractDetails,
	_router.dashboard.productRequestDetails,
	_router.dashboard.debtDetails,
	_router.dashboard.receiptDetails,
	_router.dashboard.userDetailsPath,
	_router.dashboard.customerDetailsReceipt,
	_router.dashboard.contractReceipt,
];

interface AdminDashboardHeaderProps {
	onSidebarOpen: () => void;
	onLogoutOpen?: () => void;
}

export default function AdminDashboardHeader({ onSidebarOpen, onLogoutOpen }: AdminDashboardHeaderProps) {
	const [receiptOpen, setReceiptOpen] = React.useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	const shouldShowBackButton = PAGES_WITH_BACK_BUTTON.some((pattern) => {
		const regex = pattern.replace(/:[^/]+/g, "[^/]+");
		return new RegExp(`^${regex}$`).test(location.pathname);
	});

	return (
		<div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-2">
			<div className="flex items-center gap-1">
				{shouldShowBackButton && (
					<button
						className="flex bg-primary text-white p-2 sm:gap-1 active-scale rounded-lg items-center justify-center shadow-lg"
						type="button"
						onClick={() => navigate(-1)}
						title="Go back to previous page">
						<IconWrapper className="sm:text-2xl">
							<ChevronLeftIcon />
						</IconWrapper>
						<span className="hidden min-[480px]:inline">Go Back</span>
					</button>
				)}
				<button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 xl:hidden" onClick={onSidebarOpen} aria-label="Open sidebar">
					<IconWrapper>
						<MenuIcon />
					</IconWrapper>
				</button>
			</div>
			<div className="flex items-center gap-3.5 md:pr-8">
				<button
					type="button"
					className="gap-2 items-center hidden md:flex bg-gradient-to-t from-[#134DC1] to-[#03B4FA] active-scale text-white rounded-md py-2.5 px-3"
					onClick={() => setReceiptOpen(true)}>
					<span className="text-sm">Generate Receipt</span>
					<IconWrapper className="text-xl">
						<ReceiptPlusIcon />
					</IconWrapper>
				</button>
				<NavLink
					to={_router.dashboard.settings}
					className={({ isActive }) =>
						`p-2.5 rounded-full relative flex bg-gray-50 hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 before:content-[''] before:absolute before:-translate-x-1/2 before:translate-y-1.5 before:left-1/2 before:bottom-0 before:h-[2.5px] before:w-1/2 ${
							isActive ? "before:bg-primary" : "before:bg-transparent"
						}`
					}>
					<IconWrapper className="text-xl">
						<SettingIcon />
					</IconWrapper>
				</NavLink>

				<NotificationBell />

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50 cursor-pointer">
							<UserAvatarContent />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<div className="px-1.5">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
						</div>

						<DropdownMenuSeparator />
						<div className="p-1 flex flex-col gap-y-0.5">
							<DropdownMenuItem>
								<Link to={_router.dashboard.settings} className="flex items-center gap-0.5 w-full">
									<IconWrapper>
										<UserIcon />
									</IconWrapper>
									<span>Profile</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Link to={_router.dashboard.settings} className="flex items-center gap-0.5 w-full">
									<IconWrapper>
										<SettingIcon />
									</IconWrapper>
									<span>Settings</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem
								className="cursor-pointer bg-transparent  bg-gradient-to-t from-[#134DC1] to-[#03B4FA] active-scale md:hidden hover:!text-white text-white rounded-md py-2 px-3"
								onSelect={() => setReceiptOpen(true)}>
								<IconWrapper className="text-xl">
									<ReceiptPlusIcon />
								</IconWrapper>
								<span>Generate Receipt</span>
							</DropdownMenuItem>
						</div>
						<DropdownMenuSeparator />
						<div className="px-1.5">
							<DropdownMenuItem className="flex items-center gap-2 w-full text-red-600 dark:text-red-400" onSelect={() => onLogoutOpen?.()}>
								<IconWrapper>
									<LogoutIcon />
								</IconWrapper>
								<span>Logout</span>
							</DropdownMenuItem>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>

				<GenerateReceiptModal open={receiptOpen} onOpenChange={setReceiptOpen} />
			</div>
		</div>
	);
}

function UserAvatarContent() {
	const { data, isLoading } = useGetCurrentUser(true);

	if (isLoading) {
		return (
			<div className="flex items-center gap-3">
				<AvatarSkeleton size={36} />
				<div className="flex flex-col">
					<RectangleSkeleton className="w-24 h-4 mb-1" />
					<RectangleSkeleton className="w-16 h-3" />
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex items-center gap-3">
				<Avatar className="w-9 h-9">
					<AvatarFallback>U</AvatarFallback>
				</Avatar>
				<div className="flex flex-col items-start">
					<span className="text-sm font-medium text-nowrap">Unknown User</span>
					<span className="text-xs text-gray-400">—</span>
				</div>
			</div>
		);
	}

	const name = data.fullName ?? data.email ?? data.username ?? "User";
	const role = typeof data.role === "string" ? data.role : data.role?.role ?? "";
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className="flex items-center gap-3">
			<Avatar className="w-9 h-9">
				<AvatarImage src={typeof data.media === "string" ? data.media : undefined} alt={`${name}'s avatar`} />
				<AvatarFallback>{initials}</AvatarFallback>
			</Avatar>
			<div className="flex flex-col items-start">
				<span className="text-sm font-medium text-nowrap">{name}</span>
				<span className="text-xs text-gray-400">{role}</span>
			</div>
		</div>
	);
}

function NotificationBell() {
	const { data: unread, isLoading } = useGetUnreadNotificationCount(true);

	const count = typeof unread === "number" ? unread : 0;

	return (
		<div className="relative">
			<NavLink
				to={_router.dashboard.notifications}
				className={({ isActive }) =>
					`p-2.5 rounded-full relative flex bg-gray-50 hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 before:content-[''] before:absolute before:-translate-x-1/2 before:translate-y-1.5 before:left-1/2 before:bottom-0 before:h-[2.5px] before:w-1/2 ${
						isActive ? "before:bg-primary" : "before:bg-transparent"
					}`
				}>
				<IconWrapper className="text-xl">
					<NotificationIcon />
				</IconWrapper>
			</NavLink>

			{/* badge */}
			{!isLoading && count > 0 && (
				<span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center min-w-[1rem] h-4 px-1 text-[0.6rem] font-medium text-white bg-red-500 rounded-full">
					{count > 99 ? "99+" : count}
				</span>
			)}

			{/* loading state: small pulse */}
			{isLoading && <span className="absolute -top-0.5 -right-0.5 inline-block w-3 h-3 bg-primary rounded-full animate-pulse" />}
		</div>
	);
}
