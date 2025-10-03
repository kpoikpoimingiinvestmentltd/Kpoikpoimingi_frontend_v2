import { _router } from "@/routes/_router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { IconWrapper, LogoutIcon, MenuIcon, NotificationIcon, ReceiptPlusIcon, SettingIcon, UserIcon } from "@/assets/icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { NavLink } from "react-router";
import { media } from "../resources/images";

interface AdminDashboardHeaderProps {
	onSidebarOpen: () => void;
	onLogoutOpen?: () => void;
}

export default function AdminDashboardHeader({ onSidebarOpen, onLogoutOpen }: AdminDashboardHeaderProps) {
	// prefer NavLink's active state instead of manual checks
	return (
		<div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-2">
			<div className="flex items-center gap-4">
				<button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 xl:hidden" onClick={onSidebarOpen} aria-label="Open sidebar">
					<IconWrapper>
						<MenuIcon />
					</IconWrapper>
				</button>
			</div>
			<div className="flex items-center gap-3.5">
				<button
					type="button"
					className="gap-2 items-center hidden md:flex bg-gradient-to-t from-[#134DC1] to-[#03B4FA] active-scale text-white rounded-md py-2.5 px-3">
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
					<span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4 h-4 text-[0.6rem] font-medium text-white bg-red-500 rounded-full">
						1
					</span>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="flex items-center gap-3 p-1 rounded-md hover:bg-gray-50">
							<Avatar className="w-9 h-9">
								<AvatarImage src={media.images.avatar} alt="User avatar" />
								<AvatarFallback>AJ</AvatarFallback>
							</Avatar>
							<div className="flex flex-col items-start">
								<span className="text-sm font-medium">Amgbara Jake</span>
								<span className="text-xs text-gray-400">Super admin</span>
							</div>
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<div className="px-1.5">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
						</div>

						<DropdownMenuSeparator />
						<div className="p-1">
							<DropdownMenuItem className="cursor-pointer hover:bg-gray-50 bg-transparent">
								<IconWrapper>
									<UserIcon />
								</IconWrapper>
								<span>Profile</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer hover:bg-gray-50 bg-transparent">
								<IconWrapper>
									<SettingIcon />
								</IconWrapper>
								<span>Settings</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer bg-transparent  bg-gradient-to-t from-[#134DC1] to-[#03B4FA] active-scale md:hidden hover:text-white text-white rounded-md py-2 px-3">
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
			</div>
		</div>
	);
}
