import Image from "@/components/base/Image";
import KeyValueRow from "@/components/common/KeyValueRow";
import CustomCard from "../../components/base/CustomCard";
import { useGetCurrentUser } from "@/api/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import ActionButton from "@/components/base/ActionButton";
import { IconWrapper, CameraIcon } from "@/assets/icons";

export default function Profile() {
	const { data: user, isLoading } = useGetCurrentUser(true);
	const [editOpen, setEditOpen] = useState(false);
	if (isLoading) {
		return (
			<CustomCard className="mt-4 border-none p-5 sm:p-6 bg-[#fafafa]">
				<div className="flex flex-col gap-6 animate-pulse">
					<div className="w-28 h-28 rounded-full bg-gray-300"></div>
					<div className="space-y-4">
						<div className="h-4 bg-gray-300 rounded w-1/2"></div>
						<div className="h-4 bg-gray-300 rounded w-1/2"></div>
						<div className="h-4 bg-gray-300 rounded w-1/2"></div>
					</div>
				</div>
			</CustomCard>
		);
	}

	if (!user) {
		return (
			<CustomCard className="mt-4 border-none p-5 sm:p-6 bg-[#fafafa]">
				<div className="text-center text-muted-foreground">No user data available</div>
			</CustomCard>
		);
	}

	const initials = (user as Record<string, unknown>).fullName
		? ((user as Record<string, unknown>).fullName as string)
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: "U";
	const userRole =
		typeof (user as Record<string, unknown>).role === "string"
			? ((user as Record<string, unknown>).role as string)
			: (((user as Record<string, unknown>).role as Record<string, unknown>)?.role as string) ?? "N/A";

	return (
		<CustomCard className="mt-4 border-none p-5 sm:p-6 bg-[#fafafa]">
			<div className="flex flex-col gap-6">
				<div className="w-28 h-28 group rounded-full overflow-hidden relative">
					{(() => {
						const media = (user as Record<string, unknown>).media;
						let src: string | undefined | null = undefined;
						if (Array.isArray(media) && media.length > 0) {
							src = (media[0] as Record<string, unknown>)?.fileUrl as string | undefined;
						} else if (typeof media === "string") {
							src = media as string;
						} else if (media && typeof (media as Record<string, unknown>).fileUrl === "string") {
							src = ((media as Record<string, unknown>).fileUrl as string) || undefined;
						}

						return src ? (
							<Image src={src} alt={(user as Record<string, unknown>).fullName as string} className="w-full h-full object-cover" />
						) : (
							<Avatar className="w-full h-full">
								<AvatarFallback className="text-2xl">{initials}</AvatarFallback>
							</Avatar>
						);
					})()}

					{/* Edit button overlay */}
					<ActionButton
						type="button"
						className={`text-white flex flex-col absolute inset-0 bg-black/50 hover:bg-black/30 opacity-0 group-hover:opacity-100 items-center justify-center gap-1 transition-opacity`}
						onClick={() => setEditOpen(true)}>
						<IconWrapper>
							<CameraIcon />
						</IconWrapper>
						<span>Upload</span>
					</ActionButton>
				</div>

				<div className="flex-1 mt-3">
					<div className="grid grid-cols-1 gap-2 items-center">
						<KeyValueRow
							label="Full Name"
							value={(user as Record<string, unknown>).fullName as string}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Email"
							value={(user as Record<string, unknown>).email as string}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Username"
							value={(user as Record<string, unknown>).username as string}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Phone Number"
							value={(user as Record<string, unknown>).phoneNumber as string}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Branch Location"
							value={(user as Record<string, unknown>).branchLocation as string}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						{/* <KeyValueRow
						label="Account Number"
						value={(user as Record<string, unknown>).accountNumber as string}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/>
					<KeyValueRow
						label="Salary Amount"
						value={(user as Record<string, unknown>).salaryAmount as string}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/> */}
						<KeyValueRow
							label="Date of Birth"
							value={
								((user as Record<string, unknown>).dateOfBirth as string)
									? new Date((user as Record<string, unknown>).dateOfBirth as string).toLocaleDateString()
									: "N/A"
							}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="House Address"
							value={(user as Record<string, unknown>).houseAddress as string}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Account Type"
							value={((user as Record<string, unknown>).accountType as Record<string, unknown>)?.type as string}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						{/* <KeyValueRow
						label="Bank Name"
						value={((user as Record<string, unknown>).bankName as Record<string, unknown>)?.name as string}
						leftClassName="text-sm text-muted-foreground"
						rightClassName="text-right"
					/> */}
						<KeyValueRow
							label="State of Origin"
							value={((user as Record<string, unknown>).stateOfOrigin as Record<string, unknown>)?.state as string}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Assigned Customers"
							value={String((user as Record<string, unknown>).numberOfAssignedCustomers ?? "0")}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Created At"
							value={
								((user as Record<string, unknown>).createdAt as string)
									? new Date((user as Record<string, unknown>).createdAt as string).toLocaleString()
									: "N/A"
							}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow label="User Role" value={userRole} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
					</div>
				</div>

				{/* Edit modal */}
				<EditProfileModal open={editOpen} onOpenChange={setEditOpen} />
			</div>
		</CustomCard>
	);
}
