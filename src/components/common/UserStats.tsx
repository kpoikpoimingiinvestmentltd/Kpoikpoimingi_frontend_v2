import { CustomersIcon, EyeIcon, IconWrapper, PropertiesIcon, PropertyRequestIcon } from "@/assets/icons";
import StatCard from "@/components/base/StatCard";
import Badge from "../base/Badge";
import { Link } from "react-router";
import { _router } from "../../routes/_router";
import { useGetAnalyticsOverview, type AnalyticsOverview } from "@/api/analytics";
import { CardSkeleton } from "@/components/common/Skeleton";

export const UserStats = () => {
	const { data: analyticsData, isLoading } = useGetAnalyticsOverview();

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
				{[1, 2, 3, 4].map((i) => (
					<CardSkeleton key={i} lines={2} />
				))}
			</div>
		);
	}

	const analytics = analyticsData as AnalyticsOverview | undefined;
	const totalPropertyRequests = analytics?.totalPropertyRequests ?? 0;
	const unapprovedRequests = analytics?.unapprovedRequests ?? 0;
	const totalPropertiesSold = analytics?.totalPropertiesSold ?? 0;
	const totalCustomers = analytics?.totalCustomers ?? 0;
	const totalPropertyQuantity = analytics?.totalPropertyQuantity ?? 0;
	const totalPropertyAssigned = analytics?.totalPropertyAssigned ?? 0;

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
			<StatCard
				title="Total Property Request"
				value={totalPropertyRequests}
				icon={<PropertyRequestIcon />}
				iconColor="text-green-500"
				badge={<Badge label={`Unapproved Request (${unapprovedRequests})`} className="rounded-full py-0.5 px-2" value={"cancelled"} size="sm" />}
				footer={
					<Link to={_router.dashboard.productRequest} className="text-sm text-primary inline-flex items-center gap-2">
						<IconWrapper>
							<EyeIcon />
						</IconWrapper>
						<span>View Requests</span>
					</Link>
				}
			/>
			<StatCard
				title="Total Property Available"
				value={totalPropertyQuantity.toLocaleString()}
				icon={<PropertiesIcon />}
				iconColor="text-amber-500"
				badge={
					totalPropertyAssigned > 0 ? (
						<Badge
							label={`Assigned (${totalPropertyAssigned.toLocaleString()})`}
							className="rounded-full py-0.5 px-2"
							value="pending"
							size="sm"
						/>
					) : undefined
				}
				footer={
					<Link to={_router.dashboard.properties} className="text-sm text-primary inline-flex items-center gap-2">
						<IconWrapper>
							<EyeIcon />
						</IconWrapper>
						<span>View Properties</span>
					</Link>
				}
			/>
			<StatCard title="Total Property Sold" value={totalPropertiesSold} icon={<PropertiesIcon />} iconColor="text-blue-500" />
			<StatCard title="Total Customers" value={totalCustomers} icon={<CustomersIcon />} iconColor="text-purple-500" />
		</div>
	);
};
