import CustomInput from "@/components/base/CustomInput";
import { checkboxStyle, inputStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { IconWrapper } from "@/assets/icons";
import { Link } from "react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { _router } from "@/routes/_router";
import { EyeIcon } from "lucide-react";
import AuthSkin from "@/components/common/AuthSkin";

export default function AdminLogin() {
	return (
		<AuthSkin title="Admin Login" subtitle="Kindly fill in the details to log in">
			<form action="" className="flex flex-col gap-y-6">
				<div>
					<Label htmlFor="email" className="mb-2 block font-normal">
						Email address
					</Label>
					<CustomInput className={`${twMerge(inputStyle, "h-11 rounded-sm bg-card")} w-full`} type="email" placeholder="Enter here" />
				</div>
				<div>
					<div className="relative">
						<Label htmlFor="password" className="mb-2 block font-normal">
							Password
						</Label>
						<div className="relative">
							<CustomInput className={`${twMerge(inputStyle, "h-11 rounded-sm bg-card")} w-full`} type="password" placeholder="Enter here" />
							<button
								className="absolute top-1/2 right-2 -translate-y-1/2 bg-transparent shadow-none hover:bg-gray-100 flex items-center justify-center p-2 rounded-full"
								type="button">
								<IconWrapper className="text-xl">
									<EyeIcon />
								</IconWrapper>
							</button>
						</div>
					</div>
					<div className="flex items-center justify-between gap-5 mt-4">
						<div className="flex items-center gap-2">
							<Checkbox className={`${checkboxStyle} [&_*_svg]:text-black`} id="remember" />
							<Label htmlFor="remember" className="font-normal cursor-pointer">
								Remember me
							</Label>
						</div>
						<Link to={_router.auth.forgotpassword} className="underline text-sm">
							Forgot password
						</Link>
					</div>
				</div>

				<div className="mt-10">
					<Button className="bg-primary rounded-sm active-scale hover:bg-primary/90 text-white h-12 w-full" type="button">
						Log in
					</Button>
				</div>
			</form>
		</AuthSkin>
	);
}
