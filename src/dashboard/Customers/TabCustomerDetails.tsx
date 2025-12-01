import CustomCard from "@/components/base/CustomCard";
import SectionTitle from "@/components/common/SectionTitle";
import KeyValueRow from "@/components/common/KeyValueRow";
import { useGetReferenceData } from "@/api/reference";
import { extractStateOptions } from "@/lib/referenceDataHelpers";
import React from "react";
import type { CustomerDetails, MediaFile } from "@/types/customer";

const titleSectionStyle = "flex flex-col gap-3";

export default function TabCustomerDetails({ customer }: { customer?: CustomerDetails | null }) {
	// Get the current registration (latest)
	const registration = customer?.registrations?.[0];
	const nok = registration?.nextOfKin;
	const employment = registration?.employmentDetails;
	const property = registration?.propertyInterestRequest?.[0];
	const guarantors = registration?.guarantors ?? [];

	// Fetch reference data for state options
	const { data: refData } = useGetReferenceData();
	const stateOfOriginOptions = React.useMemo(() => extractStateOptions(refData), [refData]);

	const formatPhoneNumber = (phone?: string) => {
		if (!phone) return "";
		return phone.startsWith("+") ? phone : `+234${phone}`;
	};

	const getStateNameById = (stateId?: string): string => {
		if (!stateId) return "";
		const state = stateOfOriginOptions.find((o) => o.key === stateId);
		return state?.value || stateId;
	};

	// Transform media files from API format { fileUrl } to component format { url }
	const transformMediaFiles = (mediaArray?: MediaFile[]): { url: string }[] => {
		if (!Array.isArray(mediaArray)) return [];
		return mediaArray.map((item) => ({ url: item.fileUrl ?? "" }));
	};

	// Build summary values (support both installment and full-payment shapes)
	const allRegistrations = customer?.registrations ?? [];
	const allProps: Record<string, unknown>[] = [];
	allRegistrations.forEach((r) => {
		if (!r || typeof r !== "object") return;
		const rec = r as Record<string, unknown>;
		const candidates = Array.isArray(rec["propertyInterestRequest"])
			? (rec["propertyInterestRequest"] as unknown[])
			: Array.isArray(rec["properties"])
			? (rec["properties"] as unknown[])
			: [];
		candidates.forEach((p) => {
			if (p && typeof p === "object") allProps.push(p as Record<string, unknown>);
		});
	});

	const propertyNames = allProps
		.map((p) => {
			// prefer explicit propertyName, then customPropertyName, then nested property.name
			if (typeof p["propertyName"] === "string" && p["propertyName"]) return p["propertyName"] as string;
			if (typeof p["customPropertyName"] === "string" && p["customPropertyName"]) return p["customPropertyName"] as string;
			const nested = p["property"];
			if (nested && typeof nested === "object" && typeof (nested as Record<string, unknown>)["name"] === "string") {
				return (nested as Record<string, unknown>)["name"] as string;
			}
			return "";
		})
		.filter(Boolean);

	const totalQuantity = allProps.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0) || propertyNames.length || 0;

	const totalAmount = allProps.reduce((acc, p) => {
		const v = Number(p.customPropertyPrice ?? p.customPrice ?? p.price ?? p.downPayment ?? 0) || 0;
		return acc + v * (Number(p.quantity) || 1);
	}, 0);

	const rawPt = customer?.paymentTypeId;
	const pt = typeof rawPt === "number" ? rawPt : typeof rawPt === "string" && /^\d+$/.test(rawPt) ? Number(rawPt) : undefined;

	const allPropsAreCustom =
		allProps.length > 0 &&
		allProps.every((p) => {
			const rec = p as Record<string, unknown>;
			return !!rec["isCustomProperty"] || rec["customPropertyPrice"] != null;
		});

	const paymentMethodLabel = pt === 2 || String(pt) === "2" || allPropsAreCustom ? "One time payment" : "Hire Purchase";

	const isFullPayment = paymentMethodLabel === "One time payment";
	return (
		<CustomCard className="mt-4 border-none p-0 bg-white">
			<SectionTitle title="Customer Details" />
			<CustomCard className="mt-6 grid grid-cols-1 gap-6 md:p-8 bg-card">
				{/* Personal Information */}
				{/* Top summary for full payment / quick details */}
				{allProps.length > 0 && (
					<section className={titleSectionStyle}>
						<div className="grid grid-cols-1  gap-2">
							<KeyValueRow
								label="Property Name"
								value={propertyNames[0] || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Amount"
								value={totalAmount ? `₦${totalAmount.toLocaleString()}` : "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Payment Method"
								value={paymentMethodLabel}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Number of properties"
								value={String(totalQuantity)}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							{propertyNames.length > 0 && (
								<KeyValueRow
									label="Property Name(s)"
									value={propertyNames.join(",")}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
							)}
						</div>
					</section>
				)}
				<section className={titleSectionStyle}>
					<SectionTitle title="Personal information" />
					<div className="space-y-2">
						<KeyValueRow
							label="Customer full name"
							value={customer?.fullName || "N/A"}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						<KeyValueRow label="Email" value={customer?.email || "N/A"} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
						<KeyValueRow
							label="Whatsapp number"
							value={customer?.phoneNumber || "N/A"}
							leftClassName="text-sm text-muted-foreground"
							rightClassName="text-right"
						/>
						{customer?.customerCode && (
							<KeyValueRow
								label="Customer code"
								value={customer.customerCode}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
						)}
						{customer?.createdAt && (
							<KeyValueRow
								label="Created at"
								value={new Date(customer.createdAt).toLocaleDateString()}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
						)}
						{registration?.dateOfBirth && (
							<KeyValueRow
								label="Date of birth"
								value={new Date(registration.dateOfBirth).toLocaleDateString()}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
						)}
						{employment?.homeAddress && (
							<KeyValueRow
								label="Home Address"
								value={employment.homeAddress}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
						)}
					</div>
				</section>
				{/* Identification Documents */}
				<section className={titleSectionStyle}>
					<SectionTitle title="Identification Documents" />
					<div>
						<KeyValueRow
							className="items-center"
							label="NIN"
							variant="files"
							files={transformMediaFiles(registration?.mediaFiles?.identificationDocument ?? [])}
							leftClassName="text-sm text-muted-foreground"
						/>
						<KeyValueRow
							className="items-center"
							label="Drivers license"
							variant="files"
							files={transformMediaFiles(registration?.mediaFiles?.driverLicense ?? [])}
							leftClassName="text-sm text-muted-foreground"
						/>
						<KeyValueRow
							className="items-center"
							label="Indigene certificate"
							variant="files"
							files={transformMediaFiles(registration?.mediaFiles?.indegeneCertificate ?? [])}
							leftClassName="text-sm text-muted-foreground"
						/>
						<KeyValueRow
							className="items-center"
							label="Signed contract"
							variant="files"
							files={transformMediaFiles(registration?.mediaFiles?.signedContract ?? [])}
							leftClassName="text-sm text-muted-foreground"
						/>
					</div>
				</section>{" "}
				{/* Next of Kin Details */}
				{!isFullPayment && nok && (
					<section className={titleSectionStyle}>
						<SectionTitle title="Next of kin details" />
						<div className="grid grid-cols-1 gap-2">
							<KeyValueRow label="Name" value={nok.fullName || "N/A"} leftClassName="text-sm text-muted-foreground" rightClassName="text-right" />
							<KeyValueRow
								label="Phone number"
								value={formatPhoneNumber(nok.phoneNumber) || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Relationship"
								value={nok.relationship || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							{nok.isNextOfKinSpouse === "Yes" && (
								<>
									<KeyValueRow
										label="Spouse name"
										value={nok.spouseFullName || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
									<KeyValueRow
										label="Spouse phone number"
										value={formatPhoneNumber(nok.spousePhone) || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
									<KeyValueRow
										label="Spouse address"
										value={nok.spouseAddress || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
								</>
							)}
						</div>
					</section>
				)}
				{/* Property Details (hire-purchase only) */}
				{!isFullPayment && property && (
					<section className={titleSectionStyle}>
						<SectionTitle title="Property details" />
						<div className="grid grid-cols-1 gap-2">
							<KeyValueRow
								label="Property name"
								value={property.propertyName || registration?.customPropertyName || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Payment frequency"
								value={property.paymentInterval?.intervals || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							{property.durationValue && (
								<KeyValueRow
									label="Payment duration"
									value={`${property.durationValue} ${property.durationUnit?.id === 1 ? "weeks" : "months"}`}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
							)}
							<KeyValueRow
								label="Down payment amount"
								value={`₦${Number(property.downPayment || 0).toLocaleString()}`}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							{registration?.purposeOfProperty && (
								<KeyValueRow
									label="What do you need this property for"
									value={registration.purposeOfProperty}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
							)}
						</div>
					</section>
				)}
				{/* Clarification Details (hire-purchase only) */}
				{!isFullPayment && (
					<section className={titleSectionStyle}>
						<SectionTitle title="Clarification details" />
						<div className="grid grid-cols-1 gap-2">
							<KeyValueRow
								label="Previous hire purchase"
								value={registration?.previousHirePurchase || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							{registration?.previousCompany && (
								<KeyValueRow
									label="Previous hire purchase company"
									value={registration.previousCompany}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
							)}
							{registration?.wasPreviousCompleted && (
								<KeyValueRow
									label="Was previous agreement completed"
									value={registration.wasPreviousCompleted}
									leftClassName="text-sm text-muted-foreground"
									rightClassName="text-right"
								/>
							)}
						</div>
					</section>
				)}
				{/* Employment Details (hire-purchase only) */}
				{!isFullPayment && employment && (
					<section className={titleSectionStyle}>
						<SectionTitle title="Employment details" />
						<div className="grid grid-cols-1 gap-2">
							<KeyValueRow
								label="Employment status"
								value={employment.employmentStatus?.status || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							{employment.employmentStatus?.status === "SELF EMPLOYED" ? (
								<>
									<KeyValueRow
										label="Company name"
										value={employment.companyName || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
									<KeyValueRow
										label="Business address"
										value={employment.businessAddress || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
								</>
							) : (
								<>
									<KeyValueRow
										label="Employer name"
										value={employment.employerName || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
									<KeyValueRow
										label="Employer address"
										value={employment.employerAddress || "N/A"}
										leftClassName="text-sm text-muted-foreground"
										rightClassName="text-right"
									/>
								</>
							)}
						</div>
					</section>
				)}
				<div>
					<small className="text-[#131212B2]">
						I hereby authorise <b className="font-medium text-black">Kpoi Kpoi Mingi Investments Ltd</b> to retrieve the electrical appliance from me,
						or any other person at my or any other place it may be found in the event of my default in paying the Hire Purchase sum as agreed.
					</small>
				</div>
				{!isFullPayment && (
					<section className={titleSectionStyle}>
						<SectionTitle
							title="Guarantor (1)"
							children={
								<>
									<small className="text-[#131212B2] ">
										As a guarantor, I hereby guaranty to pay all sums due under the Hire Purchase Agreement in the event of default by the Applicant.{" "}
										<br />
										<br /> I accept that messages, notices, processes and other correspondences where necessary, sent to my WhatsApp number as shown
										herein are properly delivered and served on me.
									</small>
								</>
							}
						/>
						<div className="grid grid-cols-1 gap-2">
							<KeyValueRow
								label="Full name"
								value={guarantors[0]?.fullName || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Occupation"
								value={guarantors[0]?.occupation || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Phone number"
								value={formatPhoneNumber(guarantors[0]?.phoneNumber) || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Email"
								value={guarantors[0]?.email || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Employment status"
								value={guarantors[0]?.employmentStatus?.status || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Home address"
								value={guarantors[0]?.homeAddress || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Business address"
								value={guarantors[0]?.companyAddress || guarantors[0]?.businessAddress || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="State of origin"
								value={getStateNameById(guarantors[0]?.stateOfOrigin) || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Identity documents"
								className="items-center"
								variant="files"
								files={transformMediaFiles(registration?.mediaFiles?.guarantor_0_doc ?? [])}
								leftClassName="text-sm text-muted-foreground"
							/>
						</div>
					</section>
				)}
				{guarantors.length > 1 && (
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
							<KeyValueRow
								label="Full name"
								value={guarantors[1]?.fullName || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Occupation"
								value={guarantors[1]?.occupation || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Phone number"
								value={formatPhoneNumber(guarantors[1]?.phoneNumber || "")}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Email"
								value={guarantors[1]?.email || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Home address"
								value={guarantors[1]?.homeAddress || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Business address"
								value={guarantors[1]?.businessAddress || guarantors[1]?.companyAddress || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="State of origin"
								value={getStateNameById(guarantors[1]?.stateOfOrigin || "")}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Employment status"
								value={guarantors[1]?.employmentStatus?.status || "N/A"}
								leftClassName="text-sm text-muted-foreground"
								rightClassName="text-right"
							/>
							<KeyValueRow
								label="Identity documents"
								className="items-center"
								variant="files"
								files={transformMediaFiles(registration?.mediaFiles?.guarantor_1_doc ?? [])}
								leftClassName="text-sm text-muted-foreground"
							/>
						</div>
					</section>
				)}
			</CustomCard>
		</CustomCard>
	);
}
