import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";

export default function TabReceiptHistory() {
	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<SectionTitle title="Receipt & Payment History" />
			<CustomCard className="mt-6 p-4 bg-card">Receipt & payment history content.</CustomCard>
		</CustomCard>
	);
}
