import React from "react";
import type { OncePaymentForm, InstallmentPaymentForm, FileUploadState } from "@/types/customerRegistration";

type FormState = OncePaymentForm | InstallmentPaymentForm;

const DRAFT_KEY = "customer_registration_draft";
const UPLOADED_FILES_KEY = "customer_registration_uploaded_files";

export function useCustomerFormState(paymentMethod?: "once" | "installment", initial?: any) {
	const initializeFormState = (): FormState => {
		if (paymentMethod === "once") {
			try {
				const raw = localStorage.getItem(DRAFT_KEY);
				if (raw) {
					const parsed = JSON.parse(raw);
					if (parsed.properties) {
						return parsed;
					}
				}
			} catch (err) {
				console.warn("Failed to parse customer draft from localStorage", err);
			}

			return {
				fullName: initial?.fullName ?? "",
				email: initial?.email ?? "",
				whatsapp: initial?.whatsapp ?? "",
				numberOfProperties: initial?.numberOfProperties ?? "",
				properties: initial?.properties ?? [{ propertyName: "", quantity: 1 }],
			} as OncePaymentForm;
		}

		try {
			const raw = localStorage.getItem(DRAFT_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				if (parsed.nextOfKin && !parsed.properties) {
					return parsed;
				}
			}
		} catch (err) {
			console.warn("Failed to parse customer draft from localStorage", err);
		}

		return {
			fullName: initial?.fullName ?? "",
			email: initial?.email ?? "",
			whatsapp: initial?.whatsapp ?? "",
			dob: initial?.dob ?? "",
			address: initial?.address ?? "",
			isDriver: initial?.isDriver ?? undefined,
			nextOfKin: initial?.nextOfKin ?? { fullName: "", phone: "", relationship: "", spouseName: "", spousePhone: "", address: "" },
			propertyName: initial?.propertyName ?? "",
			paymentFrequency: initial?.paymentFrequency ?? "",
			paymentDurationUnit: initial?.paymentDurationUnit ?? "",
			paymentDuration: initial?.paymentDuration ?? "",
			downPayment: initial?.downPayment ?? "",
			amountAvailable: initial?.amountAvailable ?? "",
			clarification: initial?.clarification ?? { previousAgreement: null, completedAgreement: null, prevCompany: "", reason: "" },
			employment: initial?.employment ?? { status: "", employerName: "", employerAddress: "", companyName: "", businessAddress: "", homeAddress: "" },
			guarantors: initial?.guarantors ?? [
				{
					fullName: "",
					occupation: "",
					phone: "",
					email: "",
					employmentStatus: "",
					homeAddress: "",
					businessAddress: "",
					stateOfOrigin: "",
					votersUploaded: 0,
				},
				{
					fullName: "",
					occupation: "",
					phone: "",
					email: "",
					employmentStatus: "",
					homeAddress: "",
					businessAddress: "",
					stateOfOrigin: "",
					votersUploaded: 0,
				},
			],
		} as InstallmentPaymentForm;
	};

	const [form, setForm] = React.useState(initializeFormState);
	const [uploadedFiles, setUploadedFiles] = React.useState<FileUploadState>({});
	const uploadedFieldsRef = React.useRef<Set<string>>(new Set());

	// Load uploaded files metadata on mount
	React.useEffect(() => {
		try {
			const filesRaw = localStorage.getItem(UPLOADED_FILES_KEY);
			if (filesRaw) {
				const filesParsed = JSON.parse(filesRaw);
				setUploadedFiles(filesParsed);
			}
		} catch (err) {
			console.warn("Failed to load uploaded files metadata", err);
		}
	}, []);

	// Save form data to localStorage (debounced)
	const saveTimer = React.useRef<number | null>(null);
	React.useEffect(() => {
		if (saveTimer.current) {
			window.clearTimeout(saveTimer.current);
		}
		saveTimer.current = window.setTimeout(() => {
			try {
				localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
			} catch (err) {
				console.warn("Failed to save customer draft", err);
			}
		}, 400) as unknown as number;

		return () => {
			if (saveTimer.current) window.clearTimeout(saveTimer.current);
		};
	}, [form]);

	// Save uploaded files metadata to localStorage
	const filesTimer = React.useRef<number | null>(null);
	React.useEffect(() => {
		if (filesTimer.current) {
			window.clearTimeout(filesTimer.current);
		}
		filesTimer.current = window.setTimeout(() => {
			try {
				localStorage.setItem(UPLOADED_FILES_KEY, JSON.stringify(uploadedFiles));
			} catch (err) {
				console.warn("Failed to save uploaded files metadata", err);
			}
		}, 400) as unknown as number;

		return () => {
			if (filesTimer.current) window.clearTimeout(filesTimer.current);
		};
	}, [uploadedFiles]);

	const handleChange = (key: string, value: any) => setForm((s) => ({ ...s, [key]: value }));

	const resetFormCompletely = () => {
		try {
			localStorage.removeItem(DRAFT_KEY);
			localStorage.removeItem(UPLOADED_FILES_KEY);
		} catch (err) {
			console.warn("Failed to clear localStorage", err);
		}

		setForm(initializeFormState());
		setUploadedFiles({});
		uploadedFieldsRef.current.clear();
	};

	return {
		form,
		uploadedFiles,
		setUploadedFiles,
		uploadedFieldsRef,
		handleChange,
		resetFormCompletely,
	};
}
