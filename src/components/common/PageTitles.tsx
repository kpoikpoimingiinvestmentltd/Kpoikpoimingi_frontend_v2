export default function PageTitles({ title, description }: { title: string; description?: string }) {
	return (
		<div className="text-start max-w-sm">
			<h3 className="font-medium text-lg">{title}</h3>
			{description && <p className="text-[.9rem] text-muted-foreground">{description}</p>}
		</div>
	);
}
