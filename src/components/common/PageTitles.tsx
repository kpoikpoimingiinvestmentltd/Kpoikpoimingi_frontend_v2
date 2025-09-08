export default function PageTitles({ title, description }: { title: string; description?: string }) {
	return (
		<div className="text-start">
			<h3 className="font-semibold text-lg">{title}</h3>
			{description && <p className="text-sm text-muted-foreground">{description}</p>}
		</div>
	);
}
