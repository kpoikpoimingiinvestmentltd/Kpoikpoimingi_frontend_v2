import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatPhoneNumber(phone: string): string {
	if (!phone) return "";

	let cleaned = phone.replace(/\D/g, "");

	if (cleaned.startsWith("0")) {
		cleaned = cleaned.slice(1);
	}
	if (cleaned.startsWith("234")) {
		cleaned = cleaned.slice(3);
	}

	cleaned = cleaned.slice(-10);

	return `+234${cleaned}`;
}
