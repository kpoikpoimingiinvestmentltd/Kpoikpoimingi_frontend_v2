import React from "react";
import { _router } from "@/routes/_router";
import Image from "../base/Image";
import { media } from "@/resources/images";
import { Link, NavLink, useLocation } from "react-router";
import {
	ReceiptIcon,
	CloseIcon,
	DashboardIcon,
	IconWrapper,
	ChevronDownIcon,
	ReportIcon,
	PayoutIcon,
	AuditIcon,
	DebtIcon,
	UsersIcon,
	ContractIcon,
	CustomersIcon,
	CartIcon,
	NotificationIcon,
} from "@/assets/icons";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton, Rect } from "@/components/common/Skeleton";

type NavLinkItem = {
	icon: () => React.ReactNode;
	linkname: string;
	path: string;
	allowedRoles: string[];
	submenu?: Array<{ label: string; path: string; end?: boolean }>;
};

export default function AdminDashboardSidebar({ onClose }: { onClose?: () => void; onLogoutOpen?: () => void }) {
	const location = useLocation();
	const pathname = location.pathname;
	const propertiesBase = _router.dashboard.properties;
	const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({});
	const { data: user, isPending } = useCurrentUser();

	const isExactOrChild = (linkPath: string) =>
		pathname === linkPath || pathname.startsWith(linkPath + "/");

	const isHirePurchasePath = () =>
		pathname === _router.dashboard.contract || pathname.startsWith(_router.dashboard.contract + "/");

	const isOutrightSalesPath = () =>
		pathname === _router.dashboard.outrightSales ||
		pathname.startsWith(_router.dashboard.outrightSales + "/");

	const isLinkActive = (link: NavLinkItem) => {
		if (link.linkname === "Dashboard") {
			const normalized = pathname.replace(/\/+$/g, "");
			return normalized === link.path || normalized === link.path.replace(/^\//, "");
		}

		if (link.linkname === "Sales & Contract") {
			return isHirePurchasePath() || isOutrightSalesPath();
		}

		if (link.path === propertiesBase) {
			return (
				isExactOrChild(propertiesBase) ||
				isExactOrChild(_router.dashboard.addProperties) ||
				isExactOrChild(_router.dashboard.manageCategories) ||
				isExactOrChild(_router.dashboard.categories) ||
				isExactOrChild(_router.dashboard.purchases)
			);
		}

		if (link.submenu?.length) {
			return link.submenu.some((item) => isExactOrChild(item.path)) || isExactOrChild(link.path);
		}

		return isExactOrChild(link.path);
	};

	const isSubmenuAutoOpen = (link: NavLinkItem) => {
		if (link.linkname === "Properties") {
			return isExactOrChild(propertiesBase);
		}
		if (link.linkname === "Sales & Contract") {
			return isHirePurchasePath() || isOutrightSalesPath();
		}
		return false;
	};

	const isSubmenuOpen = (link: NavLinkItem) => {
		if (Object.prototype.hasOwnProperty.call(openMenus, link.linkname)) {
			return openMenus[link.linkname];
		}
		return isSubmenuAutoOpen(link);
	};

	const toggleSubmenu = (linkname: string, currentlyOpen: boolean) => {
		setOpenMenus((prev) => ({ ...prev, [linkname]: !currentlyOpen }));
	};

	const childIsActive = (item: { path: string; end?: boolean }) => {
		if (item.path === _router.dashboard.contract) {
			return isHirePurchasePath();
		}
		if (item.end) {
			return pathname === item.path;
		}
		return isExactOrChild(item.path);
	};

	return (
		<div className="flex flex-col h-full gap-y-4">
			<header className="relative flex items-center justify-start before:absolute before:content-[''] before:h-68 before:w-72 before:rounded-full before:bg-white before:pointer-events-none before:-bottom-6 before:-left-1/4">
				<button
					type="button"
					className="absolute right-0 bg-white dark:bg-neutral-800 dark: hover:bg-neutral-200 rounded-lg top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white p-2 xl:hidden"
					onClick={() => onClose?.()}
					aria-label="Close sidebar">
					<IconWrapper>
						<CloseIcon />
					</IconWrapper>
				</button>
				<Image src={media.logos.logo} className="relative w-40 -mt-4" />
			</header>
			<div className="overflow-y-auto relative flex flex-col gap-y-4 mt-6 sidebar-links-container">
				{isPending ? (
					<ul className="flex flex-col items-start gap-y-0.5 w-full">
						{Array.from({ length: 9 }).map((_, i) => (
							<li key={i} className="w-full">
								<Skeleton className="flex w-full items-center gap-x-4 py-2 px-4 rounded-sm">
									<Rect className="h-10 w-10 rounded-full bg-white/30" />
									<Rect className="h-4 w-32 bg-white/30" />
								</Skeleton>
							</li>
						))}
					</ul>
				) : (
					<ul className="flex flex-col items-start gap-y-0.5 w-full">
						{links
							.filter((link) => user?.role && link.allowedRoles.includes(user.role.role))
							.map((link) => {
								const active = isLinkActive(link);
								const baseLinkClass = `flex w-full items-center text-start before:right-0 before:h-full before:w-0.5 before:content-[''] before:absolute relative gap-x-4 py-2 px-4 rounded-sm rounded-r-none active-scale transition-colors ${
									active
										? "bg-white/20 before:bg-white dark:bg-neutral-700/80 dark:hover:bg-neutral-700/90 dark:before:bg-primary"
										: "text-black before:bg-transparent hover:bg-white/15 dark:hover:bg-neutral-700/60"
								}`;

								if (link.submenu?.length) {
									const submenuOpen = isSubmenuOpen(link);
									return (
										<li key={link.linkname} className="w-full">
											<div className={`flex items-center justify-between w-full ${baseLinkClass}`}>
												<Link
													to={link.path}
													onClick={() => {
														setOpenMenus((prev) => ({ ...prev, [link.linkname]: true }));
														onClose?.();
													}}
													className="flex items-center gap-x-4 text-left flex-1 min-w-0">
													<IconWrapper className="text-[1.35rem] text-primary p-1.5 rounded-full bg-white dark:bg-neutral-900 border">
														<link.icon />
													</IconWrapper>
													<span className="font-medium text-sm text-white truncate">{link.linkname}</span>
												</Link>
												<button
													type="button"
													aria-expanded={submenuOpen}
													aria-label={`Toggle ${link.linkname} menu`}
													onClick={(e) => {
														e.preventDefault();
														e.stopPropagation();
														toggleSubmenu(link.linkname, submenuOpen);
													}}
													className="text-white/90 hover:text-white p-1 shrink-0">
													<IconWrapper className={`text-xl ${submenuOpen ? "rotate-180" : ""} transition-transform`}>
														<ChevronDownIcon />
													</IconWrapper>
												</button>
											</div>

											{submenuOpen ? (
												<div className="bg-white/20 dark:bg-neutral-700/30 flex flex-col gap-y-[3px] w-full p-2.5 rounded-sm mt-1">
													{link.submenu.map((item) => (
														<Link
															key={`${link.linkname}-${item.label}`}
															to={item.path}
															onClick={() => onClose?.()}
															className={`py-1.5 text-[.9rem] px-3.5 dark:hover:bg-neutral-800 text-white/90 flex rounded ${
																childIsActive(item) ? "bg-[#1312120d]" : ""
															}`}>
															{item.label}
														</Link>
													))}
												</div>
											) : null}
										</li>
									);
								}

								return (
									<li key={link.linkname} className="w-full">
										<NavLink to={link.path} onClick={() => onClose?.()} className={baseLinkClass}>
											<IconWrapper className="text-[1.35rem] text-primary dark:bg-neutral-900 p-1.5 rounded-full bg-white border">
												<link.icon />
											</IconWrapper>
											<span className="font-medium text-[.925rem] text-white">{link.linkname}</span>
										</NavLink>
									</li>
								);
							})}
					</ul>
				)}
			</div>
		</div>
	);
}

const links: NavLinkItem[] = [
	{
		icon: DashboardIcon,
		linkname: "Dashboard",
		path: _router.dashboard.index,
		allowedRoles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
	},
	{
		icon: CustomersIcon,
		linkname: "Customers",
		path: _router.dashboard.customers,
		allowedRoles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
	},
	{
		icon: ContractIcon,
		linkname: "Sales & Contract",
		path: _router.dashboard.contract,
		allowedRoles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
		submenu: [
			{ label: "Hire Purchase", path: _router.dashboard.contract, end: true },
			{ label: "Outright Sales", path: _router.dashboard.outrightSales },
		],
	},
	{
		icon: CartIcon,
		linkname: "Properties",
		path: _router.dashboard.properties,
		allowedRoles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
		submenu: [
			{ label: "Add Properties", path: _router.dashboard.addProperties },
			{ label: "Manage Categories", path: _router.dashboard.categories },
			{ label: "Purchases", path: _router.dashboard.purchases },
		],
	},
	{
		icon: UsersIcon,
		linkname: "Users",
		path: _router.dashboard.users,
		allowedRoles: ["SUPER_ADMIN"],
	},
	{
		icon: ReceiptIcon,
		linkname: "Receipt",
		path: _router.dashboard.receipt,
		allowedRoles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
	},
	{
		icon: PayoutIcon,
		linkname: "Payment",
		path: _router.dashboard.payment,
		allowedRoles: ["SUPER_ADMIN", "ADMIN", "STAFF"],
	},
	{
		icon: DebtIcon,
		linkname: "Debt",
		path: _router.dashboard.debt,
		allowedRoles: ["SUPER_ADMIN"],
	},
	{
		icon: ReportIcon,
		linkname: "Report & Analytics",
		path: _router.dashboard.reportAnalytics,
		allowedRoles: ["SUPER_ADMIN"],
	},
	{
		icon: AuditIcon,
		linkname: "Audit & Compliance",
		path: _router.dashboard.auditAndCompliance,
		allowedRoles: ["SUPER_ADMIN"],
	},
	{
		icon: NotificationIcon,
		linkname: "Notifications",
		path: _router.dashboard.notifications,
		allowedRoles: ["STAFF", "ADMIN", "SUPER_ADMIN"],
	},
];
