import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { IconWrapper, CalculatorIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/base/CustomInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { twMerge } from "tailwind-merge";
import { Label } from "../ui/label";
import { labelStyle } from "./commonStyles";

const simpleInterestCalculator = ({
	pi: principal,
	ri: interestRate,
	ti: time,
	ii: interval,
}: {
	pi: number;
	ri: number;
	ti: number;
	ii: string;
}) => {
	// Defensive defaults
	const P = Number(principal) || 0;
	const R = Number(interestRate) || 0; // percent per annum, convert to decimal
	const T = Number(time) || 0;

	// Step 1: Convert Duration to Years based on interval
	let timeInYears: number;
	switch (String(interval).toLowerCase()) {
		case "daily":
			timeInYears = T / 365;
			break;
		case "weekly":
			timeInYears = T / 52;
			break;
		case "monthly":
			timeInYears = T / 12;
			break;
		default:
			timeInYears = T; // assume already in years
	}

	// Step 2: Calculate Interest Amount
	// Formula: Principal × Interest Rate × Time in Years
	const interestAmount = P * (R / 100) * timeInYears;

	// Step 3: Calculate Total Payable
	// Formula: Principal + Interest Amount
	const totalPayable = P + interestAmount;

	// Round to 2 decimal places
	return Number(Math.round(totalPayable * 100) / 100);
};

export default function Calculator() {
	const [open, setOpen] = React.useState(false);
	const [principal, setPrincipal] = React.useState(0);
	const [startingAmount, setStartingAmount] = React.useState(0);
	const [rate, setRate] = React.useState(0);
	const [interval, setInterval] = React.useState("daily");
	const [duration, setDuration] = React.useState(0);
	const [total, setTotal] = React.useState<number | null>(null);
	const [position, setPosition] = React.useState({
		x: typeof window !== "undefined" ? window.innerWidth - 100 : 0,
		y: typeof window !== "undefined" ? window.innerHeight - 80 : 0,
	});
	const [isDragging, setIsDragging] = React.useState(false);
	const [dragOffset, setDragOffset] = React.useState({ x: 0, y: 0 });
	const [hasBeenDragged, setHasBeenDragged] = React.useState(false);

	// Get max duration based on interval
	const getMaxDuration = () => {
		switch (interval) {
			case "daily":
				return 366; // Leap year
			case "weekly":
				return 52;
			case "monthly":
				return 12;
			default:
				return 366;
		}
	};

	const maxDuration = getMaxDuration();

	// Handle duration change with validation
	const handleDurationChange = (value: number) => {
		if (value <= maxDuration) {
			setDuration(value);
		}
	};

	const calculate = () => {
		const effectivePrincipal = principal - startingAmount;
		const result = simpleInterestCalculator({
			pi: effectivePrincipal,
			ri: rate,
			ti: duration,
			ii: interval,
		});
		setTotal(result);
	};

	const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
		if ((e.target as HTMLElement).closest("button")) {
			setIsDragging(true);
			setHasBeenDragged(true);
			setDragOffset({
				x: e.clientX - position.x,
				y: e.clientY - position.y,
			});
		}
	};

	const handleMouseMove = React.useCallback(
		(e: MouseEvent) => {
			if (!isDragging) return;
			setPosition({
				x: e.clientX - dragOffset.x,
				y: e.clientY - dragOffset.y,
			});
		},
		[isDragging, dragOffset],
	);

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	React.useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}
	}, [isDragging, handleMouseMove]);

	// Reset calculator to right side on window resize if not dragged
	React.useEffect(() => {
		const handleResize = () => {
			if (!hasBeenDragged) {
				setPosition({
					x: window.innerWidth - 100,
					y: window.innerHeight - 80,
				});
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [hasBeenDragged]);

	return (
		<div>
			<Popover
				open={open}
				onOpenChange={(isOpen) => {
					setOpen(isOpen);
					if (!isOpen) {
						// Clear inputs when closing
						setPrincipal(0);
						setStartingAmount(0);
						setRate(0);
						setInterval("daily");
						setDuration(0);
						setTotal(null);
					}
				}}>
				<div
					className={`fixed z-50 right-6 bottom-6 before:content-[''] before:inset-0 before:fixed ${
						open ? "before:z-[29] before:bg-black/50 before:pointer-events-auto" : "before:pointer-events-none"
					}`}
					style={{
						left: `${position.x}px`,
						top: `${position.y}px`,
						cursor: isDragging ? "grabbing" : "grab",
						transition: isDragging ? "none" : "none",
					}}>
					<PopoverTrigger asChild>
						<button
							className="w-14 h-14 z-50 rounded-full bg-gradient-to-t from-[#134DC1] to-[#03B4FA] shadow-lg flex items-center relative justify-center text-white"
							onMouseDown={handleMouseDown}
							style={{ cursor: isDragging ? "grabbing" : "grab" }}>
							<div className="absolute w-4/5 h-4/5 flex items-center justify-center bg-white rounded-full text-primary">
								<IconWrapper className="text-xl">
									<CalculatorIcon />
								</IconWrapper>
							</div>
						</button>
					</PopoverTrigger>

					<PopoverContent className="w-80 mr-10 mb-8 sm:px-8 sm:pb-5 sm:mr-24 sm:mb-0 relative p-4">
						<header className="text-center">
							<div className="text-lg font-medium mb-3">Simple Interest Calculator</div>
						</header>
						<div className="relative">
							<div className="absolute -bottom-5 -right-10 w-0 h-0 border-t-[6px] border-t-transparent border-r-[55px] dark:border-r-neutral-900 border-r-white border-b-[71px] border-b-transparent [transform:rotate(-5deg)translate(-44px,26px)] sm:[transform:rotate(-23deg)translate(-32px,20px)]"></div>
							<div className="flex flex-col gap-y-2.5 relative">
								<CustomInput
									type="number"
									labelClassName="mb-1"
									className="h-9 rounded-sm"
									value={principal}
									onChange={(e) => setPrincipal(Number(e.target.value))}
									label="Principal Amount"
								/>
								<CustomInput
									type="number"
									labelClassName="mb-1"
									className="h-9 rounded-sm"
									value={startingAmount}
									onChange={(e) => setStartingAmount(Number(e.target.value))}
									label="Starting Amount"
								/>
								<CustomInput
									type="number"
									labelClassName="mb-1"
									className="h-9 rounded-sm"
									value={rate}
									label="Interest Rate (%)"
									onChange={(e) => setRate(Number(e.target.value))}
								/>
								<div className="">
									<Label className={labelStyle("font-normal mb-1")}>Interval</Label>
									<Select
										value={interval}
										onValueChange={(v) => {
											setInterval(v);
											// Reset duration if it exceeds new max
											const newMaxDuration = v === "daily" ? 366 : v === "weekly" ? 52 : v === "monthly" ? 12 : 366;
											if (duration > newMaxDuration) {
												setDuration(0);
											}
										}}>
										<SelectTrigger className={twMerge("w-full text-sm min-h-9 rounded-sm border")}>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="daily">Daily</SelectItem>
											<SelectItem value="weekly">Weekly</SelectItem>
											<SelectItem value="monthly">Monthly</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<CustomInput
									label={`Payment Duration (${interval})`}
									className="h-9 rounded-sm"
									type="number"
									value={duration}
									onChange={(e) => handleDurationChange(Number(e.target.value))}
									max={maxDuration}
								/>
								<div className="mt-3">
									<Button className="w-full bg-sky-500 text-white" onClick={calculate}>
										Calculate
									</Button>
								</div>
								{total !== null && (
									<div className="mt-3 bg-gray-50 dark:bg-neutral-800 p-3 rounded">
										<div className="text-sm text-muted-foreground dark:text-gray-300">Total Payable</div>
										<div className="text-lg font-medium dark:text-white">₦{total.toLocaleString()}</div>
									</div>
								)}
							</div>
						</div>
					</PopoverContent>
				</div>
			</Popover>
		</div>
	);
}
