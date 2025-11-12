// Types for customer routes
export type CustomerDto = { id: string; name: string; email?: string };

export type Customer = {
	id: string;
	name: string;
	email: string;
	phone?: string;
	address?: string;
	status?: string;
	createdAt?: string;
	updatedAt?: string;
};

export type GetAllCustomersResponse = {
	data: Customer[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
};

export interface DeleteCustomerResponse {
	id: string;
	customerCode: string;
	fullName: string;
	email: string;
	registrations: Array<{
		id: string;
		registrationCode: string;
	}>;
}
