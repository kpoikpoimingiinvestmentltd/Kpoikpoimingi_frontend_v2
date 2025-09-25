import * as React from "react";
import { twMerge } from "tailwind-merge";
import { Input } from "@/components/ui/input";
// icons can be passed via iconLeft/iconRight props

type InputFieldProps = React.ComponentProps<typeof Input> & {
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	action?: React.ReactNode; // arbitrary action element appended to the right
	accent?: boolean; // show accent border or background
	passwordToggle?: boolean; // if true, show password visibility toggle when type === 'password'
};

export default function InputField({
	iconLeft,
	iconRight,
	action,
	className = "",
	accent = false,
	passwordToggle = false,
	type,
	...props
}: InputFieldProps) {
	const [show, setShow] = React.useState(false);
	const finalType = React.useMemo(() => {
		if (passwordToggle && type === "password") return show ? "text" : "password";
		return type;
	}, [passwordToggle, type, show]);

	return (
		<div className={twMerge("relative flex items-center rounded-md border bg-transparent", accent ? "ring-1 ring-primary/20" : "", className)}>
			{iconLeft ? <span className="pl-2 pr-3">{iconLeft}</span> : null}

			<Input {...(props as any)} type={finalType} className={twMerge("flex-1 border-0 bg-transparent px-2 py-1", (props as any).className)} />

			{iconRight ? <span className="pr-2 pl-3">{iconRight}</span> : null}

			{passwordToggle && type === "password" ? (
				<button
					type="button"
					onClick={() => setShow((s) => !s)}
					className="px-2 py-1 text-sm text-muted-foreground"
					aria-label={show ? "Hide password" : "Show password"}>
					{show ? "Hide" : "Show"}
				</button>
			) : null}

			{action ? <div className="pl-2 pr-2">{action}</div> : null}
		</div>
	);
}

export type { InputFieldProps };
