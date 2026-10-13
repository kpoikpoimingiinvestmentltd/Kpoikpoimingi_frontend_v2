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
		const normalize = (msg: unknown) => {
			if (typeof msg === "string") return msg;
			if (Array.isArray(msg)) return msg.filter((m) => typeof m === "string").join(", ");
			return null;
		};
		const fromMessage = normalize(e.message);
		if (fromMessage) return fromMessage;
		if (typeof e.error === "string") return e.error;
		if (e.data && typeof e.data === "object") {
			const d = e.data as Record<string, unknown>;
			const fromData = normalize(d.message);
			if (fromData) return fromData;
		}
	}
	return fallback;
}

export function formatDate(dateInput?: string | Date | number | null, options?: Intl.DateTimeFormatOptions, locale = "en-NG") {
	if (dateInput === undefined || dateInput === null || dateInput === "") return "-";
	try {
		const d = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
		if (!d || Number.isNaN((d as Date).getTime())) return String(dateInput);
		return (d as Date).toLocaleDateString(locale, options ?? { year: "numeric", month: "short", day: "numeric" });
	} catch {
		return String(dateInput);
	}
}

export function getFileIcon(fileUrl: string, mediaImages: Record<string, string>) {
	const cleanUrl = fileUrl.split("?")[0];
	const extension = cleanUrl.split(".").pop()?.toLowerCase() || "";

	if (extension === "png") {
		return mediaImages.pngImage || mediaImages.pdfImage;
	} else if (extension === "jpg" || extension === "jpeg") {
		return mediaImages.jpgImage || mediaImages.pdfImage;
	}
	return mediaImages.pdfImage;
}
