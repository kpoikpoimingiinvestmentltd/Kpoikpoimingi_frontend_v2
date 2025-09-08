import { useState } from "react";
import AuthSkin from "../../components/common/AuthSkin";
import { Input } from "@/components/ui/input";
import { inputStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import { IconWrapper } from "@/assets/icons";
import { EyeClosed, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminResetPassword() {
	const [show, setShow] = useState({ password: false, confirm: false });

	return (
		<AuthSkin title="Reset Password" subtitle="Enter new password">
			<form className="flex flex-col gap-y-6">
				<div className="relative">
					<Input className={twMerge(inputStyle, "h-12 w-full")} type={show.password ? "text" : "password"} placeholder="New password" />
					<button
						className="absolute top-1/2 right-2 -translate-y-1/2 bg-transparent shadow-none hover:bg-gray-100 flex items-center justify-center p-2 rounded-full"
						type="button"
						onClick={() => setShow((prev) => ({ ...prev, password: !prev.password }))}>
						<IconWrapper className="text-xl">{show.password ? <EyeClosed /> : <EyeIcon />}</IconWrapper>
					</button>
				</div>
				<div className="relative">
					<Input className={twMerge(inputStyle, "h-12 w-full")} type={show.confirm ? "text" : "password"} placeholder="Confirm password" />
					<button
						className="absolute top-1/2 right-2 -translate-y-1/2 bg-transparent shadow-none hover:bg-gray-100 flex items-center justify-center p-2 rounded-full"
						type="button"
						onClick={() => setShow((prev) => ({ ...prev, confirm: !prev.confirm }))}>
						<IconWrapper className="text-xl">{show.confirm ? <EyeClosed /> : <EyeIcon />}</IconWrapper>
					</button>
				</div>
				<div className="mt-10">
					<Button className="bg-primary rounded-sm active-scale hover:bg-primary/90 text-black h-12 w-full" type="button">
						Reset Password
					</Button>
				</div>
			</form>
		</AuthSkin>
	);
}
