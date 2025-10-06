import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { IconWrapper, CalculatorIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/base/CustomInput";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { twMerge } from "tailwind-merge";

export default function SimpleCalculator() {
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
				<div className="fixed right-6 bottom-6 z-50">
					<PopoverTrigger asChild>
						<button className="w-14 h-14 rounded-full bg-sky-500 shadow-lg flex items-center justify-center text-white">
							<IconWrapper>
								<CalculatorIcon />
							</IconWrapper>
						</button>
					</PopoverTrigger>

					<PopoverContent className="w-80 p-4">
						<div className="text-lg font-medium mb-3">Simple Interest Calculator</div>
						<div className="space-y-3">
							<CustomInput type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} placeholder="Principal Amount" />
							<CustomInput type="number" value={startAmount} onChange={(e) => setStartAmount(Number(e.target.value))} placeholder="Starting Amount" />
							<CustomInput type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} placeholder="Interest Rate" />
							<div>
								<Select value={interval} onValueChange={(v) => setInterval(v)}>
									<SelectTrigger className={twMerge("w-full min-h-11 border")}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Daily">Daily</SelectItem>
										<SelectItem value="Monthly">Monthly</SelectItem>
										<SelectItem value="Yearly">Yearly</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<CustomInput type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} placeholder="Payment Duration" />

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
					</PopoverContent>
				</div>
			</Popover>
		</div>
	);
}
