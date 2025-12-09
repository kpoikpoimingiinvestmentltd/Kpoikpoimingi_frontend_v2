import { useState, useEffect } from "react";

/**
 * Custom hook for debouncing search input
 * @param searchValue - The current search value
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @returns debouncedValue - The debounced search value
 */
export function useDebounceSearch(searchValue: string, delay: number = 500): string {
	const [debouncedValue, setDebouncedValue] = useState(searchValue);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(searchValue);
		}, delay);

		return () => clearTimeout(timer);
	}, [searchValue, delay]);

	return debouncedValue;
}
