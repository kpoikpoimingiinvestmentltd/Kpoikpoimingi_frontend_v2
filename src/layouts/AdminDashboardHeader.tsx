import { _router } from "@/routes/_router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { IconWrapper, LogoutIcon, MenuIcon, NotificationIcon, SettingIcon, UserIcon } from "@/assets/icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AdminDashboardHeaderProps {
	onSidebarOpen: () => void;
	onLogoutOpen?: () => void;
}

export default function AdminDashboardHeader({ onSidebarOpen, onLogoutOpen }: AdminDashboardHeaderProps) {
	return (
		<div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-2">
			<div className="flex items-center gap-4">
				<button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 xl:hidden" onClick={onSidebarOpen} aria-label="Open sidebar">
					<IconWrapper>
						<MenuIcon />
					</IconWrapper>
				</button>
			</div>
			<div className="flex items-center gap-3">
				<button className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700">
					<IconWrapper className="text-xl">
						<SettingIcon />
					</IconWrapper>
				</button>

				<div className="relative">
					<button className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700">
						<IconWrapper className="text-xl">
							<NotificationIcon />
						</IconWrapper>
					</button>
					<span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4 h-4 text-[0.6rem] font-medium text-white bg-red-500 rounded-full">
						1
					</span>
				</div>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="flex items-center gap-3 p-1.5 rounded-md hover:bg-gray-50">
							<Avatar className="w-9 h-9">
								<AvatarImage
									src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
									alt="User avatar"
								/>
								<AvatarFallback>AJ</AvatarFallback>
							</Avatar>
							<div className="flex flex-col items-start">
								<span className="text-sm font-medium">Amgbara Jake</span>
								<span className="text-xs text-gray-400">Super admin</span>
							</div>
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
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
						<DropdownMenuSeparator />
						<DropdownMenuItem className="flex items-center gap-2 w-full text-red-600 dark:text-red-400" onSelect={() => onLogoutOpen?.()}>
							<IconWrapper>
								<LogoutIcon />
							</IconWrapper>
							<span>Logout</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
