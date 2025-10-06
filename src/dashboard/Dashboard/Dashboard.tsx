import CustomCard from "@/components/base/CustomCard";
import { UserStats } from "@/components/common/UserStats";
import TableForIndex from "./TableForIndex";
import { IndexAreaChart, IndexPieChart } from "./Chart";
import PageTitles from "@/components/common/PageTitles";
import { Link } from "react-router";
import { _router } from "../../routes/_router";
import { IconWrapper, PlusIcon } from "../../assets/icons";

export default function Dashboard() {
	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center flex-wrap justify-between gap-2">
				<PageTitles title="Overview" description="Overview of major activities" />
				<Link to={_router.dashboard.customerAdd} className="text-sm flex items-center gap-2 text-white py-2.5 px-4 rounded-sm bg-primary">
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
	const items = [
		{ color: "#7C3AED", label: "Full Payment", amount: "400,000" },
		{ color: "#E3901B", label: "Hire purchase", amount: "500,000" },
		{ color: "#F3E9FF", label: "Unpaid dept", amount: "500,000" },
	];

	return (
		<div className="flex flex-wrap justify-center lg:flex-col lg:items-start gap-4">
			{items.map((it) => (
				<div key={it.label} className="flex items-start gap-3">
					<div className="mt-1">
						<span style={{ background: it.color }} className="inline-block w-3 h-3 rounded-full" />
					</div>
					<div>
						<div className="font-medium">{it.label}</div>
						<div className="text-[.89rem] text-gray-400">{it.amount}</div>
					</div>
				</div>
			))}
		</div>
	);
};
