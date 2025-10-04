import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, EyeIcon, IconWrapper } from "@/assets/icons";
import { useNavigate } from "react-router";
import { useState } from "react";
import { _router } from "@/routes/_router";

type Contract = { id: string; title: string };

const contracts: Contract[] = Array.from({ length: 5 }).map((_, i) => ({
	id: `c${i + 1}`,
	title: `Contract For(Hire Purchase): ${i === 0 ? "12 inches HP laptop" : "25kg gas cylinder"}`,
}));

export default function TabContractInfo() {
	const [filter, setFilter] = useState<string>("Completed Contract");
	const navigate = useNavigate();

	const visible = contracts;

	const handleView = (c: Contract) => {
		const path = _router.dashboard.contract;
		navigate(`${path}?contractId=${encodeURIComponent(c.id)}`);
	};

	return (
		<CustomCard className="border-none p-0 bg-white">
			<div className="flex items-center justify-between">
				<SectionTitle title="Contracts" />

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button type="button" className="flex gap-1 items-center rounded-md px-4 py-2 bg-blue-50 text-primary">
							<span className="text-sm">{filter}</span>
							<IconWrapper className="text-xl">
								<ChevronDownIcon />
							</IconWrapper>
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" sideOffset={8} className="w-48">
						<DropdownMenuItem onClick={() => setFilter("Active Contract")}>Active Contract</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setFilter("Pending Contract")}>Pending Contract</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setFilter("Completed Contract")}>Completed Contract</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className="mt-6 space-y-3">
				{visible.map((c) => (
					<div key={c.id} className="flex items-center justify-between bg-[#f8fafc] rounded px-4 py-3">
						<div className="text-sm">{c.title}</div>
						<button onClick={() => handleView(c)} className="text-sm text-primary flex items-center gap-2">
							<EyeIcon />
							<span>View Contract</span>
						</button>
					</div>
				))}
			</div>
		</CustomCard>
	);
}
