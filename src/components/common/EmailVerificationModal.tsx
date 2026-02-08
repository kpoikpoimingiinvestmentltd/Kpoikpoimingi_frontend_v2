import React from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { requestEmailVerification, confirmEmailVerification } from "@/api/customer-registration";
import CustomInput from "../base/CustomInput";

interface EmailVerificationModalProps {
	isOpen: boolean;
	onClose: () => void;
	email: string;
	onVerify: (token: string) => void;
	isLastStep?: boolean;
}

type VerificationStep = "request" | "confirm";

// Custom OTP Input Component
const OTPInput = ({ value, onChange, disabled }: { value: string; onChange: (val: string) => void; disabled: boolean }) => {
	const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

	const handleChange = (index: number, val: string) => {
		const newVal = val.replace(/\D/g, "").slice(0, 1);
		const otpArray = value.split("");
		otpArray[index] = newVal;
		const newOtp = otpArray.join("");
		onChange(newOtp);

		// Auto-focus next input
		if (newVal && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace" && !value[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
		e.preventDefault();
		const pasted = e.clipboardData.getData("text") || "";
		const digits = pasted.replace(/\D/g, "").slice(0, 6);
		if (!digits) return;

		// Determine starting index based on focused input
		const active = document.activeElement as HTMLInputElement | null;
		let startIndex = inputRefs.current.findIndex((r) => r === active);
		if (startIndex < 0) startIndex = 0;

		const otpArray = value.split("");
		while (otpArray.length < 6) otpArray.push("");
		for (let i = 0; i < digits.length && startIndex + i < 6; i++) {
			otpArray[startIndex + i] = digits[i];
		}
		const newOtp = otpArray.join("").slice(0, 6);
		onChange(newOtp);

		// Focus the input after the last pasted digit
		const focusIndex = Math.min(startIndex + digits.length, 5);
		setTimeout(() => {
			inputRefs.current[focusIndex]?.focus();
		}, 0);
	};

	return (
		<div className="flex gap-2 justify-center" onPaste={handlePaste}>
			{Array(6)
				.fill(0)
				.map((_, i) => (
					<CustomInput
						key={i}
						ref={(el) => {
							inputRefs.current[i] = el;
						}}
						type="text"
						value={value[i] || ""}
						onChange={(e) => handleChange(i, e.target.value)}
						onKeyDown={(e) => handleKeyDown(i, e)}
						disabled={disabled}
						placeholder="0"
						className="w-12 h-12 text-center text-lg font-semibold"
						maxLength={1}
					/>
				))}
		</div>
	);
};

export default function EmailVerificationModal({ isOpen, onClose, email, onVerify, isLastStep = false }: EmailVerificationModalProps) {
	// State Management
	const [step, setStep] = React.useState<VerificationStep>("request");
	const [otp, setOtp] = React.useState("");
	const [timer, setTimer] = React.useState(0);

	// Refs
	const timerRef = React.useRef<NodeJS.Timeout | null>(null);

	// Reset state when modal opens/closes
	React.useEffect(() => {
		if (isOpen) {
			setStep("request");
			setOtp("");
			setTimer(0);
		}
	}, [isOpen]);

	// Timer Logic - OTP resend cooldown
	React.useEffect(() => {
		if (timer > 0) {
			timerRef.current = setTimeout(() => {
				setTimer(timer - 1);
			}, 1000);
		} else if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [timer]);

	// React Query Mutations
	const requestOtpMutation = useMutation({
		mutationFn: (emailAddress: string) => requestEmailVerification(emailAddress),
		onSuccess: () => {
			toast.success("OTP sent to your email. Please check your inbox.");
			setStep("confirm");
			setTimer(60);
			setOtp("");
		},
		onError: (error: unknown) => {
			const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || "Failed to send OTP. Please try again.";
			toast.error(errorMessage);
		},
	});

	const confirmOtpMutation = useMutation({
		mutationFn: ({ email: emailToConfirm, otp: otpCode }: { email: string; otp: string }) => confirmEmailVerification(emailToConfirm, otpCode),
		onSuccess: (response) => {
			const token = response?.emailVerificationToken || email;
			if (token) {
				onVerify(token);
				toast.success("Email verified successfully!");
				if (!isLastStep) {
					// Navigate to next step if not the last step
					const currentStep = new URLSearchParams(window.location.search).get("step");
					const nextStep = currentStep ? String(Number(currentStep) + 1) : "2";
					window.history.pushState({}, "", `?step=${nextStep}`);
				}
				// Close modal after successful verification
				setTimeout(() => {
					handleClose();
				}, 500);
			} else {
				toast.error("Verification failed. Please try again.");
			}
		},
		onError: (error: unknown) => {
			const errorMessage = (error as any)?.response?.data?.message || (error as any)?.message || "Invalid OTP. Please try again.";
			toast.error(errorMessage);
		},
	});

	// Request OTP Handler
	const handleRequestOTP = () => {
		if (email.trim()) {
			requestOtpMutation.mutate(email);
		}
	};

	// Confirm OTP Handler
	const handleConfirmOTP = () => {
		if (otp.length !== 6) {
			toast.error("Please enter a valid 6-digit OTP");
			return;
		}
		confirmOtpMutation.mutate({ email, otp });
	};

	const handleClose = () => {
		setStep("request");
		setOtp("");
		setTimer(0);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Verify Your Email</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{/* Step 1: Request OTP */}
					{step === "request" && (
						<>
							<p className="text-sm text-gray-600 dark:text-gray-100">
								We'll send a 6-digit verification code to <strong className="font-semibold">{email}</strong>
							</p>

							<Button type="button" onClick={handleRequestOTP} disabled={requestOtpMutation.isPending} className="w-full">
								{requestOtpMutation.isPending ? (
									<>
										<Spinner className="size-4 mr-2" />
										Sending...
									</>
								) : (
									"Send OTP"
								)}
							</Button>
						</>
					)}

					{/* Step 2: Confirm OTP */}
					{step === "confirm" && (
						<>
							<p className="text-sm text-gray-600 dark:text-gray-100">
								We've sent a 6-digit code to <strong className="font-semibold">{email}</strong>
							</p>

							<div className="space-y-2">
								<label className="text-sm font-medium block">Enter Verification Code</label>
								<OTPInput value={otp} onChange={setOtp} disabled={confirmOtpMutation.isPending} />
							</div>

							<div className="flex gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										if (timer === 0) {
											setOtp("");
											handleRequestOTP();
										}
									}}
									disabled={timer > 0 || requestOtpMutation.isPending}
									className="flex-1">
									{timer > 0 ? `Resend code in ${timer}s` : "Resend Code"}
								</Button>

								<Button type="button" onClick={handleConfirmOTP} disabled={confirmOtpMutation.isPending || otp.length !== 6} className="flex-1">
									{confirmOtpMutation.isPending ? (
										<>
											<Spinner className="size-4 mr-2" />
											Verifying...
										</>
									) : (
										"Verify Email"
									)}
								</Button>
							</div>

							<Button
								type="button"
								variant="ghost"
								onClick={() => {
									setStep("request");
									setOtp("");
									setTimer(0);
								}}
								className="w-full text-sm">
								Use a different email
							</Button>
						</>
					)}

					{step === "confirm" && (
						<p className="text-xs text-gray-500 text-center">Didn't receive the code? Check your spam folder or click "Resend Code"</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
