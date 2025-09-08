import { Outlet } from "react-router";
import AdminDashboardSidebar from "../components/navigation/AdminDashboardSidebar";
import AdminDashboardHeader from "./AdminDashboardHeader";
import { useState } from "react";
import LogoutModal from "../components/common/LogoutModal";

export default function AdminDashboardLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [logoutOpen, setLogoutOpen] = useState(false);

	return (
		<div className="flex w-full min-h-screen bg-gray-50/20 dark:bg-[#0b0b0b] text-black dark:text-white">
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/50 bg-opacity-40 z-40 xl:hidden"
					onClick={() => setSidebarOpen(false)}
					aria-label="Close sidebar backdrop"
				/>
			)}
			<aside
				className={`w-72 bg-gradient-to-b from-[#03B4FA] to-[#9edff8] pt-5 px-4 pb-4 h-screen border-0 dark:border-neutral-800 shadow-2xs fixed left-0 top-0 z-50 transition-transform ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
				}`}>
				<AdminDashboardSidebar onClose={() => setSidebarOpen(false)} onLogoutOpen={() => setLogoutOpen(true)} />
			</aside>
			<main className="flex-1 flex flex-col min-h-screen w-full xl:ml-72">
				<AdminDashboardHeader onSidebarOpen={() => setSidebarOpen(true)} onLogoutOpen={() => setLogoutOpen(true)} />
				<div className="p-5 md:p-6 flex-grow bg-[#FBFBFB]">
					<Outlet />
				</div>
			</main>

			<LogoutModal open={logoutOpen} onOpenChange={setLogoutOpen} />
		</div>
	);
}
