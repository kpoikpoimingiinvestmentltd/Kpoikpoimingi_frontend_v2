import { pie, arc, type PieArcDatum } from "d3";
import { scaleTime, scaleLinear, line as d3line, max, area as d3area, curveMonotoneX } from "d3";

type Item = { name: string; value: number };
const data: Item[] = [
	{ name: "AAPL", value: 25 },
	{ name: "BTC", value: 25 },
	{ name: "GOLD", value: 50 },
];

export function IndexPieChart() {
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

	const arcs = pieLayout(data);

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

const sales = [
	{ date: "2023-04-30", value: 4 },
	{ date: "2023-05-01", value: 6 },
	{ date: "2023-05-02", value: 8 },
	{ date: "2023-05-03", value: 7 },
	{ date: "2023-05-04", value: 10 },
	{ date: "2023-05-05", value: 12 },
	{ date: "2023-05-06", value: 10.5 },
	{ date: "2023-05-07", value: 6 },
	{ date: "2023-05-08", value: 8 },
	{ date: "2023-05-09", value: 7.5 },
	{ date: "2023-05-10", value: 6 },
	{ date: "2023-05-11", value: 8 },
	{ date: "2023-05-12", value: 9 },
	{ date: "2023-05-13", value: 10 },
	{ date: "2023-05-14", value: 17 },
	{ date: "2023-05-15", value: 14 },
	{ date: "2023-05-16", value: 15 },
	{ date: "2023-05-17", value: 20 },
	{ date: "2023-05-18", value: 18 },
	{ date: "2023-05-19", value: 16 },
	{ date: "2023-05-20", value: 15 },
	{ date: "2023-05-21", value: 16 },
	{ date: "2023-05-22", value: 13 },
	{ date: "2023-05-23", value: 11 },
	{ date: "2023-05-24", value: 11 },
	{ date: "2023-05-25", value: 13 },
	{ date: "2023-05-26", value: 12 },
	{ date: "2023-05-27", value: 9 },
	{ date: "2023-05-28", value: 8 },
	{ date: "2023-05-29", value: 10 },
	{ date: "2023-05-30", value: 11 },
	{ date: "2023-05-31", value: 8 },
	{ date: "2023-06-01", value: 9 },
	{ date: "2023-06-02", value: 10 },
	{ date: "2023-06-03", value: 12 },
	{ date: "2023-06-04", value: 13 },
	{ date: "2023-06-05", value: 15 },
	{ date: "2023-06-06", value: 13.5 },
	{ date: "2023-06-07", value: 13 },
	{ date: "2023-06-08", value: 13 },
	{ date: "2023-06-09", value: 14 },
	{ date: "2023-06-10", value: 13 },
	{ date: "2023-06-11", value: 12.5 },
];
let areaChartData = sales.map((d) => ({ ...d, date: new Date(d.date) }));

export const IndexAreaChart = () => {
	// Area chart implementation goes here
	let xScale = scaleTime()
		.domain([areaChartData[0].date, areaChartData[areaChartData.length - 1].date])
		.range([0, 100]);

	let yScale = scaleLinear()
		.domain([0, max(areaChartData.map((d) => d.value)) ?? 0])
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
