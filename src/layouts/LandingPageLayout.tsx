import LandingPageHeader from "@/components/navigation/LandingPageHeader";
import LandingPageFooter from "@/components/navigation/LandingPageFooter";

type Props = {
	children: React.ReactNode;
};

export default function LandingPageLayout({ children }: Props) {
	return (
		<div className="min-h-screen overflow-x-hidden flex flex-col bg-black text-white antialiased">
			<LandingPageHeader />
			<main className="flex-grow">{children}</main>
			<LandingPageFooter />
		</div>
	);
}
