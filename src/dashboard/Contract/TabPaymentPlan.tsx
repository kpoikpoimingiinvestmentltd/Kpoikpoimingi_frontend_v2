import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckIcon, IconWrapper } from "../../assets/icons";
import { useState } from "react";
import SuccessModal from "@/components/common/SuccessModal";
import { toast } from "sonner";
import { useGetPaymentSchedules } from "@/api/contracts";
import { Spinner } from "@/components/ui/spinner";
import { twMerge } from "tailwind-merge";

export default function TabPaymentPlan({ contract }: { contract?: any }) {
	const [linkOpen, setLinkOpen] = useState(false);
	const generatedLink = "https://docs.google.com/document/d/1y5xR.JxMrQ7?vcP2nwM4gXll-fcq5lY_8Ufi";

	const { data: schedules = [], isLoading } = useGetPaymentSchedules(contract?.id) as any;

	const handleGenerateLink = () => {
		setLinkOpen(true);
	};

	const handleCopyLink = () => {
		navigator.clipboard.writeText(generatedLink);
		toast.success("Link copied to clipboard!");
	};

	// Format schedule data for display
	const displaySchedules = (schedules as any[]).map((schedule: any) => ({
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
	}));

	const totalAmount = (schedules as any[]).reduce((sum: number, s: any) => sum + Number(s.amount), 0).toLocaleString();
	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<SectionTitle title="Payment Plan & Schedule" />
			<CustomCard className="mt-8 p-0 border-0">
				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<Spinner className="size-6" />
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
														{schedule.canGenerateLink && (
															<button
																onClick={handleGenerateLink}
																className="active-scale bg-white text-transparent bg-clip-text bg-gradient-to-r from-[#03B4FA] to-[#026B94] px-6 py-2 rounded-full text-sm shadow-xl">
																Generate Link
															</button>
														)}
													</div>
												) : (
													<button
														onClick={handleGenerateLink}
														className={twMerge(
															"active-scale bg-white text-transparent bg-clip-text bg-gradient-to-r from-[#03B4FA] to-[#026B94] px-6 py-2 rounded-full rounded-l-none text-sm shadow-xl",
															!schedule.canGenerateLink && "opacity-50 cursor-not-allowed"
														)}
														disabled={!schedule.canGenerateLink}>
														Generate Link
													</button>
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
			<SuccessModal
				open={linkOpen}
				onOpenChange={setLinkOpen}
				title="Payment Link Generated"
				icon={<CheckIcon />}
				actionsLayout="horizontal"
				fields={[
					{
						label: "Link",
						value: generatedLink,
						variant: "block",
					},
				]}
				actions={[
					{
						label: "Send Via Email",
						onClick: () => toast.success("Email sent!"),
						variant: "primary",
						fullWidth: false,
						closeOnClick: true,
					},
					{
						label: "Copy Link",
						onClick: handleCopyLink,
						variant: "outline",
						fullWidth: false,
						closeOnClick: false,
					},
				]}
			/>
		</CustomCard>
	);
}
