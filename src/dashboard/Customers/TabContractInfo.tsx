import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, EyeIcon, IconWrapper } from "@/assets/icons";
import KeyValueRow from "@/components/common/KeyValueRow";
import StatusBadge from "@/components/base/StatusBadge";
import { useNavigate } from "react-router";
import { useState } from "react";
import { _router } from "@/routes/_router";
import { type CustomerContract } from "@/api/contracts";
import { Skeleton } from "@/components/common/Skeleton";

interface TabContractInfoProps {
	contracts?: {
		data?: CustomerContract[];
		pagination?: Record<string, unknown>;
	};
	isLoading?: boolean;
}

export default function TabContractInfo({ contracts, isLoading = false }: TabContractInfoProps) {
	const [filter, setFilter] = useState<string>("All Contracts");
	const navigate = useNavigate();

	const allContracts = contracts?.data || [];

	const displayLabel = filter === "All Contracts" ? "All contracts" : filter.toLowerCase();
	// Filter contracts based on selected filter
	const filteredContracts = allContracts.filter((contract: CustomerContract) => {
		if (filter === "ACTIVE") return contract.status?.status === "ACTIVE";
		if (filter === "PAUSED") return contract.isPaused === true || contract.status?.status === "PAUSED";
		if (filter === "PENDING") return contract.status?.status === "PENDING";
		if (filter === "COMPLETED") return contract.status?.status === "COMPLETED" || contract.isTerminated === true;
		if (filter === "TERMINATED") return contract.status?.status === "TERMINATED";
		if (filter === "CANCELLED") return contract.status?.status === "CANCELLED";
		if (filter === "PENDING_DOWN_PAYMENT") return contract.status?.status === "PENDING_DOWN_PAYMENT" || contract.statusId === 1;
		return true; // All Contracts or default
	});

	const handleView = (contractId: string) => {
		const path = _router.dashboard.contractDetails.replace(":id", contractId);
		navigate(path);
	};

	const handleClearFilter = () => {
		setFilter("All Contracts");
	};

	return (
		<CustomCard className="border-none p-0 bg-white">
			<div className="flex items-center justify-between">
				<SectionTitle title="Contracts" />

				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button type="button" className="flex gap-1 items-center rounded-md px-4 py-2 bg-blue-50 text-primary">
								<span className="text-sm capitalize">{displayLabel}</span>
								<IconWrapper className="text-xl">
									<ChevronDownIcon />
								</IconWrapper>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" sideOffset={8} className="w-56">
							<DropdownMenuItem onClick={() => setFilter("All Contracts")}>All Contracts</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilter("PENDING")}>Pending</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilter("PAUSED")}>Paused</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilter("ACTIVE")}>Active</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilter("COMPLETED")}>Completed</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilter("TERMINATED")}>Terminated</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilter("CANCELLED")}>Cancelled</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setFilter("PENDING_DOWN_PAYMENT")}>Pending Down Payment</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{filter !== "All Contracts" && (
						<button onClick={handleClearFilter} className="text-xs px-3 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition">
							Clear
						</button>
					)}
				</div>
			</div>

			<div className="mt-6 space-y-3">
				{isLoading ? (
					// Skeleton loaders
					<>
						{[...Array(3)].map((_, i) => (
							<div key={i} className="flex items-center gap-8 justify-between bg-[#f8fafc] rounded px-4 py-3">
								<Skeleton className="h-6 w-2/3" />
								<Skeleton className="h-6 w-24" />
							</div>
						))}
					</>
				) : filteredContracts.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						<p>No {filter.toLowerCase()} found</p>
					</div>
				) : // Special rendering when ACTIVE selected: show first active contract fully, then list the rest
				filter === "ACTIVE" ? (
					(() => {
						const firstActive = filteredContracts.find((c) => c.status?.status === "ACTIVE");
						const rest = filteredContracts.filter((c) => c.id !== firstActive?.id);

						return (
							<div className="space-y-4">
								{firstActive ? (
									<CustomCard className="bg-card rounded p-5 shadow-none">
										<div className="flex items-center justify-between mb-3">
											<div>
												<p className="text-sm font-semibold">{firstActive.contractCode}</p>
												<p className="text-xs text-gray-600">{firstActive.property?.name}</p>
											</div>
											<div className="flex items-center gap-2">
												<button
													onClick={() => handleView(firstActive.id)}
													className="text-sm bg-primary flex text-white rounded-md p-2.5 items-center gap-2 whitespace-nowrap">
													<IconWrapper>
														<EyeIcon />
													</IconWrapper>
													<span className="text-sm">View more details</span>
												</button>
											</div>
										</div>

										<div className="grid grid-cols-1 gap-3">
											<KeyValueRow label="Contract Code" value={firstActive.contractCode} />
											<KeyValueRow label="Property" value={firstActive.property?.name} />
											<KeyValueRow label="Status" value={<StatusBadge status={firstActive.status?.status ?? "-"} />} />

											<KeyValueRow label="Price" value={`₦${Number(firstActive.property?.price || 0).toLocaleString()}`} />
											<KeyValueRow label="Outstanding" value={`₦${Number(firstActive.outStandingBalance || 0).toLocaleString()}`} />

											<KeyValueRow
												label="Down Payment"
												value={firstActive.downPayment ? `₦${Number(firstActive.downPayment).toLocaleString()}` : "-"}
											/>
											<KeyValueRow label="Quantity" value={firstActive.quantity ?? "-"} />

											<KeyValueRow label="Payment Type" value={firstActive.paymentType?.type ?? "-"} />
											<KeyValueRow
												label="Interval"
												value={String(
													(firstActive.interval as Record<string, unknown> | null)?.intervals ??
														(firstActive.durationUnit as Record<string, unknown> | null)?.duration ??
														"-"
												)}
											/>

											<KeyValueRow
												label="Duration"
												value={
													firstActive.durationValue
														? `${firstActive.durationValue} ${String((firstActive.durationUnit as Record<string, unknown> | null)?.duration ?? "")}`
														: "-"
												}
											/>
											<KeyValueRow label="Interest Rate" value={firstActive.interestRate ? `${firstActive.interestRate}%` : "-"} />

											<KeyValueRow
												label="VAT"
												value={firstActive.vat ? `₦${Number(firstActive.vat).toLocaleString()} (${firstActive.vatPercentage ?? "-"})` : "-"}
											/>
											<KeyValueRow label="Interest" value={firstActive.interest ? `₦${Number(firstActive.interest).toLocaleString()}` : "-"} />

											<KeyValueRow label="Start Date" value={firstActive.startDate ? new Date(firstActive.startDate).toLocaleDateString() : "-"} />
											<KeyValueRow label="End Date" value={firstActive.endDate ? new Date(firstActive.endDate).toLocaleDateString() : "-"} />

											<KeyValueRow label="Remarks" value={firstActive.remarks ?? "-"} />
											<KeyValueRow label="Created By" value={firstActive.createdBy?.fullName ?? "-"} />
											<KeyValueRow label="Created At" value={firstActive.createdAt ? new Date(firstActive.createdAt).toLocaleString() : "-"} />
										</div>
									</CustomCard>
								) : null}

								<div className="space-y-2">
									{rest.map((contract) => (
										<div key={contract.id} className="flex items-center gap-8 justify-between bg-[#f8fafc] rounded px-4 py-3">
											<div className="flex-1">
												<p className="text-sm font-medium">{contract.contractCode}</p>
												<p className="text-xs text-gray-600 mt-1">{contract.property?.name}</p>
												<p className="text-xs text-gray-500 mt-0.5">Outstanding: ₦{Number(contract.outStandingBalance).toLocaleString()}</p>
											</div>
											<button onClick={() => handleView(contract.id)} className="text-sm text-primary flex items-center gap-2 whitespace-nowrap">
												<IconWrapper>
													<EyeIcon />
												</IconWrapper>
												<span className="text-sm">View</span>
											</button>
										</div>
									))}
								</div>
							</div>
						);
					})()
				) : (
					// For non-ACTIVE statuses just list compact items with view button
					filteredContracts.map((contract: CustomerContract) => (
						<div key={contract.id} className="flex items-center gap-8 justify-between bg-[#f8fafc] rounded px-4 py-3">
							<div className="flex-1">
								<p className="text-sm font-medium">{contract.contractCode}</p>
								<p className="text-xs text-gray-600 mt-1">{contract.property?.name}</p>
								<p className="text-xs text-gray-500 mt-0.5">Outstanding: ₦{Number(contract.outStandingBalance).toLocaleString()}</p>
							</div>
							<button onClick={() => handleView(contract.id)} className="text-sm text-primary flex items-center gap-2 whitespace-nowrap">
								<IconWrapper>
									<EyeIcon />
								</IconWrapper>
								<span className="text-sm">View contract</span>
							</button>
						</div>
					))
				)}
			</div>
		</CustomCard>
	);
}
