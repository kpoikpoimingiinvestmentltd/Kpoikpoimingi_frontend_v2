import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import KeyValueRow from "@/components/common/KeyValueRow";

const titleSectionStyle = "flex flex-col gap-3";
export default function TabCustomerDetails() {
	const files = [
		{ url: "#", label: "Indigene certificate" },
		{ url: "#", label: "NIN" },
		{ url: "#", label: "Drivers license" },
		{ url: "#", label: "Voters card" },
		{ url: "#", label: "Signed contract" },
	];
	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<SectionTitle title="Customer Details" />
			<CustomCard className="mt-6 grid grid-cols-1 gap-6 md:p-8 bg-card">
				<section className={titleSectionStyle}>
					<SectionTitle title="Personal information" />
					<div className="space-y-2">
						<KeyValueRow label="Customer full name" value="Tom Deo James" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Email" value="dunny@gmail.com" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Whatsapp number" value="+2348134567890" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							label="Home Address"
							value="3 ikorudu street lagos"
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow label="Date of birth" value="03-04-2025" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							className="items-center"
							label="Indigene certificate"
							variant="files"
							files={[files[0]]}
							leftClassName="text-sm text-muted-foreground"
						/>
					</div>
				</section>
				<section className={titleSectionStyle}>
					<SectionTitle title="Identification Documents" />
					<div>
						<KeyValueRow className="items-center" label="NIN" variant="files" files={[files[1]]} leftClassName="text-sm text-muted-foreground" />
						<KeyValueRow
							className="items-center"
							label="Drivers license"
							variant="files"
							files={[files[2]]}
							leftClassName="text-sm text-muted-foreground"
						/>
						<KeyValueRow
							className="items-center"
							label="Voters card"
							variant="files"
							files={[files[3]]}
							leftClassName="text-sm text-muted-foreground"
						/>
						<KeyValueRow
							className="items-center"
							label="Signed contract"
							variant="files"
							files={[files[4]]}
							leftClassName="text-sm text-muted-foreground"
						/>
					</div>
				</section>

				<section className={titleSectionStyle}>
					<SectionTitle title="Next of kin details" />
					<div className="grid grid-cols-1 gap-2">
						<KeyValueRow label="Name" value="Jake Amgbara Sofi" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Phone number" value="+234567890948" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Relationship" value="Brother" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Spouse name" value="Rose Amgbara" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Spouse phone number" value="234567894847" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							label="Spouse address"
							value="Ikorudu street lagos"
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
					</div>
				</section>

				<section className={titleSectionStyle}>
					<SectionTitle title="Property details" />
					<div className="grid grid-cols-1 gap-2">
						<KeyValueRow label="Property name" value="25kg gas cylinder" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Payment frequency" value="Monthly" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Payment duration" value="6 monthly" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Down payment amount" value="30,000" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							label="What do you need this property for"
							value="To cook food"
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow
							label="Amount available for down payment"
							value="30,000"
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
					</div>
				</section>

				<section className={titleSectionStyle}>
					<SectionTitle title="Clarification details" />
					<div className="grid grid-cols-1 gap-2">
						<KeyValueRow
							label="Previous hire purchase company"
							value="Big brother 9ja"
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
					</div>
				</section>

				<section className={titleSectionStyle}>
					<SectionTitle title="Employment details" />
					<div className="grid grid-cols-1 gap-2">
						<KeyValueRow label="Employment status" value="Civil servant" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Employer name" value="Tony Henshaw" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							label="Employer address"
							value="2 ikorudu street"
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
					</div>
				</section>

				<div>
					<small className="text-[#131212B2]">
						I hereby authorise <b className="font-medium text-black">Kpoi Kpoi Mingi Investments Ltd</b> to retrieve the electrical appliance from me,
						or any other person at my or any other place it may be found in the event of my default in paying the Hire Purchase sum as agreed.
					</small>
				</div>

				<section className={titleSectionStyle}>
					<SectionTitle
						title="Guarantor (1)"
						children={
							<>
								<small className="text-[#131212B2] ">
									As a guarantor, I hereby guaranty to pay all sums due under the Hire Purchase Agreement in the event of default by the Applicant.{" "}
									<br />
									<br /> I accept that messages, notices, processes and other correspondences where necessary, sent to my WhatsApp number as shown
									herein are properly delivered and served on me.
								</small>
							</>
						}
					/>
					<div className="grid grid-cols-1 gap-2">
						<KeyValueRow label="Full name" value="Donald Trumph" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Occupation" value="Self employed" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Phone number" value="+2345955895" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Email" value="dunny@gmail.com" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Home address" value="3 ikorudu street" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							label="Business address"
							value="3 ikorudu street"
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow label="State of origin" value="Lagos state" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							label="Voters card"
							className="items-center"
							variant="files"
							files={[{ url: "#", label: "Voters card" }]}
							leftClassName="text-sm text-muted-foreground"
						/>
					</div>
				</section>

				<section className={titleSectionStyle}>
					<SectionTitle
						title="Guarantor (2)"
						children={
							<>
								<small className="text-[#131212B2]">
									As a guarantor, I hereby guaranty to pay all sums due under the Hire Purchase Agreement in the event of default by the Applicant.{" "}
									<br />
									<br /> I accept that messages, notices, processes and other correspondences where necessary, sent to my WhatsApp number as shown
									herein are properly delivered and served on me.
								</small>
							</>
						}
					/>
					<div className="grid grid-cols-1 gap-2">
						<KeyValueRow label="Full name" value="Donald Trumph" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Occupation" value="Self employed" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Phone number" value="+2345955895" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Email" value="dunny@gmail.com" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow label="Home address" value="3 ikorudu street" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							label="Business address"
							value="3 ikorudu street"
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow label="State of origin" value="Lagos state" leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							className="items-center"
							label="Voters card"
							variant="files"
							files={[{ url: "#", label: "Voters card" }]}
							leftClassName="text-sm text-muted-foreground"
						/>
					</div>
				</section>
			</CustomCard>
		</CustomCard>
	);
}
