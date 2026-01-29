import { useTheme as useNextTheme } from "next-themes";

/**
 * Custom hook for accessing and managing theme state.
 * Provides the current theme and function to update it.
 *
 * @returns {Object} Theme utilities
 * @property {string | undefined} theme - Current theme: 'light', 'dark', or 'system'
 * @property {function} setTheme - Function to change the theme
 * @property {string | undefined} resolvedTheme - Actual resolved theme ('light' or 'dark')
 */
export function useTheme() {
	const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme();

	return {
		theme,
		setTheme,
		resolvedTheme,
		systemTheme,
		isDark: resolvedTheme === "dark",
		isLight: resolvedTheme === "light",
	};
}
