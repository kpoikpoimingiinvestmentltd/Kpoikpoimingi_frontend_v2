import PageTitles from "@/components/common/PageTitles";
import CustomCard from "@/components/base/CustomCard";
import ImageGallery from "@/components/base/ImageGallery";
import { media } from "@/resources/images";
import PageWrapper from "../../components/common/PageWrapper";

export default function ViewDebtDetails() {
	// demo data for the view
	const data = {
		id: "ID123456",
		name: "Kenny Banks James",
		whatsapp: "+2345678908755",
		email: "dunny@gmail.com",
		property: "25kg gas cylinder",
		totalAmount: "80,000",
		amountRemaining: "60,000",
		amountPaid: "20,000",
		installmentCovered: "(2/6)",
		quantity: "1",
	};

	return (
		<PageWrapper>
			<div className="flex items-center justify-between">
				<PageTitles title="Debt" description="This Contains all customers owing for product they signed to buy on installment" />
			</div>

			<CustomCard className="p-6">
				<ImageGallery images={[media.images._product1, media.images._product2, media.images._product3]} />

				<div className="mt-6 border-t pt-6">
					<div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
						<div className="text-muted-foreground">Contract ID</div>
						<div className="text-right">{data.id}</div>

						<div className="text-muted-foreground">Customer Name</div>
						<div className="text-right">{data.name}</div>

						<div className="text-muted-foreground">Whatsapp Number</div>
						<div className="text-right">{data.whatsapp}</div>

						<div className="text-muted-foreground">Email Address</div>
						<div className="text-right">{data.email}</div>

						<div className="text-muted-foreground">Property Name</div>
						<div className="text-right">{data.property}</div>

						<div className="text-muted-foreground">Total Property Amount</div>
						<div className="text-right">{data.totalAmount}</div>

						<div className="text-muted-foreground">Amount Remaining</div>
						<div className="text-right">{data.amountRemaining}</div>

						<div className="text-muted-foreground">Amount Paid</div>
						<div className="text-right">{data.amountPaid}</div>

						<div className="text-muted-foreground">Instalment Covered</div>
						<div className="text-right">{data.installmentCovered}</div>

						<div className="text-muted-foreground">Product Quantity</div>
						<div className="text-right">{data.quantity}</div>
					</div>
				</div>
			</CustomCard>
		</PageWrapper>
	);
}
