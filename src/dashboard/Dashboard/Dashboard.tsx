import CustomCard from "@/components/base/CustomCard";
import { UserStats } from "@/components/common/UserStats";
import TableForIndex from "./TableForIndex";
import { IndexAreaChart, IndexPieChart } from "./Chart";
import PageTitles from "@/components/common/PageTitles";
import { Link } from "react-router";
import { _router } from "../../routes/_router";
import { IconWrapper, PlusIcon } from "../../assets/icons";
import { useGetIncomeAnalytics } from "@/api/analytics";
import type { IncomeAnalytics } from "@/types/analytics";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function Dashboard() {
	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center flex-wrap justify-between gap-2">
				<PageTitles title="Overview" description="Overview of major activities" />
				<Link
					to={_router.dashboard.selectCustomerPaymentMethod}
					className="text-sm flex dark:bg-primary items-center gap-2 text-white py-2.5 px-4 rounded-sm bg-primary">
					<IconWrapper>
						<PlusIcon />
					</IconWrapper>
					<span>Add Customer</span>
				</Link>
			</div>
			<UserStats />
			<div className="grid grid-cols-7 gap-4">
				<aside className="col-span-full md:col-span-3">
					<CustomCard className="grid items-center grid-cols-5 gap-5">
						<aside className="col-span-full lg:col-span-3">
							<IndexPieChart />
						</aside>
						<aside className="col-span-full lg:col-span-2">
							<PieLegend />
						</aside>
					</CustomCard>
				</aside>
				<aside className="col-span-full md:col-span-4">
					<CustomCard className="flex flex-col justify-between gap-y-5">
						<header className="flex items-center justify-between gap-4">
							<h2 className="text-[1.05rem] font-semibold">Incoming Analysis</h2>
						</header>
						<IndexAreaChart />
					</CustomCard>
				</aside>
			</div>
			<TableForIndex />
		</div>
	);
}

const PieLegend = () => {
	const { data: incomeData } = useGetIncomeAnalytics();
	const { data: currentUser } = useCurrentUser();

	const isSuperAdmin = currentUser?.role?.role === "SUPER_ADMIN";

	const items: Array<{ color: string; label: string; value: number }> = [
		{ color: "#751BE3", label: "Full Payment", value: (incomeData as IncomeAnalytics | undefined)?.fullPayment ?? 0 },
		{ color: "#E3901B", label: "Hire purchase", value: (incomeData as IncomeAnalytics | undefined)?.hirePurchase ?? 0 },
		{ color: "#F3E9FF", label: "Unpaid debt", value: (incomeData as IncomeAnalytics | undefined)?.unpaidDebt ?? 0 },
	];

	// Format number with commas or asterisks based on role
	const formatAmount = (num: number) => {
		if (!isSuperAdmin) {
			return "****";
		}
		return num.toLocaleString("en-US");
	};

	return (
		<div className="flex flex-wrap justify-center lg:flex-col lg:items-start gap-4">
			{items.map((it) => (
				<div key={it.label} className="flex items-start gap-3">
					<span style={{ background: it.color }} className="inline-block mt-1 w-3 h-3 rounded-full" />
					<div className="flex flex-col">
						<div className="font-medium dark:text-gray-300">{it.label}</div>
						<div className={`text-lg text-gray-400 ${!isSuperAdmin ? "blur-[1px] select-none" : "text-[.89rem]"}`}>{formatAmount(it.value)}</div>
					</div>
				</div>
			))}
		</div>
	);
};
