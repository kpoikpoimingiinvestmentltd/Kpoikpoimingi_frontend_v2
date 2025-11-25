// Landing page header/footer components were removed or not present in this workspace.
// Use simple inline header/footer to avoid import errors during the TypeScript build.

type Props = {
	children: React.ReactNode;
};

export default function LandingPageLayout({ children }: Props) {
	return (
		<div className="min-h-screen overflow-x-hidden flex flex-col bg-black text-white antialiased">
			<header className="w-full py-4 px-6 border-b border-white/10">
				<div className="max-w-6xl mx-auto">
					{" "}
					<h2 className="font-semibold">Kpo Kpoi Mingi</h2>{" "}
				</div>
			</header>
			<main className="flex-grow">{children}</main>
			<footer className="w-full py-6 px-6 border-t border-white/6">
				<div className="max-w-6xl mx-auto text-sm text-muted-foreground">© Kpo Kpoi Mingi Investments</div>
			</footer>
		</div>
	);
}
