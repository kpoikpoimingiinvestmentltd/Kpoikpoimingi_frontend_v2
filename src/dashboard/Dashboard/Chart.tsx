import { useMemo } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { useGetIncomeAnalytics } from "@/api/analytics";
import { useTheme } from "@/hooks/useTheme";
import { Spinner } from "@/components/ui/spinner";

const PIE_COLORS = ["#751BE3", "#E3901B"] as const;
const AREA_COLOR = "#03B4FA";
const UNPAID_COLOR = "#F3E9FF";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatCompact(num: number) {
	if (num >= 1e9) return `${(num / 1e9).toFixed(1).replace(/\.0$/, "")}B`;
	if (num >= 1e6) return `${(num / 1e6).toFixed(1).replace(/\.0$/, "")}M`;
	if (num >= 1e3) return `${(num / 1e3).toFixed(1).replace(/\.0$/, "")}K`;
	return String(Math.round(num));
}

function formatNaira(num: number) {
	return `₦${Number(num || 0).toLocaleString("en-NG")}`;
}

function ChartEmpty({ title, subtitle }: { title: string; subtitle: string }) {
	return (
		<div className="flex items-center justify-center h-64 text-gray-400">
			<div className="text-center">
				<p className="text-sm font-medium">{title}</p>
				<p className="text-xs">{subtitle}</p>
			</div>
		</div>
	);
}

function IncomeTooltip({
	active,
	payload,
	label,
}: {
	active?: boolean;
	payload?: Array<{ value?: number }>;
	label?: string;
}) {
	if (!active || !payload?.length) return null;
	return (
		<div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
			<p className="text-xs text-muted-foreground mb-0.5">{label}</p>
			<p className="font-semibold text-slate-900 dark:text-slate-100">{formatNaira(payload[0]?.value ?? 0)}</p>
		</div>
	);
}

function PieTooltip({
	active,
	payload,
}: {
	active?: boolean;
	payload?: Array<{ name?: string; value?: number }>;
}) {
	if (!active || !payload?.length) return null;
	const item = payload[0];
	return (
		<div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
			<p className="text-xs text-muted-foreground mb-0.5">{item.name}</p>
			<p className="font-semibold text-slate-900 dark:text-slate-100">{formatNaira(item.value ?? 0)}</p>
		</div>
	);
}

export function IndexPieChart() {
	const { data: incomeData, isLoading } = useGetIncomeAnalytics();
	const { isDark } = useTheme();

	const pieData = useMemo(
		() => [
			{ name: "Full Payment", value: incomeData?.fullPayment ?? 0, color: PIE_COLORS[0] },
			{ name: "Hire Purchase", value: incomeData?.hirePurchase ?? 0, color: PIE_COLORS[1] },
		],
		[incomeData],
	);

	const totalIncome = incomeData?.totalIncome ?? 0;
	const sliceTotal = pieData.reduce((sum, d) => sum + d.value, 0);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center w-full h-64">
				<Spinner className="size-8" />
			</div>
		);
	}

	if (sliceTotal === 0) {
		return <ChartEmpty title="No income data" subtitle="All values are currently zero" />;
	}

	return (
		<div className="relative w-full h-64">
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={pieData}
						dataKey="value"
						nameKey="name"
						cx="50%"
						cy="50%"
						innerRadius="62%"
						outerRadius="88%"
						paddingAngle={4}
						cornerRadius={8}
						stroke="none">
						{pieData.map((entry) => (
							<Cell key={entry.name} fill={entry.color} />
						))}
					</Pie>
					<Tooltip content={<PieTooltip />} />
				</PieChart>
			</ResponsiveContainer>

			<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
				<p className={`text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-slate-800"}`}>
					{formatCompact(totalIncome)}
				</p>
				<p className={`text-xs ${isDark ? "text-slate-300" : "text-slate-500"}`}>Total income</p>
				<span
					className="mt-2 rounded-full px-3 py-0.5 text-[11px]"
					style={{
						background: isDark ? "#8826d9" : UNPAID_COLOR,
						color: isDark ? "#fff" : "#9CA3AF",
					}}>
					Yearly
				</span>
			</div>
		</div>
	);
}

export function IndexAreaChart() {
	const { data: incomeData, isLoading } = useGetIncomeAnalytics();
	const { isDark } = useTheme();

	const chartData = useMemo(() => {
		const monthlyData = incomeData?.monthlyIncomeData || [];
		return monthlyData.map((d) => ({
			month: d.monthName?.slice(0, 3) || MONTHS[d.month - 1] || String(d.month),
			income: Number(d.income) || 0,
		}));
	}, [incomeData]);

	const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
	const axisColor = isDark ? "#94A3B8" : "#64748B";
	const gridColor = isDark ? "rgba(148,163,184,0.16)" : "rgba(148,163,184,0.35)";

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-72">
				<Spinner className="size-8" />
			</div>
		);
	}

	if (!chartData.length) {
		return <ChartEmpty title="No income data" subtitle="Monthly income data is not available" />;
	}

	if (totalIncome === 0) {
		return <ChartEmpty title="No income data" subtitle="All income values are currently zero" />;
	}

	return (
		<div className="w-full h-72">
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart data={chartData} margin={{ top: 12, right: 8, left: 0, bottom: 4 }}>
					<defs>
						<linearGradient id="incomeAreaFill" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor={AREA_COLOR} stopOpacity={0.38} />
							<stop offset="70%" stopColor={AREA_COLOR} stopOpacity={0.08} />
							<stop offset="100%" stopColor={AREA_COLOR} stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid stroke={gridColor} strokeDasharray="4 4" vertical={false} />
					<XAxis
						dataKey="month"
						tickLine={false}
						axisLine={false}
						tick={{ fill: axisColor, fontSize: 12 }}
						dy={6}
					/>
					<YAxis
						tickLine={false}
						axisLine={false}
						width={44}
						tick={{ fill: axisColor, fontSize: 11 }}
						tickFormatter={formatCompact}
					/>
					<Tooltip content={<IncomeTooltip />} cursor={{ stroke: AREA_COLOR, strokeOpacity: 0.35, strokeDasharray: "4 4" }} />
					<Area
						type="monotone"
						dataKey="income"
						stroke={AREA_COLOR}
						strokeWidth={2.5}
						fill="url(#incomeAreaFill)"
						dot={false}
						activeDot={{
							r: 5,
							stroke: AREA_COLOR,
							strokeWidth: 2,
							fill: "#fff",
						}}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
