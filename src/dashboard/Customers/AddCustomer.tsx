import CustomCard from "../../components/base/CustomCard";
import PageTitles from "../../components/common/PageTitles";
import PageWrapper from "../../components/common/PageWrapper";
import CustomerForm from "./CustomerForm";
import { useSearchParams, useLocation } from "react-router";

interface LocationState {
	paymentMethod?: "once" | "installment";
	selectedProperties?: Array<{
		id: string;
		name: string;
		price: string;
		quantity: number;
		media?: string[];
	}>;
}

export default function AddCustomer() {
	const [searchParams] = useSearchParams();
	const location = useLocation();
	const statePaymentMethod = (location.state as LocationState | undefined)?.paymentMethod;
	const queryPaymentMethod = searchParams.get("paymentMethod");
	const paymentMethod = statePaymentMethod || queryPaymentMethod;

	let selectedProperties: LocationState["selectedProperties"];
	const querySelectedProperties = searchParams.get("selectedProperties");
	if (querySelectedProperties) {
		try {
			selectedProperties = JSON.parse(decodeURIComponent(querySelectedProperties));
		} catch {
			selectedProperties = undefined;
		}
	} else {
		selectedProperties = (location.state as LocationState | undefined)?.selectedProperties;
	}

	return (
		<PageWrapper>
			<div className="flex items-center justify-between flex-wrap gap-4 mb-4">
				<PageTitles title="Add Customers" description="Fill in the details to add customer to koi kpoi mingi investment" />
			</div>

			<CustomCard>
				<div className="p-6">
					<CustomerForm
						paymentMethod={paymentMethod === "once" || paymentMethod === "installment" ? (paymentMethod as "once" | "installment") : undefined}
						selectedProperties={selectedProperties}
						showSignedContract={paymentMethod === "installment"}
					/>
				</div>
			</CustomCard>
		</PageWrapper>
	);
}
