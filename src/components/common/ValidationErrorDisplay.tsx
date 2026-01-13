type Props = {
	missingFields: string[];
	filter: (field: string) => boolean;
};

export default function ValidationErrorDisplay({ missingFields, filter }: Props) {
	const relevantErrors = missingFields.filter(filter);

	if (relevantErrors.length === 0) return null;

	return (
		<div className="mt-4 p-3 bg-red-50 border border-red-300 rounded-md">
			<p className="text-sm font-semibold text-red-800 mb-2">Validation Errors:</p>
			<ul className="list-disc list-inside space-y-1">
				{relevantErrors.map((error, idx) => (
					<li key={idx} className="text-sm text-red-700">
						{error}
					</li>
				))}
			</ul>
		</div>
	);
}
