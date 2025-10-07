import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";

export default function TabDocument() {
	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<SectionTitle title="Document" />
			<CustomCard className="mt-6 p-4 bg-card">Document list / upload area.</CustomCard>
		</CustomCard>
	);
}
