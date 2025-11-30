import { pie, arc, type PieArcDatum } from "d3";
import { scaleTime, scaleLinear, line as d3line, max, area as d3area, curveMonotoneX } from "d3";
import { useGetIncomeAnalytics } from "@/api/analytics";
import { Spinner } from "@/components/ui/spinner";

type Item = { name: string; value: number };

export function IndexPieChart() {
	const { data: incomeData, isLoading } = useGetIncomeAnalytics();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center w-full h-64">
				<Spinner className="size-8" />
			</div>
		);
	}

	const pieData: Item[] = [
		{ name: "Full Payment", value: incomeData?.fullPayment ?? 0 },
		{ name: "Hire Purchase", value: incomeData?.hirePurchase ?? 0 },
		{ name: "Unpaid Debt", value: incomeData?.unpaidDebt ?? 0 },
	];

	// Check if all values are zero
	const totalValue = pieData.reduce((sum, item) => sum + item.value, 0);
	if (totalValue === 0) {
		return (
			<div className="flex items-center justify-center w-full h-64 text-gray-400">
				<div className="text-center">
					<p className="text-sm font-medium">No income data</p>
					<p className="text-xs">All values are currently zero</p>
				</div>
			</div>
		);
	}

	const radius = 550; // Chart base dimensions
	const gap = 0.08; // Gap between slices
	// Smaller value -> thinner white separator (thinner donut bars)
	const lightStrokeEffect = 4; // 3d light effect around the slice

	// Pie layout and arc generator
	const pieLayout = pie<Item>()
		.value((d) => d.value)
		.padAngle(gap); // Creates a gap between slices

	// Adjust innerRadius to create a donut shape
	const innerRadius = radius / 1.225;
	const arcGenerator = arc<PieArcDatum<Item>>()
		.innerRadius(innerRadius)
		.outerRadius(radius)
		.cornerRadius(lightStrokeEffect + 2);

	// Create an arc generator for the clip path that matches the outer path of the arc
	const arcClip =
		arc<PieArcDatum<Item>>()
			.innerRadius(innerRadius + lightStrokeEffect / 2)
			.outerRadius(radius)
			.cornerRadius(lightStrokeEffect + 2) || undefined;

	const arcs = pieLayout(pieData);

	const colors = ["#751BE314", "#751BE3", "#E3901B"];

	return (
		<div className="relative">
			<svg viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`} className="max-w-[14.5rem] mx-auto">
				{/* Define clip paths and colors for each slice */}
				<defs>
					{arcs.map((d, i) => (
						<clipPath key={`donut-c0-clip-${i}`} id={`donut-c0-clip-${i}`}>
							<path d={arcClip(d) || undefined} />
							<linearGradient key={i} id={`donut-c0-gradient-${i}`}>
								<stop offset="55%" stopColor={colors[i]} stopOpacity={0.95} />
							</linearGradient>
						</clipPath>
					))}
				</defs>

				{/* Slices */}
				{arcs.map((d, i) => (
					<g key={i}>
						{/* Use the clip path on this group or individual path */}
						<g clipPath={`url(#donut-c0-clip-${i})`}>
							<path
								fill={`url(#donut-c0-gradient-${i})`}
								stroke="#ffffff33" // Lighter stroke for a 3D effect
								strokeWidth={lightStrokeEffect} // Adjust stroke width for the desired effect
								d={arcGenerator(d) || undefined}
							/>
						</g>
						{/* labels removed per design (no text inside curved bars) */}
					</g>
				))}
			</svg>
		</div>
	);
}

export const IndexAreaChart = () => {
	const { data: incomeData, isLoading } = useGetIncomeAnalytics();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-72">
				<Spinner className="size-8" />
			</div>
		);
	}

	// Convert monthly data to chart format
	const monthlyData = incomeData?.monthlyIncomeData || [];
	const chartData = monthlyData.map((d) => ({
		date: new Date(2024, d.month - 1, 1), // Use current year
		value: d.income,
	}));

	if (!chartData || chartData.length === 0) {
		return (
			<div className="flex items-center justify-center h-72 text-gray-400">
				<div className="text-center">
					<p className="text-sm font-medium">No income data</p>
					<p className="text-xs">Monthly income data is not available</p>
				</div>
			</div>
		);
	}

	// Check if all values are zero
	const totalIncome = chartData.reduce((sum: number, item: any) => sum + item.value, 0);
	if (totalIncome === 0) {
		return (
			<div className="flex items-center justify-center h-72 text-gray-400">
				<div className="text-center">
					<p className="text-sm font-medium">No income data</p>
					<p className="text-xs">All income values are currently zero</p>
				</div>
			</div>
		);
	}

	let areaChartData = chartData as { date: Date; value: number }[];
	// Area chart implementation goes here
	let xScale = scaleTime()
		.domain([areaChartData[0].date, areaChartData[areaChartData.length - 1].date])
		.range([0, 100]);

	let yScale = scaleLinear()
		.domain([0, max(areaChartData, (d: any) => d.value) ?? 0])
		.range([100, 0]);

	let line = d3line<(typeof areaChartData)[number]>()
		.x((d) => xScale(d.date))
		.y((d) => yScale(d.value))
		.curve(curveMonotoneX);

	let area = d3area<(typeof areaChartData)[number]>()
		.x((d) => xScale(d.date))
		.y0(yScale(0))
		.y1((d) => yScale(d.value))
		.curve(curveMonotoneX);

	let areaPath = area(areaChartData) ?? undefined;

	let d = line(areaChartData);

	if (!d) {
		return null;
	}

	// Month labels for x-axis
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	return (
		<div className="relative h-72 w-full">
			<div className="absolute inset-0 h-full w-full overflow-visible">
				{/* Chart area */}
				<svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
					{/* Area with blue gradient */}
					<defs>
						<linearGradient id="blueAreaGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#03B4FA" stopOpacity="0.7" />
							<stop offset="100%" stopColor="#03B4FA" stopOpacity="0" />
						</linearGradient>
					</defs>
					<path d={areaPath} fill="url(#blueAreaGradient)" />

					{/* Line */}
					<path d={d} fill="none" stroke="#03B4FA" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
				</svg>

				{/* X axis: months only, closer spacing */}
				{months.map((month, i) => (
					<div
						key={month}
						style={{
							left: `${(i / months.length) * 100 + 100 / (months.length * 2)}%`,
							top: "90%",
						}}
						className="absolute text-xs text-zinc-500 -translate-x-1/2">
						{month}
					</div>
				))}
			</div>
			{/* Y axis removed */}
		</div>
	);
};
