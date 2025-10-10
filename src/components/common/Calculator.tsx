import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { IconWrapper, CalculatorIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/base/CustomInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { twMerge } from "tailwind-merge";
import { Label } from "../ui/label";
import { labelStyle } from "./commonStyles";

export default function Calculator() {
	const [open, setOpen] = React.useState(false);
	const [principal, setPrincipal] = React.useState(0);
	const [startAmount, setStartAmount] = React.useState(0);
	const [rate, setRate] = React.useState(0);
	const [interval, setInterval] = React.useState("Daily");
	const [duration, setDuration] = React.useState(0);
	const [total, setTotal] = React.useState<number | null>(null);

	const calculate = () => {
		// simple interest placeholder: principal + (principal * rate/100 * duration)
		const t = principal + (principal * rate * (duration / 12)) / 100;
		setTotal(t);
	};

	return (
		<div>
			<Popover open={open} onOpenChange={setOpen}>
				<div
					className={`fixed right-6 bottom-6 z-50 before:content-[''] before:inset-0 before:fixed ${
						open ? "before:z-[29] before:bg-black/50 before:pointer-events-auto" : "before:pointer-events-none"
					}`}>
					<PopoverTrigger asChild>
						<button className="w-14 h-14 z-50 rounded-full bg-gradient-to-t from-[#134DC1] to-[#03B4FA] shadow-lg flex items-center relative justify-center text-white">
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
							<div className="absolute -bottom-5 -right-10 w-0 h-0 border-t-[6px] border-t-transparent border-r-[55px] border-r-white border-b-[71px] border-b-transparent [transform:rotate(-5deg)translate(-44px,26px)] sm:[transform:rotate(-23deg)translate(-32px,20px)]"></div>
							<div className="flex flex-col gap-y-2.5 relative">
								<CustomInput
									type="number"
									labelClassName="mb-1"
									className="h-9 rounded-sm"
									value={principal}
									onChange={(e) => setPrincipal(Number(e.target.value))}
									label="Princing Amount"
								/>
								<CustomInput
									type="number"
									labelClassName="mb-1"
									className="h-9 rounded-sm"
									value={startAmount}
									label="Starting Amount"
									onChange={(e) => setStartAmount(Number(e.target.value))}
								/>
								<CustomInput
									type="number"
									labelClassName="mb-1"
									className="h-9 rounded-sm"
									value={rate}
									label="Interest Rate"
									onChange={(e) => setRate(Number(e.target.value))}
								/>
								<div className="">
									<Label className={labelStyle("font-normal mb-1")}>Interval</Label>
									<Select value={interval} onValueChange={(v) => setInterval(v)}>
										<SelectTrigger className={twMerge("w-full text-sm min-h-9 rounded-sm border")}>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="Daily">Daily</SelectItem>
											<SelectItem value="Monthly">Monthly</SelectItem>
											<SelectItem value="Yearly">Yearly</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<CustomInput
									label="Payment Duration"
									className="h-9 rounded-sm"
									type="number"
									value={duration}
									onChange={(e) => setDuration(Number(e.target.value))}
								/>
								<div className="mt-3">
									<Button className="w-full bg-sky-500 text-white" onClick={calculate}>
										Calculate
									</Button>
								</div>
								{total !== null && (
									<div className="mt-3 bg-gray-50 p-3 rounded">
										<div className="text-sm text-muted-foreground">Total Amount</div>
										<div className="text-lg font-medium">{total.toLocaleString()}</div>
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
