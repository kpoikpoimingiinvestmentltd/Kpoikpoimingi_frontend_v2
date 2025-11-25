import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import UserForm from "./UserForm";
import React from "react";
import SuccessModal from "@/components/common/SuccessModal";
import { useState } from "react";
import PageWrapper from "../../components/common/PageWrapper";
import { useCreateUser } from "@/api/user";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { _router } from "../../routes/_router";
import { formatPhoneNumber } from "@/lib/utils";

export default function AddNewUser() {
	const [form, setForm] = React.useState({
		fullName: "",
		username: "",
		email: "",
		phone: "",
		houseAddress: "",
		stateOfOrigin: "",
		dob: "",
		role: "",
		salary: "",
		accountNumber: "",
		accountType: "",
		bankName: "",
		avatar: undefined,
	});

	const [mediaKey, setMediaKey] = useState<string | undefined>();
	const [userAddedOpen, setUserAddedOpen] = useState(false);
	const [generatedPassword, setGeneratedPassword] = useState("");

	function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
		setForm((s) => ({ ...s, [key]: value }));
	}

	const createUser = useCreateUser();
	const navigate = useNavigate();

	async function handleSubmit() {
		try {
			const parsedRoleId = Number(form.role);
			const parsedAccountTypeId = Number(form.accountType);
			const parsedBankId = Number(form.bankName);
			const parsedStateId = Number(form.stateOfOrigin);
			const parsedStatusId = 1; // Default active status
			const parsedPhoneNumber = formatPhoneNumber(form.phone);
			const parsedSalaryAmount = form.salary ? Number(form.salary) : undefined;

			const payload: any = {
				fullName: form.fullName,
				email: form.email,
				phoneNumber: parsedPhoneNumber,
				username: form.username,
				roleId: Number.isInteger(parsedRoleId) ? parsedRoleId : undefined,
				statusId: parsedStatusId,
				branchLocation: "",
				accountTypeId: Number.isInteger(parsedAccountTypeId) ? parsedAccountTypeId : undefined,
				...(parsedSalaryAmount !== undefined && { salaryAmount: parsedSalaryAmount }),
				stateOfOriginId: Number.isInteger(parsedStateId) ? parsedStateId : undefined,
				dateOfBirth: form.dob,
				houseAddress: form.houseAddress,
				accountNumber: form.accountNumber,
				bankNameId: Number.isInteger(parsedBankId) ? parsedBankId : undefined,
				...(mediaKey && {
					mediaKeys: {
						profilePicture: [mediaKey],
					},
				}),
			};

			// Remove undefined values
			Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

			const res = await createUser.mutateAsync(payload);

			const password = (res as any)?.generatedPassword ?? (res as any)?.password ?? (res as any)?.data?.password;
			if (password) setGeneratedPassword(String(password));

			setUserAddedOpen(true);
			setForm({
				fullName: "",
				username: "",
				email: "",
				phone: "",
				houseAddress: "",
				stateOfOrigin: "",
				dob: "",
				role: "",
				salary: "",
				accountNumber: "",
				accountType: "",
				bankName: "",
				avatar: undefined,
			});
			setMediaKey(undefined);
			toast.success("User Added");
		} catch (err: any) {
			console.error(err);
			let message = "Unknown error";
			if (err instanceof Error) message = err.message;
			else if (typeof err === "string") message = err;
			else if (err && typeof (err as any).message === "string") message = (err as any).message;
			else message = String(err);
			toast.error(`${message || "Unknown error"}`);
		}
	}

	return (
		<PageWrapper>
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Add New User" description="Fill in the details to add a new user" />
			</div>

			<CustomCard className="p-8">
				<div className="max-w-4xl mx-auto">
					<UserForm
						values={form}
						onChange={(k, v) => update(k as any, v)}
						onSubmit={handleSubmit}
						submitLabel="Add User"
						onAvatarUploaded={(key) => setMediaKey(key)}
						isLoading={createUser.isPending}
					/>
					<SuccessModal
						title="User Added"
						open={userAddedOpen}
						onOpenChange={setUserAddedOpen}
						subtitle="User has been added successfully"
						fields={
							generatedPassword
								? [{ label: "Password:", value: <span className="text-primary font-medium">{generatedPassword}</span>, variant: "inline" }]
								: []
						}
						actions={[
							{
								label: "Copy password",
								onClick: async () => {
									try {
										if (generatedPassword) {
											await navigator.clipboard.writeText(String(generatedPassword));
											toast.success("Password copied to clipboard");
										} else {
											toast.error("No password to copy");
										}
									} catch (err) {
										console.error("Failed to copy password", err);
										toast.error("Failed to copy password");
									}
									setTimeout(() => navigate(_router.dashboard.users), 300);
								},
								variant: "primary",
							},
						]}
					/>
				</div>
			</CustomCard>
		</PageWrapper>
	);
}
