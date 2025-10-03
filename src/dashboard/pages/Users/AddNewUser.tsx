import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
// ...existing code...
import React from "react";
import { twMerge } from "tailwind-merge";
import { actionBtnStyle, inputStyle } from "../../../components/common/commonStyles";
import { IconWrapper, UploadCloudIcon } from "../../../assets/icons";

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
					<div className="flex flex-col items-center mb-6">
						<div className="w-32 h-32 bg-card rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center relative overflow-hidden">
							<div className="flex items-center text-center flex-col gap-y-2 absolute justify-center inset-0">
								<IconWrapper className="text-lg">
									<UploadCloudIcon />
								</IconWrapper>
								<div className="text-sm">Upload Profile</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="text-sm block mb-2">User Name*</label>
							<Input className={twMerge(inputStyle)} value={form.username} onChange={(e) => update("username", e.target.value)} />
						</div>
						<div>
							<label className="text-sm block mb-2">Email*</label>
							<Input className={twMerge(inputStyle)} value={form.email} onChange={(e) => update("email", e.target.value)} />
						</div>

						<div>
							<label className="text-sm block mb-2">Phone Number*</label>
							<Input className={twMerge(inputStyle)} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
						</div>
						<div>
							<label className="text-sm block mb-2">House Address*</label>
							<Input className={twMerge(inputStyle)} value={form.houseAddress} onChange={(e) => update("houseAddress", e.target.value)} />
						</div>

						<div>
							<label className="text-sm block mb-2">State of Origin*</label>
							<Select onValueChange={(v) => update("stateOfOrigin", v)}>
								<SelectTrigger className={twMerge(inputStyle, "min-h-11")}>
									<SelectValue placeholder="Select state" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="lagos">Lagos</SelectItem>
									<SelectItem value="abuja">Abuja</SelectItem>
									<SelectItem value="oyo">Oyo</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<label className="text-sm block mb-2">Date Of Birth*</label>
							<Input className={twMerge(inputStyle, "")} type="date" value={form.dob} onChange={(e) => update("dob", e.target.value)} />
						</div>

						<div className="md:col-span-2">
							<label className="text-sm block mb-2">User Role*</label>
							<Select onValueChange={(v) => update("role", v)}>
								<SelectTrigger className={twMerge(inputStyle, "min-h-11")}>
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="admin">Admin</SelectItem>
									<SelectItem value="sales">Sales Person</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div>
							<label className="text-sm block mb-2">Salary Amount*</label>
							<Input className={twMerge(inputStyle)} value={form.salary} onChange={(e) => update("salary", e.target.value)} />
						</div>
						<div>
							<label className="text-sm block mb-2">Account Number*</label>
							<Input className={twMerge(inputStyle)} value={form.accountNumber} onChange={(e) => update("accountNumber", e.target.value)} />
						</div>

						<div>
							<label className="text-sm block mb-2">Account type*</label>
							<Select onValueChange={(v) => update("accountType", v)}>
								<SelectTrigger className={twMerge(inputStyle, "min-h-11")}>
									<SelectValue placeholder="Select account type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="savings">Savings</SelectItem>
									<SelectItem value="current">Current</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<label className="text-sm block mb-2">Bank Name*</label>
							<Input className={twMerge(inputStyle)} value={form.accountNumber} onChange={(e) => update("accountNumber", e.target.value)} />
						</div>
					</div>

					<div className="mt-8 flex justify-center">
						<button type="button" className={twMerge(actionBtnStyle, "w-3/5 mx-auto")} onClick={() => console.log("submit", form)}>
							Add User
						</button>
					</div>
				</div>
			</CustomCard>
		</div>
	);
}
