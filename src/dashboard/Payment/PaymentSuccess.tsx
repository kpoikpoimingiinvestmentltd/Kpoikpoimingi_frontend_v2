import { CheckIcon, IconWrapper } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router";
import { _router } from "@/routes/_router";
import { useEffect } from "react";

export default function PaymentSuccess() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const ref = searchParams.get("ref");
		if (!ref) {
			navigate(_router.dashboard.index);
		}
	}, [navigate, searchParams]);

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
				{/* Success Icon */}
				<div className="mb-6">
					<div className="w-max bg-green-100 rounded-full flex items-center justify-center mx-auto p-3 mb-4">
						<IconWrapper className="text-green-600 text-3xl">
							<CheckIcon />
						</IconWrapper>
					</div>
					<h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
					<p className="text-gray-600 text-sm leading-relaxed">
						Your payment has been processed successfully. You will receive a confirmation email shortly.
					</p>
				</div>

				{/* Payment Details Card */}
				<div className="bg-gray-50 rounded-xl p-4 mb-6">
					<div className="text-sm text-gray-500 mb-1">Transaction Status</div>
					<div className="text-lg font-semibold text-green-600 mb-3">Completed</div>
					<div className="text-xs text-gray-400">Reference: {searchParams.get("ref") || "N/A"}</div>
				</div>

				{/* Action Buttons */}
				<div className="space-y-3">
					<Button
						onClick={() => navigate(_router.dashboard.index)}
						className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium">
						Return to Dashboard
					</Button>
					<Button
						onClick={() => navigate(_router.dashboard.receipt)}
						variant="outline"
						className="w-full py-3 rounded-lg font-medium border-gray-300 text-gray-700 hover:bg-gray-50">
						View Receipts
					</Button>
				</div>

				{/* Additional Info */}
				<div className="mt-6 pt-6 border-t border-gray-200">
					<p className="text-xs text-gray-500">If you have any questions about your payment, please contact our support team.</p>
				</div>
			</div>
		</div>
	);
}
