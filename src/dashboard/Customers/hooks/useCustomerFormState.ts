import React from "react";
import type { OncePaymentForm, InstallmentPaymentForm, FileUploadState } from "@/types/customerRegistration";
import { transformCustomerToInstallmentForm, transformCustomerToOnceForm, transformMediaToUploadedFiles } from "../helpers/transformCustomerToForm";

type FormState = OncePaymentForm | InstallmentPaymentForm;

const DRAFT_KEY = "customer_registration_draft";
const UPLOADED_FILES_KEY = "customer_registration_uploaded_files";

export function useCustomerFormState(paymentMethod?: "once" | "installment", initial?: any) {
	const initializeFormState = (): FormState => {
		if (initial) {
			if (paymentMethod === "once") {
				return transformCustomerToOnceForm(initial);
			} else {
				return transformCustomerToInstallmentForm(initial);
			}
		}

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
				fullName: "",
				email: "",
				whatsapp: "",
				numberOfProperties: "",
				properties: [{ propertyName: "", quantity: 1 }],
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
			fullName: "",
			email: "",
			whatsapp: "",
			dob: "",
			address: "",
			isDriver: undefined,
			nextOfKin: { fullName: "", phone: "", relationship: "", spouseName: "", spousePhone: "", address: "" },
			propertyId: "",
			propertyName: "",
			isCustomProperty: false,
			customPropertyPrice: "",
			paymentFrequency: "",
			paymentDurationUnit: "",
			paymentDuration: "",
			downPayment: "",
			amountAvailable: "",
			clarification: { previousAgreement: null, completedAgreement: null, prevCompany: "", reason: "" },
			employment: { status: "", employerName: "", employerAddress: "", companyName: "", businessAddress: "", homeAddress: "" },
			guarantors: [
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
	const [uploadedFiles, setUploadedFiles] = React.useState<FileUploadState>(() => {
		// If initial data has mediaFiles, use those
		if (initial?.mediaFiles) {
			return transformMediaToUploadedFiles(initial.mediaFiles);
		}
		return {};
	});
	const uploadedFieldsRef = React.useRef<Set<string>>(new Set());

	// Initialize uploadedFieldsRef when initial data is provided
	React.useEffect(() => {
		if (initial?.mediaFiles) {
			const mediaFiles = initial.mediaFiles;
			if (mediaFiles.identificationDocument?.length) uploadedFieldsRef.current.add("nin");
			if (mediaFiles.driverLicense?.length) uploadedFieldsRef.current.add("driverLicense");
			if (mediaFiles.indegeneCertificate?.length) uploadedFieldsRef.current.add("indigeneCertificate");
			if (mediaFiles.signedContract?.length) uploadedFieldsRef.current.add("contract");
			if (mediaFiles.guarantor_0_doc?.length) uploadedFieldsRef.current.add("guarantor_0_doc");
			if (mediaFiles.guarantor_1_doc?.length) uploadedFieldsRef.current.add("guarantor_1_doc");
			if (mediaFiles.guarantor_2_doc?.length) uploadedFieldsRef.current.add("guarantor_2_doc");
		}
	}, [initial]);

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
	const skipFormSaveRef = React.useRef(false);
	React.useEffect(() => {
		if (saveTimer.current) {
			window.clearTimeout(saveTimer.current);
		}
		saveTimer.current = window.setTimeout(() => {
			if (skipFormSaveRef.current) {
				skipFormSaveRef.current = false;
				return;
			}
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
	const skipFilesSaveRef = React.useRef(false);
	React.useEffect(() => {
		if (filesTimer.current) {
			window.clearTimeout(filesTimer.current);
		}
		filesTimer.current = window.setTimeout(() => {
			if (skipFilesSaveRef.current) {
				skipFilesSaveRef.current = false;
				return;
			}
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

	const handleChange = React.useCallback((key: string, value: unknown) => setForm((s) => ({ ...s, [key]: value })), [setForm]);

	const resetFormCompletely = () => {
		try {
			localStorage.removeItem(DRAFT_KEY);
			localStorage.removeItem(UPLOADED_FILES_KEY);
		} catch (err) {
			console.warn("Failed to clear localStorage", err);
		}

		skipFormSaveRef.current = true;
		skipFilesSaveRef.current = true;

		if (paymentMethod === "once") {
			setForm({
				fullName: "",
				email: "",
				whatsapp: "",
				numberOfProperties: "",
				properties: [{ propertyName: "", quantity: 1 }],
			} as FormState);
		} else {
			setForm({
				fullName: "",
				email: "",
				whatsapp: "",
				dob: "",
				address: "",
				isDriver: undefined,
				nextOfKin: { fullName: "", phone: "", relationship: "", spouseName: "", spousePhone: "", address: "" },
				propertyId: "",
				propertyName: "",
				isCustomProperty: false,
				customPropertyPrice: "",
				paymentFrequency: "",
				paymentDurationUnit: "",
				paymentDuration: "",
				downPayment: "",
				amountAvailable: "",
				clarification: { previousAgreement: null, completedAgreement: null, prevCompany: "", reason: "" },
				employment: { status: "", employerName: "", employerAddress: "", companyName: "", businessAddress: "", homeAddress: "" },
				guarantors: [
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
			} as FormState);
		}
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
