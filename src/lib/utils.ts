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

export function extractErrorMessage(err: unknown, fallback = "An error occurred") {
	if (err && typeof err === "object") {
		const e = err as Record<string, unknown>;
		if (typeof e.message === "string") return e.message;
		// Some libraries put the message under `error` or `data.message`
		if (typeof e.error === "string") return e.error;
		if (e.data && typeof e.data === "object") {
			const d = e.data as Record<string, unknown>;
			if (typeof d.message === "string") return d.message;
		}
	}
	return fallback;
}
