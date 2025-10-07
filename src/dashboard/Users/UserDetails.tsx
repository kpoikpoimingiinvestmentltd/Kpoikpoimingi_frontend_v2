import type { ReactNode } from "react";
import { EditIcon, IconWrapper } from "../../assets/icons";
import PageTitles from "../../components/common/PageTitles";
import CustomCard from "../../components/base/CustomCard";
import { Avatar, AvatarImage } from "../../components/ui/avatar";
import Badge from "../../components/base/Badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserForm from "./UserForm";
import { useState } from "react";
import SuccessModal from "@/components/common/SuccessModal";
import { media } from "../../resources/images";
import PageWrapper from "../../components/common/PageWrapper";
import { modalContentStyle } from "../../components/common/commonStyles";

export default function UserDetails() {
	function KeyValueRow({ label, value, children }: { label: ReactNode; value?: ReactNode; children?: ReactNode }) {
		return (
			<div className="flex justify-between items-start">
				<span className="text-sm sm:text-base">{label}</span>
				<span className="text-sm sm:text-base">{children ?? value}</span>
			</div>
		);
	}

	// local UI state: modal handlers
	const [editOpen, setEditOpen] = useState(false);
	const openEdit = () => setEditOpen(true);
	const [resetOpen, setResetOpen] = useState(false);
	const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

	const openReset = () => {
		// generate a temporary password (simple example)
		const pwd = `@Root${Math.floor(Math.random() * 900) + 100}`;
		setGeneratedPassword(pwd);
		setResetOpen(true);
	};
	const openDeactivate = () => {
		/* TODO: open deactivate modal */
	};

	const userValues = {
		username: "Kenny Banks James",
		email: "dunny@gmail.com",
		phone: "0909282228",
		houseAddress: "8 Lagos Street",
		stateOfOrigin: "lagos",
		dob: "2000-05-03",
		role: "sales",
		salary: "30,000",
		accountNumber: "1234567890",
		accountType: "savings",
		bankName: "Access bank",
	};

	return (
		<PageWrapper>
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="User Profile" description="User profile contains the details of this user" />
				<div className="flex items-center gap-4 flex-wrap">
					<button onClick={openEdit} className={"flex items-center text-sm sm:text-base underline-offset-2 underline"}>
						<IconWrapper className="text-xl">
							<EditIcon />
						</IconWrapper>
						<span>Edit</span>
					</button>
					<button
						type="button"
						onClick={openReset}
						className="flex items-center text-sm md:text-base gap-2 bg-primary rounded-sm px-8 py-2.5 active-scale transition text-white">
						<span>Reset Password</span>
					</button>
					<button
						type="button"
						onClick={openDeactivate}
						className="flex items-center text-sm md:text-base gap-2 bg-red-600 rounded-sm px-8 py-2.5 active-scale transition text-white">
						<span>Deactivate</span>
					</button>
				</div>
			</div>

			<main>
				<CustomCard className="md:p-8">
					{/* Banner + avatar */}
					<div className="relative">
						<div className="h-36 bg-gradient-to-r from-sky-400 to-blue-600 rounded-lg" />
						<div className="absolute bottom-0 translate-y-1/2 left-4 sm:left-10">
							<Avatar className="size-32">
								<AvatarImage src={media.images.avatar} alt="avatar" />
							</Avatar>
						</div>
					</div>

					{/* content grid */}
					<div className="mt-24 grid grid-cols-1 gap-4">
						<div className="space-y-4">
							<KeyValueRow label="User Name" value="Kenny Banks James" />
							<KeyValueRow label="Email" value="dunny@gmail.com" />
							<KeyValueRow label="Phone Number" value="0909282228" />
							<KeyValueRow label="House address" value="8 Lagos Street" />
							<KeyValueRow label="State Of Origin" value="Lagos State" />
							<KeyValueRow label="Date Of Birth" value="3-5-2000" />
							<KeyValueRow label="User Role" value="Sales Person" />
							<KeyValueRow label="Assigned Customers">
								<Badge value="7" status="primary" label={<span>7 Assigned</span>} size="md" />
							</KeyValueRow>
						</div>
						<hr />
						<div className="space-y-4">
							<KeyValueRow label="Salary Amount" value="30,000" />
							<KeyValueRow label="Account Number" value="1234567890" />
							<KeyValueRow label="Account Type" value="Savings" />
							<KeyValueRow label="Bank Name" value="Access bank" />
						</div>
					</div>
				</CustomCard>
			</main>

			{/* Edit modal */}
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent className={modalContentStyle()}>
					<DialogHeader className="text-center flex items-center justify-center mt-5">
						<DialogTitle className="font-medium">Edit User Details</DialogTitle>
					</DialogHeader>
					<UserForm values={userValues} onChange={() => {}} onSubmit={() => setEditOpen(false)} submitLabel="Save Changes" />
				</DialogContent>
			</Dialog>

			{/* Reset password success modal */}
			<SuccessModal
				open={resetOpen}
				onOpenChange={setResetOpen}
				title="Password Reset"
				subtitle="Password Reset Successful"
				fields={
					generatedPassword
						? [
								{
									label: "Password:",
									value: <span className="text-primary font-medium">{generatedPassword}</span>,
									variant: "inline",
								},
						  ]
						: []
				}
				actions={[
					{
						label: "Copy Password",
						onClick: () => {
							if (generatedPassword) navigator.clipboard.writeText(generatedPassword);
						},
						variant: "primary",
						fullWidth: true,
					},
				]}
			/>
		</PageWrapper>
	);
}
