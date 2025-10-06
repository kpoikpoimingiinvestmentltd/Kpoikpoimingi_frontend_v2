import React from "react";
import { _router } from "@/routes/_router";
import Image from "../base/Image";
import { media } from "@/resources/images";
import { NavLink, useLocation } from "react-router";
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
} from "@/assets/icons";

export default function AdminDashboardSidebar({ onClose }: { onClose?: () => void; onLogoutOpen?: () => void }) {
	const location = useLocation();
	const pathname = location.pathname;
	const propertiesBase = _router.dashboard.properties; // "/dashboard/properties"
	const [submenuOpenManual, setSubmenuOpenManual] = React.useState<boolean | null>(null);

	const isLinkActive = (linkPath: string) => {
		if (linkPath === _router.dashboard.index) {
			const normalized = pathname.replace(/\/+$ /g, "");
			return normalized === linkPath || normalized === linkPath.replace(/^\//, "");
		}

		if (linkPath === propertiesBase) {
			const children = [_router.dashboard.addProperties, _router.dashboard.manageCategories, propertiesBase];
			return children.some((p) => pathname === p || pathname.startsWith(p + "/"));
		}

		return pathname === linkPath || pathname.startsWith(linkPath + "/");
	};

	return (
		<div className="flex flex-col h-full gap-y-4">
			<header className="relative flex items-center justify-start before:absolute before:content-[''] before:h-62 before:w-68 before:rounded-full before:bg-white before:pointer-events-none before:-bottom-4 before:-left-1/4">
				<button
					type="button"
					className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white p-2 xl:hidden"
					onClick={() => onClose?.()}
					aria-label="Close sidebar">
					<IconWrapper>
						<CloseIcon />
					</IconWrapper>
				</button>
				<Image src={media.logos.logo} className="relative w-40" />
			</header>
			<div className="overflow-y-auto relative flex flex-col gap-y-4 mt-2 sidebar-links-container">
				<ul className="flex flex-col items-start gap-y-0.5 w-full">
					{links.map((link) => {
						const active = isLinkActive(link.path);
						const baseLinkClass = `flex w-full items-center text-start before:right-0 before:h-full before:w-0.5 before:content-[''] before:absolute relative gap-x-4 py-2.5 px-4 rounded-sm rounded-r-none active-scale transition-colors ${
							active ? "bg-white/20 before:bg-white" : "text-black before:bg-transparent  hover:bg-white/15"
						}`;

						if (link.linkname === "Properties") {
							const autoOpen = pathname === propertiesBase || pathname.startsWith(propertiesBase + "/");
							const submenuOpen = submenuOpenManual === null ? autoOpen : submenuOpenManual;
							return (
								<li key={link.linkname} className="w-full">
									<div className={`flex items-center justify-between w-full ${baseLinkClass}`}>
										<NavLink to={propertiesBase} onClick={() => onClose?.()} className="flex items-center gap-x-4 justify-between">
											<IconWrapper className="text-[1.35rem] text-primary p-1.5 rounded-full bg-white">
												<link.icon />
											</IconWrapper>
											<span className="font-medium text-sm text-white">{link.linkname}</span>
										</NavLink>
										<button
											type="button"
											aria-expanded={submenuOpen}
											onClick={(e) => {
												e.stopPropagation();
												e.preventDefault();
												setSubmenuOpenManual((prev) => (prev === null ? !autoOpen : !prev));
											}}
											className="text-white/90 hover:text-white">
											<IconWrapper className={`text-xl ${submenuOpen ? "rotate-180" : ""} transition-transform`}>
												<ChevronDownIcon />
											</IconWrapper>
										</button>
									</div>

									{/* Submenu */}
									<div className={`bg-white/20 flex flex-col gap-y-[3px] w-full p-2.5 rounded-sm mt-1 ${submenuOpen ? "block" : "hidden"}`}>
										<NavLink
											to={_router.dashboard.addProperties}
											onClick={() => onClose?.()}
											className={`py-1.5 text-[.9rem] px-3.5 text-white/90 flex rounded ${
												pathname === _router.dashboard.addProperties || pathname.startsWith(_router.dashboard.addProperties + "/")
													? "bg-[#1312120d]"
													: ""
											}`}>
											Add Properties
										</NavLink>
										<NavLink
											to={_router.dashboard.categories}
											onClick={() => onClose?.()}
											className={`py-1.5 text-[.9rem] px-3.5 text-white/90 flex rounded ${
												pathname === _router.dashboard.categories || pathname.startsWith(_router.dashboard.categories + "/") ? "bg-[#1312120d]" : ""
											}`}>
											Manage Categories
										</NavLink>
									</div>
								</li>
							);
						}

						return (
							<li key={link.linkname} className="w-full">
								<NavLink to={link.path} onClick={() => onClose?.()} className={baseLinkClass}>
									<IconWrapper className="text-[1.35rem] text-primary p-1.5 rounded-full bg-white">
										<link.icon />
									</IconWrapper>
									<span className="font-medium text-[.925rem] text-white">{link.linkname}</span>
								</NavLink>
							</li>
						);
					})}
				</ul>
				{/* <ul className="flex flex-col items-start gap-y-2">
					<li className="flex w-full items-center text-start gap-x-4 rounded-sm transition-colors justify-between">
						<button
							type="button"
							onClick={() => onLogoutOpen?.()}
							className="w-full text-red-500 flex items-center gap-x-3 hover:bg-red-100 dark:hover:text-white active-scale py-3 px-4 rounded-sm">
							<IconWrapper className="text-[1.35rem]">
								<LogoutIcon />
							</IconWrapper>
							<span className="font-medium text-sm">Logout</span>
						</button>
					</li>
				</ul> */}
			</div>
		</div>
	);
}

const links = [
	{
		icon: DashboardIcon,
		linkname: "Dashboard",
		path: _router.dashboard.index,
	},
	{
		icon: CustomersIcon,
		linkname: "Customers",
		path: _router.dashboard.customers,
	},
	{
		icon: ContractIcon,
		linkname: "Contract",
		path: _router.dashboard.contract,
	},
	{
		icon: CartIcon,
		linkname: "Properties",
		path: _router.dashboard.properties,
	},
	{
		icon: UsersIcon,
		linkname: "Users",
		path: _router.dashboard.users,
	},
	{
		icon: ReceiptIcon,
		linkname: "Receipt",
		path: _router.dashboard.receipt,
	},
	{
		icon: PayoutIcon,
		linkname: "Payment",
		path: _router.dashboard.payment,
	},
	{
		icon: DebtIcon,
		linkname: "Debt",
		path: _router.dashboard.debt,
	},
	{
		icon: ReportIcon,
		linkname: "Report & Analytics",
		path: _router.dashboard.reportAnalytics,
	},
	{
		icon: AuditIcon,
		linkname: "Audit & Compliance",
		path: _router.dashboard.auditAndCompliance,
	},
];
