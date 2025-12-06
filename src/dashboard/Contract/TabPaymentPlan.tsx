import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckIcon, IconWrapper } from "../../assets/icons";
import { useState } from "react";
import ContractSuccessModal from "./ContractSuccessModal";
// import { Dialog, DialogContent } from "@/components/ui/dialog";
// import ActionButton from "@/components/base/ActionButton";
import { toast } from "sonner";
import { useGetPaymentSchedules, useGeneratePaymentLink, type PaymentLinkResponse } from "@/api/contracts";
import { Skeleton } from "@/components/common/Skeleton";
import { twMerge } from "tailwind-merge";

interface Contract {
	id: string;
	property?: {
		name: string;
	};
	[key: string]: unknown;
}

export default function TabPaymentPlan({ contract }: { contract?: Contract }) {
	const [linkOpen, setLinkOpen] = useState(false);
	const [generatedLink, setGeneratedLink] = useState<PaymentLinkResponse | null>(null);
	const [loadingScheduleId, setLoadingScheduleId] = useState<string | null>(null);

	const {
		data: schedules = [],
		isLoading,
		isFetching,
	} = useGetPaymentSchedules(
		contract?.id || "",
		true,
		5 * 60 * 1000 // 5 minutes in milliseconds
	);

	const generateLinkMutation = useGeneratePaymentLink(
		(data) => {
			setGeneratedLink(data);
			setLoadingScheduleId(null);
			setLinkOpen(true);
			toast.success("Payment link generated successfully!");
		},
		(err) => {
			const message = (err as { message?: string })?.message ?? "Failed to generate payment link";
			toast.error(message);
			setLoadingScheduleId(null);
		}
	);

	const handleGenerateLink = (scheduleId: string) => {
		setLoadingScheduleId(scheduleId);
		generateLinkMutation.mutate(scheduleId);
	};

	// Format schedule data for display
	const displaySchedules = Array.isArray(schedules)
		? schedules.map((schedule: Record<string, unknown>) => ({
				id: schedule.id,
				date: new Date(schedule.dueDate as string).toLocaleDateString(),
				amount: Number(schedule.amount as number).toLocaleString(),
				lateFees: Number((schedule.lateFees as number) || 0).toLocaleString(),
				totalDue: Number((schedule.totalDue as number) || 0).toLocaleString(),
				isPaid: schedule.isPaid,
				isDefaulted: schedule.isDefaulted,
				displayStatus: schedule.displayStatus,
				canGenerateLink: schedule.canGenerateLink,
				paymentLink: schedule.paymentLink,
		  }))
		: [];

	const totalAmount = (Array.isArray(schedules) ? schedules : [])
		.reduce((sum: number, s: Record<string, unknown>) => sum + Number(s.amount as number), 0)
		.toLocaleString();

	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<SectionTitle title="Payment Plan & Schedule" />
			<CustomCard className="mt-8 p-0 border-0">
				{isLoading || isFetching ? (
					<div className="space-y-4">
						<div className="p-3 rounded-md bg-card">
							<Skeleton className="h-4 w-40" />
						</div>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader className="[&_tr]:border-0">
									<TableRow className="bg-[#EAF6FF] hover:bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
										<TableHead className="border-r border-gray-200 text-center">Payment #</TableHead>
										<TableHead className="border-r border-gray-200 text-center">Due Date</TableHead>
										<TableHead className="border-r border-gray-200 text-center">Amount</TableHead>
										<TableHead className="border-r border-gray-200 text-center">Late Fees</TableHead>
										<TableHead className="border-r border-gray-200 text-center">Total Due</TableHead>
										<TableHead className="text-center">Status & Payment Link</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{[...Array(5)].map((_, i) => (
										<TableRow key={i} className="hover:bg-[#F6FBFF]">
											<TableCell className="py-6 border-r border-gray-200 text-center">
												<Skeleton className="h-4 w-8 mx-auto" />
											</TableCell>
											<TableCell className="py-6 border-r border-gray-200 text-center">
												<Skeleton className="h-4 w-24 mx-auto" />
											</TableCell>
											<TableCell className="py-6 border-r border-gray-200 text-center">
												<Skeleton className="h-4 w-20 mx-auto" />
											</TableCell>
											<TableCell className="py-6 border-r border-gray-200 text-center">
												<Skeleton className="h-4 w-16 mx-auto" />
											</TableCell>
											<TableCell className="py-6 border-r border-gray-200 text-center">
												<Skeleton className="h-4 w-20 mx-auto" />
											</TableCell>
											<TableCell className="py-6 text-center">
												<Skeleton className="h-8 w-32 mx-auto rounded-full" />
											</TableCell>
										</TableRow>
									))}
									<TableRow>
										<TableCell className="py-4 border-r border-gray-200"></TableCell>
										<TableCell className="py-4 border-r border-gray-200"></TableCell>
										<TableCell className="py-4 text-center font-medium border-r border-gray-200">
											<Skeleton className="h-4 w-12 mx-auto" />
										</TableCell>
										<TableCell className="py-4 text-center border-r border-gray-200"></TableCell>
										<TableCell className="py-4 text-center font-medium border-r border-gray-200">
											<Skeleton className="h-4 w-24 mx-auto" />
										</TableCell>
										<TableCell className="py-4" />
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</div>
				) : Array.isArray(schedules) && schedules.length === 0 ? (
					<div className="text-center py-12 text-gray-500">No payment schedules available</div>
				) : (
					<>
						<div className="text-sm mb-4 p-3 rounded-md bg-card">
							Payment for : <span className="font-medium">{contract?.property?.name || "Property"}</span>
						</div>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader className="[&_tr]:border-0">
									<TableRow className="bg-[#EAF6FF] hover:bg-[#EAF6FF] h-12 overflow-hidden py-4 rounded-lg">
										<TableHead className="border-r border-gray-200 text-center">Payment #</TableHead>
										<TableHead className="border-r border-gray-200 text-center">Due Date</TableHead>
										<TableHead className="border-r border-gray-200 text-center">Amount</TableHead>
										<TableHead className="border-r border-gray-200 text-center">Late Fees</TableHead>
										<TableHead className="border-r border-gray-200 text-center">Total Due</TableHead>
										<TableHead className="text-center">Status & Payment Link</TableHead>
									</TableRow>
								</TableHeader>

								<TableBody>
									{displaySchedules.map((schedule: Record<string, unknown>, i: number) => (
										<TableRow key={schedule.id as string} className="hover:bg-[#F6FBFF]">
											<TableCell className="py-6 border-r border-gray-200 text-center">{i + 1}</TableCell>
											<TableCell className="py-6 border-r border-gray-200 text-center">{schedule.date as string}</TableCell>
											<TableCell className="py-6 border-r border-gray-200 text-center">₦{schedule.amount as number}</TableCell>
											<TableCell className="py-6 border-r border-gray-200 text-center">₦{schedule.lateFees as number}</TableCell>
											<TableCell className="py-6 border-r border-gray-200 text-center">₦{schedule.totalDue as number}</TableCell>
											<TableCell className="py-6 text-center">
												{(schedule.isPaid as boolean) ? (
													<div className="flex justify-center items-center gap-2 font-medium">
														<IconWrapper className="text-2xl text-emerald-600">
															<CheckIcon />
														</IconWrapper>
														<span>Paid</span>
													</div>
												) : (schedule.isDefaulted as boolean) ? (
													<div className="flex justify-center items-center gap-3">
														<span className="text-red-500 font-medium">Defaulted</span>
														{(schedule.paymentLinkUrl as string) ? (
															<>
																<button
																	onClick={() => handleGenerateLink(schedule.id as string)}
																	disabled={loadingScheduleId === (schedule.id as string)}
																	className="active-scale bg-white text-transparent bg-clip-text bg-gradient-to-r from-[#03B4FA] to-[#026B94] px-6 py-2 rounded-l-none text-sm shadow-xl disabled:opacity-50">
																	{loadingScheduleId === (schedule.id as string) ? "Generating..." : "Generate Link"}
																</button>
															</>
														) : (
															(schedule.canGenerateLink as boolean) && (
																<button
																	onClick={() => handleGenerateLink(schedule.id as string)}
																	disabled={loadingScheduleId === (schedule.id as string)}
																	className="active-scale bg-white text-transparent bg-clip-text bg-gradient-to-r from-[#03B4FA] to-[#026B94] px-6 py-2 rounded-l-none text-sm shadow-xl disabled:opacity-50">
																	{loadingScheduleId === (schedule.id as string) ? "Generating..." : "Generate Link"}
																</button>
															)
														)}
													</div>
												) : (
													<div>
														{(schedule.paymentLinkUrl as string) ? (
															<div className="flex justify-center items-center">
																<button
																	onClick={() => handleGenerateLink(schedule.id as string)}
																	disabled={loadingScheduleId === (schedule.id as string)}
																	className={twMerge(
																		"active-scale bg-white text-transparent bg-clip-text bg-gradient-to-r from-[#03B4FA] to-[#026B94] disabled:bg-white disabled:opacity-90 border border-stone-100 px-6 py-2 rounded-full rounded-l-none text-sm shadow-xl",
																		loadingScheduleId === (schedule.id as string) && "opacity-50 cursor-not-allowed"
																	)}>
																	{loadingScheduleId === (schedule.id as string) ? "Generating..." : "Generate Link"}
																</button>
															</div>
														) : (
															<button
																onClick={() => handleGenerateLink(schedule.id as string)}
																disabled={loadingScheduleId === (schedule.id as string)}
																className={twMerge(
																	"active-scale bg-white text-transparent bg-clip-text bg-gradient-to-r from-[#03B4FA] to-[#026B94] px-6 py-2 rounded-full rounded-l-none text-sm shadow-xl",
																	loadingScheduleId === (schedule.id as string) && "opacity-50 cursor-not-allowed"
																)}>
																{loadingScheduleId === (schedule.id as string) ? "Generating..." : "Generate Link"}
															</button>
														)}
													</div>
												)}
											</TableCell>
										</TableRow>
									))}

									<TableRow>
										<TableCell className="py-4 border-r border-gray-200"></TableCell>
										<TableCell className="py-4 border-r border-gray-200"></TableCell>
										<TableCell className="py-4 text-center font-medium border-r border-gray-200">Total</TableCell>
										<TableCell className="py-4 text-center border-r border-gray-200"></TableCell>
										<TableCell className="py-4 text-center font-medium border-r border-gray-200">₦{totalAmount}</TableCell>
										<TableCell className="py-4" />
									</TableRow>
								</TableBody>
							</Table>
						</div>

						<div className="mt-6 flex items-center flex-col max-w-md w-full mx-auto gap-y-3">
							<button className="w-full max-w-md mx-auto bg-primary px-4 py-2.5 active-scale transition text-white rounded-md">
								Generate Custom Payment Link
							</button>
							<p className="text-xs font-medium text-muted-foreground text-center mt-2">
								Clicking on custom payment link, you can generate payment link to cover all or more than one part of the payment
							</p>
						</div>
					</>
				)}
			</CustomCard>

			{/* Payment Link Generated Modal */}
			{generatedLink && (
				<ContractSuccessModal
					open={linkOpen}
					onOpenChange={setLinkOpen}
					link={generatedLink.paymentLink}
					onSend={() => toast.success("Email sent!")}
				/>
			)}

			{/* Payment modal for existing payment links */}
			{/* {paymentModalLink && (
				<Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
					<DialogContent>
						<div className="flex flex-col items-center gap-6 py-6 px-4 w-full">
							<div className="text-lg font-semibold">Make Payment</div>

							<div className="mb-3 w-full">
								<span className="text-sm font-medium mb-1">Payment Link</span>
								<p className="text-sm [word-break:break-all] text-muted-foreground">{paymentModalLink}</p>
							</div>

							<div className="flex gap-3 justify-center mt-4">
								<ActionButton
									onClick={async () => {
										if (navigator?.clipboard && paymentModalLink) {
											await navigator.clipboard.writeText(paymentModalLink);
											toast.info("Link copied to clipboard!");
										}
										setPaymentModalOpen(false);
									}}
									className="px-6 w-max">
									Copy Link
								</ActionButton>
								<ActionButton
									onClick={() => {
										window.open(paymentModalLink || "", "_blank");
										setPaymentModalOpen(false);
									}}
									className="px-6 w-max">
									Make payment now
								</ActionButton>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)} */}
		</CustomCard>
	);
}
