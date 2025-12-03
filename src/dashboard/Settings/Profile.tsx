import Image from "@/components/base/Image";
import KeyValueRow from "@/components/common/KeyValueRow";
import CustomCard from "../../components/base/CustomCard";
import { useGetCurrentUser } from "@/api/user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Profile() {
	const { data: user, isLoading } = useGetCurrentUser(true);

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
				<div className="w-28 h-28 rounded-full overflow-hidden">
					{(user as Record<string, unknown>).media ? (
						<Image
							src={(user as Record<string, unknown>).media as string}
							alt={(user as Record<string, unknown>).fullName as string}
							className="w-full h-full object-cover"
						/>
					) : (
						<Avatar className="w-full h-full">
							<AvatarImage
								src={((user as Record<string, unknown>).media as string) || undefined}
								alt={(user as Record<string, unknown>).fullName as string}
							/>
							<AvatarFallback className="text-2xl">{initials}</AvatarFallback>
						</Avatar>
					)}
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
						<KeyValueRow
							label="User Role"
							value={userRole}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
							variant="files"
							files={[{ url: "#", label: userRole }]}
						/>
					</div>
				</div>
			</div>
		</CustomCard>
	);
}
