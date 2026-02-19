import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<Button variant="outline" size="icon" className="h-9 w-9">
				<Sun className="h-[1.2rem] w-[1.2rem]" />
			</Button>
		);
	}

	const isDark = theme === "dark";

	return (
		<Button variant="outline" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")} className="h-9 w-9" aria-label="Toggle theme">
			{isDark ? (
				<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
			) : (
				<Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
