import Image from "@/components/base/Image";
import KeyValueRow from "@/components/common/KeyValueRow";
import { media } from "@/resources/images";
import CustomCard from "../../../components/base/CustomCard";

export default function Profile() {
	return (
		<CustomCard className="mt-4 border-none p-5 sm:p-6 bg-[#fafafa]">
			<div className="flex flex-col gap-6">
				<div className="w-28 h-28 rounded-full overflow-hidden">
					<Image src={media.images.avatar} alt="avatar" className="w-full h-full object-cover" />
				</div>

				<div className="flex-1 mt-3">
					<div className="grid grid-cols-1 gap-2 items-center">
						<KeyValueRow label="User Name" value="Amgbara Jake" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Email" value="dunny@gmail.com" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							label="User Role"
							value="Super Admin"
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
							variant="files"
							files={[{ url: "#", label: "Super Admin" }]}
						/>
					</div>
				</div>
			</div>
		</CustomCard>
	);
}
