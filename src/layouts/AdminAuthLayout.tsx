import { Outlet } from "react-router";
import { media } from "../resources/images";
import Image from "../components/base/Image";

export default function AdminAuthLayout() {
	return (
		<div
			className="min-h-screen flex px-4"
			style={{ backgroundImage: `url(${media.images.authBackgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
			<main className="max-w-lg w-full flex justify-center mx-auto">
				<div className="w-full h-max relative">
					<div className="bg-white min-h-[550px] px-5 py-14 rounded-b-3xl">
						<Outlet />
					</div>
					<Image
						src={media.images.floatingDesign}
						alt="floating design"
						className="block absolute -bottom-4 sm:-bottom-7 z-1 bg-transparent left-1/2 -translate-x-1/2 w-full select-none pointer-events-none"
					/>
				</div>
			</main>
		</div>
	);
}
