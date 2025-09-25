import Image from "../components/base/Image";
import { media } from "../resources/images";
import { BackButton } from "../components/base/Buttons";

export default function AuthPageNotFound() {
	return (
		<div>
			<div className="w-full h-full grid place-content-center">
				<Image src={media.images._404} className="w-52 h-52 mx-auto" />
				<div className="text-center max-w-md flex flex-col gap-y-4 mt-4">
					<h3 className="text-xl font-semibold">Sorry, page not found</h3>
					<p className="text-sm block leading-6">
						The page you are trying to get to, unfortunately does not exist. Please check the URL or go back to the previous page.
					</p>
					<BackButton title="Go Back" grouped className="bg-primary w-max text-white mx-auto hover:bg-primary text-sm px-3 gap-1 py-2.5" />
				</div>
			</div>
		</div>
	);
}
