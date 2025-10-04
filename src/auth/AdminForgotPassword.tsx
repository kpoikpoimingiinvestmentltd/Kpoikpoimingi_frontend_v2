import { useState } from "react";
import AuthSkin from "@/components/common/AuthSkin";
import CustomInput from "@/components/base/CustomInput";
import CodeInputs from "@/components/base/CodeInputs";
import { twMerge } from "tailwind-merge";
import { Link } from "react-router";
import { _router } from "@/routes/_router";
import { Button } from "@/components/ui/button";
import { inputStyle } from "@/components/common/commonStyles";

export default function AdminForgotPassword() {
	const [stepperLevel, setStepperLevel] = useState(1);
	const [verificationCode, setVerificationCode] = useState("");

	const handleCodeChange = (code: string) => {
		setVerificationCode(code);
	};

	return (
		<AuthSkin
			title={stepperLevel === 1 ? "Forgot Password" : "Check your mail"}
			subtitle={stepperLevel === 1 ? "Enter your email to reset your password." : "Enter the code we just sent to you"}>
			<form action="">
				{stepperLevel === 1 ? (
					<div className="flex flex-col gap-y-6">
						<div>
							<CustomInput className={twMerge(inputStyle, "h-12 w-full")} type="email" placeholder="Your email address" />
							<div className="flex justify-end mt-2">
								<p className="text-sm">
									Remember Password?{" "}
									<Link to={_router.auth.login} className="underline">
										Login
									</Link>
								</p>
							</div>
						</div>
						<div className="mt-10">
							<Button
								className="bg-primary active-scale rounded-md text-sm hover:bg-primary/90 text-black h-12 w-full"
								type="button"
								onClick={() => setStepperLevel(2)}>
								Send Code
							</Button>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-y-6">
						<CodeInputs defaultLength={6} autoFocus={true} onChange={handleCodeChange} inputClassName="!text-xl" className="w-full gap-3" />
						<div className="text-center">
							<p className="text-sm">
								Entered wrong email?{" "}
								<button onClick={() => setStepperLevel(1)} type="button" className="underline">
									Re-enter
								</button>
							</p>
						</div>
						<div className="mt-10">
							<Button
								className="bg-primary rounded-md active-scale hover:bg-primary/90 text-black text-sm h-12 w-full"
								type="button"
								disabled={verificationCode.length < 6}>
								Verify code
							</Button>
							<div className="text-center mt-5">
								<p className="text-sm">
									Didn't get the code?{" "}
									<button onClick={() => setStepperLevel(1)} type="button" className="underline text-yellow-600">
										Resend it
									</button>
								</p>
							</div>
						</div>
					</div>
				)}
			</form>
		</AuthSkin>
	);
}
