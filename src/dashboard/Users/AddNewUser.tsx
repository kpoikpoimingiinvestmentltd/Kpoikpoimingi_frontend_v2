import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import UserForm from "./UserForm";
// ...existing code...
// form moved to ./UserForm
import React from "react";
import SuccessModal from "@/components/common/SuccessModal";
import { useState } from "react";

export default function AddNewUser() {
	const [form, setForm] = React.useState({
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
	});

	const [userAddedOpen, setUserAddedOpen] = useState(false);
	const [generatedPassword, setGeneratedPassword] = useState("");

	function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
		setForm((s) => ({ ...s, [key]: value }));
	}

	return (
		<div className="flex flex-col gap-y-6">
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Add New User" description="Fill in the details to add a new user" />
			</div>

			<CustomCard className="p-8">
				<div className="max-w-4xl mx-auto">
					<UserForm
						values={form}
						onChange={(k, v) => update(k as any, v)}
						onSubmit={() => {
							const pwd = Math.random().toString(36).slice(-8) + "@1A";
							setGeneratedPassword(pwd);
							setUserAddedOpen(true);
						}}
						submitLabel="Add User"
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
					/>
				</div>
			</CustomCard>
		</div>
	);
}
