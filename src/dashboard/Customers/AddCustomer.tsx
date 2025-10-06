import CustomCard from "../../components/base/CustomCard";
import PageTitles from "../../components/common/PageTitles";
import PageWrapper from "../../components/common/PageWrapper";
import CustomerForm from "./CustomerForm";

export default function AddCustomer() {
	return (
		<PageWrapper>
			<PageTitles title="Add Customers" description="Fill in the details to add customer to koi kpoi mingi investment" />

			<CustomCard>
				<div className="p-6">
					<CustomerForm onSubmit={(data) => console.log("submit", data)} />
				</div>
			</CustomCard>
		</PageWrapper>
	);
}
