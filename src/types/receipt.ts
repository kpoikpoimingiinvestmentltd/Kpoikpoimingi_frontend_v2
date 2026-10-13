// Types for receipt
export type ReceiptDto = { id: string; amount: number };

export type GenerateReceiptPayload = {
  customerId: string;
  amount: string | number;
  paymentMethodId: string | number;
  paymentDate: string;
  generatedBy?: string;
  notes?: string;
};

export type ReceiptListItem = {
  id: string;
  receiptNumber?: string;
  paymentId?: string | null;
  customerId?: string | null;
  contractId?: string | null;
  outrightSaleId?: string | null;
  propertyName?: string;
  amountPaid?: string | number;
  totalAmount?: string | number;
  paymentDate?: string;
  paymentMethod?: { id?: number; method?: string } | string;
  status?: { id?: number; status?: string };
  transactionType?: "hire_purchase" | "outright_sale";
  createdAt?: string;
  updatedAt?: string;
  customer?: { id?: string; fullName?: string; phoneNumber?: string } | null;
  contract?: {
    id?: string;
    contractCode?: string;
    property?: { name?: string; price?: string };
  } | null;
  outrightSale?: {
    id?: string;
    customerName?: string;
    paymentReference?: string | null;
  } | null;
};

export type ReceiptDetail = {
  id: string;
  receiptNumber?: string;
  paymentId?: string | null;
  customerId?: string | null;
  contractId?: string | null;
  outrightSaleId?: string | null;
  propertyName?: string;
  amountPaid?: string | number;
  paymentDate?: string;
  paymentMethodId?: number;
  paymentMethod?: { id?: number; method?: string } | string;
  issuedById?: string;
  issuedBy?: { id?: string; fullName?: string; staffCode?: string };
  vatAmount?: string | number;
  vatUsed?: string | number;
  totalAmount?: string | number;
  interest?: number;
  nextPaymentDate?: string;
  createdAt?: string;
  updatedAt?: string;
  statusId?: number;
  source?: string;
  transactionType?: "hire_purchase" | "outright_sale";
  contract?: {
    id?: string;
    contractCode?: string;
    property?: { name?: string; price?: string };
    durationValue?: number;
    durationUnit?: { duration?: string };
    downPayment?: string;
    outStandingBalance?: string;
    paymentType?: { id?: number; type?: string };
    propertyInterestRequests?: Array<{
      quantity: number;
      isCustomProperty?: boolean;
      customPropertyName?: string | null;
      customPropertyPrice?: string | null;
      property?: { id?: string; name?: string; price?: string };
    }>;
  } | null;
  customer?: {
    id?: string;
    fullName?: string;
    phoneNumber?: string;
    email?: string;
    customerCode?: string;
    isMigrated?: boolean;
    address?: string;
    homeAddress?: string;
    registrations?: Array<{
      homeAddress?: string;
      employmentDetails?: {
        homeAddress?: string;
        businessAddress?: string;
      };
    }>;
  } | null;
  outrightSale?: {
    id?: string;
    customerName?: string;
    customerEmail?: string | null;
    customerPhone?: string | null;
    paymentReference?: string | null;
  } | null;
  installmentProgress?: string;
  totalInstallments?: number;
  propertiesBreakdown?: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  payment?: { reference?: string } | null;
};
