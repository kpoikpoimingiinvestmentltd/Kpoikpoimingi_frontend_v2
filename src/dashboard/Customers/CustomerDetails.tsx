import CustomCard from "@/components/base/CustomCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { tabListStyle, tabStyle } from "../../components/common/commonStyles";
import TabCustomerDetails from "./TabCustomerDetails";
import TabPaymentHistory from "./TabPaymentHistory";
import TabReceipt from "./TabReceipt";
import TabDocument from "./TabDocument";
import TabContractInfo from "./TabContractInfo";
import PageWrapper from "../../components/common/PageWrapper";
import { useParams, useSearchParams } from "react-router";
import { useState, useCallback } from "react";
import {
	useGetCustomer,
	useGetCustomerContracts,
	useGetCustomerPayments,
	useGetCustomerDocuments,
	useGetCustomerReceipts,
	useGetCustomerApprovedRegistrations,
} from "@/api/customer";
import { EditIcon, IconWrapper } from "@/assets/icons";
import EditCustomerModal from "./EditCustomerModal";
import ActionButton from "../../components/base/ActionButton";

export default function CustomerDetails() {
	const { id } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = searchParams.get("tab") || "details";
	const { data: customer } = useGetCustomer(id, true);
	const { data: approvedRegistrations } = useGetCustomerApprovedRegistrations(id, true);
	const { data: contracts, isLoading: isLoadingContracts } = useGetCustomerContracts(id, true);
	const { data: payments } = useGetCustomerPayments(id, true);
	const { data: documents } = useGetCustomerDocuments(id, true);
	const { data: receipts } = useGetCustomerReceipts(id, true);
	const [isEditOpen, setIsEditOpen] = useState(false);

	const handleTabChange = useCallback(
		(tab: string) => {
			const params = new URLSearchParams(searchParams);
			params.set("tab", tab);
			setSearchParams(params);
		},
		[searchParams, setSearchParams],
	);

	const hasFullName = (obj: unknown): obj is { fullName?: string } => typeof obj === "object" && obj !== null && "fullName" in obj;

	const getStringField = (obj: unknown, key: string): string | undefined => {
		if (!obj || typeof obj !== "object") return undefined;
		const rec = obj as Record<string, unknown>;
		const v = rec[key];
		return typeof v === "string" ? v : undefined;
	};

	const getNumberField = (obj: unknown, key: string): number | undefined => {
		if (!obj || typeof obj !== "object") return undefined;
		const rec = obj as Record<string, unknown>;
		const v = rec[key];
		if (typeof v === "number") return v;
		if (typeof v === "string" && /^\d+$/.test(v)) return Number(v);
		return undefined;
	};

	const getArrayField = (obj: unknown, key: string): unknown[] | undefined => {
		if (!obj || typeof obj !== "object") return undefined;
		const rec = obj as Record<string, unknown>;
		const v = rec[key];
		return Array.isArray(v) ? (v as unknown[]) : undefined;
	};

	const displayName = customer
		? hasFullName(customer) && customer.fullName
			? customer.fullName
			: (getStringField(Array.isArray(approvedRegistrations) ? approvedRegistrations[0] : approvedRegistrations, "fullName") ?? "")
		: "";

	const registrationsFromCustomer = getArrayField(customer, "registrations");
	const registrationsToPass =
		registrationsFromCustomer && registrationsFromCustomer.length > 0
			? registrationsFromCustomer
			: Array.isArray(approvedRegistrations) && approvedRegistrations.length > 0
				? approvedRegistrations
				: undefined;

	const registrationForEdit =
		registrationsFromCustomer && registrationsFromCustomer.length > 0
			? registrationsFromCustomer[0]
			: Array.isArray(approvedRegistrations)
				? approvedRegistrations[0]
				: approvedRegistrations || customer;

	const resolveIsFullPayment = (): boolean => {
		// check top-level customer
		if (customer && typeof customer === "object") {
			const cust = customer as Record<string, unknown>;
			if (cust.paymentType && typeof cust.paymentType === "object") {
				const pt = cust.paymentType as Record<string, unknown>;
				if (pt.id === 2 || (typeof pt.id === "string" && pt.id === "2")) return true;
			}
			if (cust.paymentTypeId === 2 || (typeof cust.paymentTypeId === "string" && cust.paymentTypeId === "2")) return true;
		}

		// check registrationForEdit (preferred source)
		if (registrationForEdit && typeof registrationForEdit === "object") {
			const reg = registrationForEdit as Record<string, unknown>;
			if (reg.paymentType && typeof reg.paymentType === "object") {
				const pt = reg.paymentType as Record<string, unknown>;
				if (pt.id === 2 || (typeof pt.id === "string" && pt.id === "2")) return true;
			}
			if (reg.paymentTypeId === 2 || (typeof reg.paymentTypeId === "string" && reg.paymentTypeId === "2")) return true;
		}

		return false;
	};

	const isFullPaymentFromRegistration = resolveIsFullPayment();

	return (
		<PageWrapper className="flex flex-col gap-6">
			<div className="flex items-center justify-between flex-wrap gap-4">
				<div>
					<h1 className="text-xl font-medium">Customers Details</h1>
					<p className="text-sm text-muted-foreground mt-1">{String(displayName)}</p>
				</div>
				<div className="flex items-center gap-3">
					<ActionButton
						type="button"
						onClick={() => setIsEditOpen(true)}
						className="flex items-center gap-0.5 px-4 py-2 text-sm hover:text-black dark:bg-primary dark:text-white rounded-md transition">
						<IconWrapper className="text-xl">
							<EditIcon />
						</IconWrapper>
						<span>Edit</span>
					</ActionButton>
				</div>
			</div>

			<CustomCard className="p-4 sm:p-6 border-0">
				<Tabs value={activeTab} onValueChange={handleTabChange}>
					<TabsList className={tabListStyle}>
						<TabsTrigger value="details" className={tabStyle}>
							Customer details
						</TabsTrigger>
						{(() => {
							const isFullPayment = isFullPaymentFromRegistration;
							return (
								<TabsTrigger value="contract" className={tabStyle} disabled={isFullPayment}>
									Contracts
								</TabsTrigger>
							);
						})()}
						<TabsTrigger value="payments" className={tabStyle}>
							Payment History
						</TabsTrigger>
						<TabsTrigger value="receipt" className={tabStyle}>
							Receipt
						</TabsTrigger>
						{(() => {
							const isFullPayment = isFullPaymentFromRegistration;
							return (
								<TabsTrigger value="document" className={tabStyle} disabled={isFullPayment}>
									Document
								</TabsTrigger>
							);
						})()}
					</TabsList>

					<div className="mt-6">
						<TabsContent value="details">
							<TabCustomerDetails
								customer={
									customer
										? {
												fullName:
													hasFullName(customer) && customer.fullName
														? customer.fullName
														: getStringField(Array.isArray(approvedRegistrations) ? approvedRegistrations[0] : approvedRegistrations, "fullName"),
												email: getStringField(customer, "email") ?? customer?.email,
												phoneNumber:
													getStringField(customer, "phoneNumber") ??
													getStringField(customer, "phone") ??
													(Array.isArray(approvedRegistrations)
														? (getStringField(approvedRegistrations[0], "phoneNumber") ?? getStringField(approvedRegistrations[0], "phone"))
														: (getStringField(approvedRegistrations, "phoneNumber") ?? getStringField(approvedRegistrations, "phone"))),
												customerCode:
													getStringField(customer, "customerCode") ??
													(customer && typeof customer === "object" ? String((customer as Record<string, unknown>).id) : undefined),
												createdAt: getStringField(customer, "createdAt") ?? customer?.createdAt ?? undefined,
												registrations: registrationsToPass,
												paymentTypeId:
													getNumberField(customer, "paymentTypeId") ??
													(Array.isArray(approvedRegistrations)
														? getNumberField(approvedRegistrations[0], "paymentTypeId")
														: getNumberField(approvedRegistrations, "paymentTypeId")),
											}
										: null
								}
							/>
						</TabsContent>
						<TabsContent value="payments">
							<TabPaymentHistory payments={payments} customerId={id} />
						</TabsContent>
						<TabsContent value="receipt">
							<TabReceipt receipts={receipts} />
						</TabsContent>
						<TabsContent value="document">
							<TabDocument documents={documents} />
						</TabsContent>
						<TabsContent value="contract">
							<TabContractInfo contracts={contracts} isLoading={isLoadingContracts} />
						</TabsContent>
					</div>
				</Tabs>
			</CustomCard>

			<EditCustomerModal open={isEditOpen} onOpenChange={setIsEditOpen} initial={registrationForEdit} documents={documents} />
		</PageWrapper>
	);
}
