export default function TermsSection({ title, items, children }: { title: string; items?: string[]; children?: React.ReactNode }) {
	return (
		<div className="mb-4">
			<h4 className="font-medium">{title}</h4>
			{items ? (
				<div className="text-sm text-muted-foreground flex flex-col gap-1 mt-2 ml-1">
					{items.map((it, i) => (
						<div key={i} className="flex gap-2">
							<div className="min-w-max">*</div>
							<div className="flex-1">{it}</div>
						</div>
					))}
				</div>
			) : (
				<div className="text-muted-foreground mt-2">{children}</div>
			)}
		</div>
	);
}
