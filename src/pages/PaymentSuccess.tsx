import { CheckIcon, IconWrapper } from "@/assets/icons";

export default function PaymentSuccess() {
	return (
		<div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
			<div className="max-w-md w-full rounded-2xl shadow-sm p-8 text-center bg-white dark:bg-gray-800 border dark:border-gray-700">
				{/* Success Icon */}
				<div className="mb-6">
					<div className="w-max bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto p-3 mb-4">
						<IconWrapper className="text-green-600 dark:text-green-400 text-5xl">
							<CheckIcon />
						</IconWrapper>
					</div>
					<h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Payment Successful!</h1>
					<p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
						Your payment has been processed successfully. You will receive a confirmation email shortly.
					</p>
				</div>

				{/* Payment Details Card */}
				<div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6 border dark:border-gray-600">
					<div className="text-gray-500 dark:text-gray-400 text-sm mb-1">Transaction Status</div>
					<div className="text-green-600 dark:text-green-400 text-lg font-semibold mb-3">Completed</div>
				</div>

				{/* Additional Info */}
				<div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
					<p className="text-gray-500 text-xs">If you have any questions about your payment, please contact our support team.</p>
				</div>
			</div>
		</div>
	);
}
