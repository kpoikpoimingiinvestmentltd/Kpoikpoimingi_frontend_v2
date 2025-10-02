import PageTitles from "@/components/common/PageTitles";
import { EditIcon, IconWrapper } from "../../../assets/icons";

export default function Setting() {
	return (
		<div>
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="General Setting" description="This is a place to set up and make changes on kpoi kpoi mingi investment" />
				<div className="flex items-center gap-3">
					<button className={"flex items-center gap-2 underline-offset-2 underline"}>
						<IconWrapper>
							<EditIcon />
						</IconWrapper>
						<span>Edit</span>
					</button>
					<button type="button" className="flex items-center gap-2 bg-primary rounded-sm px-8 py-2.5 active-scale transition text-white">
						<span className="text-sm">Change Password</span>
					</button>
					<button type="button" className="flex items-center gap-2 bg-red-600 rounded-sm px-8 py-2.5 active-scale transition text-white">
						<span className="text-sm">Log out</span>
					</button>
				</div>
			</div>
		</div>
	);
}
