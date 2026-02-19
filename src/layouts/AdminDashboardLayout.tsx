import { Outlet } from "react-router";
import AdminDashboardSidebar from "../components/navigation/AdminDashboardSidebar";
import AdminDashboardHeader from "./AdminDashboardHeader";
import { useState } from "react";
import LogoutModal from "../components/common/LogoutModal";
import SimpleCalculator from "@/components/common/Calculator";

export default function AdminDashboardLayout() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [logoutOpen, setLogoutOpen] = useState(false);

	return (
		<div className="flex items-start w-full min-h-screen bg-gray-50/20 text-black dark:text-white">
			{sidebarOpen && (
				<div
					className="fixed inset-0 bg-black/50 bg-opacity-40 z-40 xl:hidden"
					onClick={() => setSidebarOpen(false)}
					aria-label="Close sidebar backdrop"
				/>
			)}
			<aside
				className={`w-76 bg-gradient-to-b dark:from-neutral-950 from-[#03B4FA] to-[#9edff8] dark:to-neutral-700 border-r dark:via-90% dark:border-r-neutral-700/70 pt-5 px-4 pb-4 h-screen border-0 dark:border-neutral-800 shadow-2xs fixed left-0 top-0 z-50 transition-transform ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
				}`}>
				<AdminDashboardSidebar onClose={() => setSidebarOpen(false)} onLogoutOpen={() => setLogoutOpen(true)} />
			</aside>
			<main className="flex grow flex-col min-h-screen w-full xl:ml-76">
				<AdminDashboardHeader onSidebarOpen={() => setSidebarOpen(true)} onLogoutOpen={() => setLogoutOpen(true)} />
				<div className="p-5 md:p-6 flex-grow bg-card">
					<Outlet />
				</div>
			</main>

			<LogoutModal open={logoutOpen} onOpenChange={setLogoutOpen} />
			<SimpleCalculator />
		</div>
	);
}
