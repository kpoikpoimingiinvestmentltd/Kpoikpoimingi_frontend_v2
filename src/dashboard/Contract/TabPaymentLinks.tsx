import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import ActionButton from "@/components/base/ActionButton";
import { useGetContractPaymentLinks } from "@/api/contracts";
import { Skeleton } from "@/components/common/Skeleton";
import { toast } from "sonner";
import { CopyIcon, IconWrapper } from "@/assets/icons";

interface Contract {
	id: string;
	[key: string]: unknown;
}

export default function TabPaymentLinks({ contract }: { contract?: Contract }) {
	const { data: paymentLinks = [], isLoading } = useGetContractPaymentLinks(contract?.id || "", !!contract?.id);

	const handleCopyLink = (link: string) => {
		navigator.clipboard.writeText(link);
		toast.info("Payment link copied to clipboard!");
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const formatCurrency = (value: string | number) => {
		const num = typeof value === "string" ? parseFloat(value) : value;
		return new Intl.NumberFormat("en-NG", {
			style: "currency",
			currency: "NGN",
		}).format(num);
	};

	const getStatusColor = (status: string) => {
		switch (status?.toUpperCase()) {
			case "PAID":
				return "bg-green-100 text-green-800";
			case "PENDING":
				return "bg-yellow-100 text-yellow-800";
			case "FAILED":
				return "bg-red-100 text-red-800";
			case "EXPIRED":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-blue-100 text-blue-800";
		}
	};

	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<SectionTitle title="Payment Links" />

			{isLoading ? (
				<div className="space-y-4 mt-8">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="space-y-2">
							<Skeleton className="h-16 w-full rounded-lg" />
						</div>
					))}
				</div>
			) : paymentLinks.length === 0 ? (
				<div className="mt-8 p-6 text-center">
					<p className="text-gray-500">No payment links available for this contract.</p>
				</div>
			) : (
				<div className="overflow-x-auto mt-8">
					<Table>
						<TableHeader className="[&_tr]:border-0">
							<TableRow className="bg-[#EAF6FF] hover:bg-[#EAF6FF] h-12 rounded-lg">
								<TableHead className="border-r border-gray-200 text-center">Amount</TableHead>
								<TableHead className="border-r border-gray-200 text-center">Due Date</TableHead>
								<TableHead className="border-r border-gray-200 text-center">Created Date</TableHead>
								<TableHead className="border-r border-gray-200 text-center">Status</TableHead>
								<TableHead className="text-center">Payment Link</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paymentLinks.map((link) => (
								<TableRow key={link.id} className="border-b border-gray-100 hover:bg-gray-50 h-16">
									<TableCell className="border-r border-gray-100 text-center">
										<span className="font-semibold">{formatCurrency(link.amount)}</span>
									</TableCell>
									<TableCell className="border-r border-gray-100 text-center">
										<span>{formatDate(link.dueDate)}</span>
									</TableCell>
									<TableCell className="border-r border-gray-100 text-center">
										<span>{formatDate(link.createdAt)}</span>
									</TableCell>
									<TableCell className="border-r border-gray-100 text-center">
										<span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(link.status?.status)}`}>
											{link.status?.status || "UNKNOWN"}
										</span>
									</TableCell>
									<TableCell className="text-center">
										{link.status?.status?.toUpperCase() === "PAID" ? (
											<span className="text-sm text-green-600 font-medium">Payment Completed</span>
										) : (
											<div className="flex items-center text-sm justify-center gap-2">
												<ActionButton
													variant="outline"
													onClick={() => handleCopyLink(link.paymentLink)}
													className="flex items-center gap-2 text-sm py-1.5 px-2">
													<IconWrapper className="text-lg">
														<CopyIcon />
													</IconWrapper>
													<span> Copy Link</span>
												</ActionButton>
												<ActionButton variant="primary" className="py-1.5" onClick={() => window.open(link.paymentLink, "_blank")}>
													View
												</ActionButton>
											</div>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}
		</CustomCard>
	);
}
