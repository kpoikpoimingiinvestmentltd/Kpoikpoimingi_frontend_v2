import PageTitles from "@/components/common/PageTitles";
import { EditIcon, IconWrapper } from "@/assets/icons";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CustomCard from "@/components/base/CustomCard";
import Profile from "./Profile";
import VatInterest from "./VatInterest";
import { tabListStyle, tabStyle } from "../../components/common/commonStyles";
import LogoutModal from "../../components/common/LogoutModal";
import PageWrapper from "../../components/common/PageWrapper";

export default function Setting() {
	const [editOpen, setEditOpen] = useState(false);
	const [changePassOpen, setChangePassOpen] = useState(false);
	const [logoutOpen, setLogoutOpen] = useState(false);

	return (
		<PageWrapper>
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="General Setting" description="This is a place to set up and make changes on kpoi kpoi mingi investment" />
				<div className="flex items-center gap-4 flex-wrap">
					<button onClick={() => setEditOpen(true)} className={"flex items-center text-sm sm:text-base underline-offset-2 underline"}>
						<IconWrapper className="text-xl">
							<EditIcon />
						</IconWrapper>
						<span>Edit</span>
					</button>
					<button
						type="button"
						onClick={() => setChangePassOpen(true)}
						className="flex items-center text-sm md:text-base gap-2 bg-primary rounded-sm px-8 py-2.5 active-scale transition text-white">
						<span>Reset Password</span>
					</button>
					<button
						type="button"
						onClick={() => setLogoutOpen(true)}
						className="flex items-center text-sm md:text-base gap-2 bg-red-600 rounded-sm px-8 py-2.5 active-scale transition text-white">
						<span>Log out</span>
					</button>
				</div>
			</div>

			<CustomCard className="p-5 sm:p-6 mt-8 border-0">
				<Tabs defaultValue="profile">
					<TabsList className={tabListStyle}>
						<TabsTrigger value="profile" className={tabStyle}>
							Profile
						</TabsTrigger>
						<TabsTrigger value="vat" className={tabStyle}>
							VAT & Interest
						</TabsTrigger>
						{/* <TabsTrigger value="terms" className={tabStyle}>
							Terms & Conditions
						</TabsTrigger> */}
					</TabsList>

					<TabsContent value="profile">
						<Profile />
					</TabsContent>

					<TabsContent value="vat">
						<VatInterest />
					</TabsContent>

					{/* <TabsContent value="terms">
						<TermsAndConditions />
					</TabsContent> */}
				</Tabs>
			</CustomCard>
			<EditProfileModal open={editOpen} onOpenChange={setEditOpen} />
			<ChangePasswordModal open={changePassOpen} onOpenChange={setChangePassOpen} />
			<LogoutModal open={logoutOpen} onOpenChange={setLogoutOpen} />
		</PageWrapper>
	);
}
