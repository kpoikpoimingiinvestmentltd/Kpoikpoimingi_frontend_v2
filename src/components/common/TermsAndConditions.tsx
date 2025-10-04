import CustomCard from "../base/CustomCard";
import TermsSection from "./TermsSection";

const sections = [
	{
		title: "Customer Eligibility",
		items: [
			"Customers must be at least 18 years old.",
			"All registrations require valid identification and completion of the hire purchase agreement.",
		],
	},
	{
		title: "Registration & Approval",
		items: ["Customers can register online or at our office.", "Approval is subject to document verification and a signed agreement."],
	},
	{
		title: "Payments",
		items: [
			"Customers may choose between full payment or hire purchase for property acquisition.",
			"Payments must be made through approved methods (POS, online, or bank transfer).",
			"An official receipt will be issued for every payment made.",
		],
	},
	{
		title: "VAT Charges",
		items: ["VAT will be applied where applicable in accordance with local regulations."],
	},
];

export default function TermsAndConditions() {
	return (
		<CustomCard className="rounded-lg px-5 py-5 mt-5 bg-card border border-gray-100">
			<h3 className="font-medium mb-4">Introduction</h3>
			<p className="text-sm text-muted-foreground mb-6">
				Welcome to KPOIKPOIMINGI Investment Limited. By using our platform or registering for our services, you agree to the following Terms and
				Conditions. Please read them carefully before proceeding.
			</p>

			{sections.map((s) => (
				<TermsSection key={s.title} title={s.title} items={s.items} />
			))}
		</CustomCard>
	);
}
