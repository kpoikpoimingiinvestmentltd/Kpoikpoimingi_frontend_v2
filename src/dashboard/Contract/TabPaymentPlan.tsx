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

interface PaymentSchedule {
	id: string;
	dueDate: string;
	amount: number;
	lateFees: number;
	totalDue: number;
	isPaid: boolean;
	isDefaulted: boolean;
	displayStatus: string;
	canGenerateLink: boolean;
	paymentLink?: string;
}

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

	const { data: schedules = [], isLoading } = useGetPaymentSchedules(contract?.id || "");

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
	const displaySchedules = (schedules as unknown as PaymentSchedule[]).map((schedule) => ({
		id: schedule.id,
		date: new Date(schedule.dueDate).toLocaleDateString(),
		amount: Number(schedule.amount).toLocaleString(),
		lateFees: Number(schedule.lateFees || 0).toLocaleString(),
		totalDue: Number(schedule.totalDue || 0).toLocaleString(),
		isPaid: schedule.isPaid,
		isDefaulted: schedule.isDefaulted,
		displayStatus: schedule.displayStatus,
		canGenerateLink: schedule.canGenerateLink,
		paymentLink: schedule.paymentLink,
		// paymentLinkUrl: (schedule as any)?.paymentLink?.paymentLink ?? null,
	}));

	const totalAmount = (schedules as any[]).reduce((sum: number, s: any) => sum + Number(s.amount), 0).toLocaleString();

	// Payment modal state for opening existing payment links
	// const [paymentModalOpen, setPaymentModalOpen] = useState(false);
	// const [paymentModalLink, setPaymentModalLink] = useState<string | null>(null);

	// const openPaymentModal = (link?: string | null) => {
	// 	if (!link) return;
	// 	setPaymentModalLink(link);
	// 	setPaymentModalOpen(true);
	// };

	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<SectionTitle title="Payment Plan & Schedule" />
			<CustomCard className="mt-8 p-0 border-0">
				{isLoading ? (
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
				) : (schedules as any[]).length === 0 ? (
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
									{displaySchedules.map((schedule: any, i: number) => (
										<TableRow key={schedule.id} className="hover:bg-[#F6FBFF]">
											<TableCell className="py-6 border-r border-gray-200 text-center">{i + 1}</TableCell>
											<TableCell className="py-6 border-r border-gray-200 text-center">{schedule.date}</TableCell>
											<TableCell className="py-6 border-r border-gray-200 text-center">₦{schedule.amount}</TableCell>
											<TableCell className="py-6 border-r border-gray-200 text-center">₦{schedule.lateFees}</TableCell>
											<TableCell className="py-6 border-r border-gray-200 text-center">₦{schedule.totalDue}</TableCell>
											<TableCell className="py-6 text-center">
												{schedule.isPaid ? (
													<div className="flex justify-center items-center gap-2 font-medium">
														<IconWrapper className="text-2xl text-emerald-600">
															<CheckIcon />
														</IconWrapper>
														<span>Paid</span>
													</div>
												) : schedule.isDefaulted ? (
													<div className="flex justify-center items-center gap-3">
														<span className="text-red-500 font-medium">Defaulted</span>
														{schedule.paymentLinkUrl ? (
															<>
																{/* <button
																	onClick={() => openPaymentModal(schedule.paymentLinkUrl)}
																	className="bg-primary text-white px-4 py-2 rounded-md text-sm">
																	Pay
																</button> */}
																<button
																	onClick={() => handleGenerateLink(schedule.id)}
																	disabled={loadingScheduleId === schedule.id || !schedule.canGenerateLink}
																	className="active-scale bg-white text-transparent bg-clip-text bg-gradient-to-r from-[#03B4FA] to-[#026B94] px-6 py-2 rounded-l-none text-sm shadow-xl disabled:opacity-50">
																	{loadingScheduleId === schedule.id ? "Generating..." : "Generate Link"}
																</button>
															</>
														) : (
															schedule.canGenerateLink && (
																<button
																	onClick={() => handleGenerateLink(schedule.id)}
																	disabled={loadingScheduleId === schedule.id}
																	className="active-scale bg-white text-transparent bg-clip-text bg-gradient-to-r from-[#03B4FA] to-[#026B94] px-6 py-2 rounded-l-none text-sm shadow-xl disabled:opacity-50">
																	{loadingScheduleId === schedule.id ? "Generating..." : "Generate Link"}
																</button>
															)
														)}
													</div>
												) : (
													<div>
														{schedule.paymentLinkUrl ? (
															<div className="flex justify-center items-center">
																{/* <button
																	onClick={() => openPaymentModal(schedule.paymentLinkUrl)}
																	className="bg-primary text-white px-4 py-2 rounded-full rounded-r-none text-sm">
																	Pay
																</button> */}
																<button
																	onClick={() => handleGenerateLink(schedule.id)}
																	disabled={!schedule.canGenerateLink || loadingScheduleId === schedule.id}
																	className={twMerge(
																		"active-scale bg-white text-transparent bg-clip-text bg-gradient-to-r from-[#03B4FA] to-[#026B94] disabled:bg-white disabled:opacity-90 border border-stone-100 px-6 py-2 rounded-full rounded-l-none text-sm shadow-xl",
																		(!schedule.canGenerateLink || loadingScheduleId === schedule.id) && "opacity-50 cursor-not-allowed"
																	)}>
																	{loadingScheduleId === schedule.id ? "Generating..." : "Generate Link"}
																</button>
															</div>
														) : (
															<button
																onClick={() => handleGenerateLink(schedule.id)}
																disabled={!schedule.canGenerateLink || loadingScheduleId === schedule.id}
																className={twMerge(
																	"active-scale bg-white text-transparent bg-clip-text bg-gradient-to-r from-[#03B4FA] to-[#026B94] px-6 py-2 rounded-full rounded-l-none text-sm shadow-xl",
																	(!schedule.canGenerateLink || loadingScheduleId === schedule.id) && "opacity-50 cursor-not-allowed"
																)}>
																{loadingScheduleId === schedule.id ? "Generating..." : "Generate Link"}
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
