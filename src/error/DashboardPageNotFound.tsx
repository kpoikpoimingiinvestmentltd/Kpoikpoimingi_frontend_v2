import Image from "@/components/base/Image";
import { media } from "@/resources/images";
import { IconWrapper } from "@/assets/icons";
import { preTableButtonStyle } from "@/components/common/commonStyles";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function PageNotFound() {
	const navigate = useNavigate();

	return (
		<div className="w-full h-full grid place-content-center">
			<Image src={media.images._404} className="w-52 h-52 mx-auto" />
			<div className="text-center max-w-md flex flex-col gap-y-4 mt-4">
				<h3 className="text-xl font-semibold">Sorry, page not found</h3>
				<p className="text-sm block leading-6">
					The page you are trying to get to, unfortunately does not exist. Please check the URL or go back to the previous page.
				</p>
				<button type="button" onClick={() => navigate(-1)} className={`${preTableButtonStyle} bg-primary mx-auto mt-2 text-black`}>
					<IconWrapper className="text-sm">
						<ArrowLeft size="1.25em" />
					</IconWrapper>
					<span>Go back</span>
				</button>
			</div>
		</div>
	);
}
