import { CustomersIcon, PropertiesIcon, PropertyRequestIcon } from "@/assets/icons";
import StatCard from "@/components/base/StatCard";
import Badge from "../base/Badge";

export const UserStats = () => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<StatCard
				title="Total Property Request"
				value={1000}
				icon={<PropertyRequestIcon />}
				iconColor="text-green-500"
				badge={<Badge label={"Unapproved Request (6)"} className="rounded-full py-0.5 px-2" value={"cancelled"} size="sm" />}
			/>
			<StatCard title="Total Property Sold" value={500} icon={<PropertiesIcon />} iconColor="text-blue-500" />
			<StatCard title="Total Customers" value={300} icon={<CustomersIcon />} iconColor="text-purple-500" />
		</div>
	);
};
