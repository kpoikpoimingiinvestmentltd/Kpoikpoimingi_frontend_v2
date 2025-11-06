import PageWrapper from "@/components/common/PageWrapper";
import CustomCard from "@/components/base/CustomCard";
import { useState } from "react";

// ...existing code

export default function SelectPaymentMethod() {
	const [selected, setSelected] = useState<"once" | "installment">("installment");

	return (
		<PageWrapper className="md:mx-auto md:max-w-5xl md:w-full">
			<CustomCard className="p-10 mt-10 min-h-[400px] flex items-center overflow-hidden bg-white rounded-lg relative before:absolute before:w-20 before:h-20 before:bg-primary/10 before:rounded-full before:-bottom-5 before:-left-5 after:absolute after:w-20 after:h-20 after:bg-primary/10 after:rounded-full after:-bottom-5 after:-right-5">
				<div className="absolute w-20 h-20 bg-primary/10 rounded-full"></div>
				<div className="max-w-3xl mx-auto text-center">
					<h3 className="text-xl font-semibold">Choose Payment Plan To Buy Property</h3>
					<p className="text-sm text-muted-foreground mt-2">Pick a convenient plan you wish to use in paying for this property</p>

					<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
						<button
							onClick={() => setSelected("once")}
							className={`mx-auto w-[80%] md:w-72 rounded-full py-6 px-8 text-lg font-medium shadow-sm transition-colors duration-150 ${
								selected === "once" ? "bg-primary text-white" : "border-2 border-primary/70 text-primary bg-white"
							}`}>
							Pay at once
						</button>

						<button
							onClick={() => setSelected("installment")}
							className={`mx-auto w-[80%] md:w-72 rounded-full py-6 px-8 text-lg font-medium shadow-lg transition-colors duration-150 ${
								selected === "installment" ? "bg-primary text-white" : "border-2 border-primary/70 text-primary bg-white"
							}`}>
							Pay instalmentlly
						</button>
					</div>

					{/* selection is immediate; no Continue button needed */}
				</div>
			</CustomCard>
		</PageWrapper>
	);
}
