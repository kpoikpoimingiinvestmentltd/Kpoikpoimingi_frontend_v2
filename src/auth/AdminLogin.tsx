import CustomInput from "@/components/base/CustomInput";
import { checkboxStyle, inputStyle } from "@/components/common/commonStyles";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { IconWrapper } from "@/assets/icons";
import { Link, useNavigate } from "react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { _router } from "@/routes/_router";
import { EyeIcon } from "lucide-react";
import AuthSkin from "@/components/common/AuthSkin";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/schemas/auth";
import { useLogin } from "@/api/auth";
import { useDispatch } from "react-redux";
import { setAuth } from "@/store/authSlice";

export default function AdminLogin() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { register, handleSubmit } = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
	});

	const mutation = useLogin((data) => {
		dispatch(setAuth({ id: data.id, accessToken: data.accessToken, refreshToken: data.refreshToken }));
		navigate(_router.dashboard.index);
	});
	return (
		<AuthSkin title="Admin Login" subtitle="Kindly fill in the details to log in">
			<form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="flex flex-col gap-y-6">
				<CustomInput
					label="Email address"
					className={`${twMerge(inputStyle, "h-11 rounded-sm bg-card")} w-full`}
					{...register("email")}
					type="email"
					placeholder="Enter here"
				/>
				<div className="relative">
					<Label htmlFor="password" className="mb-2 block font-normal">
						Password
					</Label>
					<div className="relative">
						<CustomInput
							{...register("password")}
							className={`${twMerge(inputStyle, "h-11 rounded-sm bg-card")} w-full`}
							type="password"
							placeholder="Enter here"
						/>
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

				<div className="mt-10">
					<Button
						className="bg-primary rounded-sm active-scale hover:bg-primary/90 text-white h-12 w-full"
						type="submit"
						disabled={mutation.isPending}>
						{mutation.isPending ? "Logging in..." : "Log in"}
					</Button>
				</div>
			</form>
		</AuthSkin>
	);
}
