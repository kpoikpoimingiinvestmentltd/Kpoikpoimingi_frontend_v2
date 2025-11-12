import CustomCard from "../../components/base/CustomCard";
import PageTitles from "../../components/common/PageTitles";
import PageWrapper from "../../components/common/PageWrapper";
import CustomerForm from "./CustomerForm";
import { useSearchParams } from "react-router";

export default function AddCustomer() {
	const [searchParams] = useSearchParams();
	const paymentMethod = searchParams.get("paymentMethod");

	return (
		<PageWrapper>
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Add Customers" description="Fill in the details to add customer to koi kpoi mingi investment" />
			</div>

			<CustomCard>
				<div className="p-6">
					<CustomerForm paymentMethod={paymentMethod === "once" || paymentMethod === "installment" ? paymentMethod : undefined} />
				</div>
			</CustomCard>
		</PageWrapper>
	);
}
