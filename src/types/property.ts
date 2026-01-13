// Form Data for creating/updating properties
export type PropertyFormData = {
	name: string;
	categoryId: string;
	price: number;
	quantityTotal: number;
	isPublic: boolean;
	vehicleMake?: string;
	vehicleModel?: string;
	vehicleYear?: number;
	vehicleColor?: string;
	vehicleChassisNumber?: string;
	vehicleType?: string;
	vehicleRegistrationNumber?: string;
	condition: string;
	propertyRequestId?: string;
	description?: string;
};

// Request payload for property API
export type PropertyPayload = {
	name: string;
	categoryId: string;
	price: number;
	quantityTotal: number;
	isPublic: boolean;
	condition: string;
	mediaKeys: Record<string, string>;
	vehicleMake?: string;
	vehicleModel?: string;
	vehicleYear?: number;
	vehicleColor?: string;
	vehicleChassisNumber?: string;
	vehicleType?: string;
	vehicleRegistrationNumber?: string;
	propertyRequestId?: string;
	description?: string;
};

// Response from create/update property endpoints
export type PropertyResponse = {
	id: string;
	message: string;
};

// Full property data from API
export type PropertyData = {
	id: string;
	propertyCode: string;
	name: string;
	price: string;
	description: string;
	quantityTotal: number;
	quantityAssigned: number;
	quantityAvailable: number;
	addedBy: { fullName: string };
	dateAdded: string;
	category: { id: string; category: string; parentId?: string; parent?: { id: string; category: string } };
	status: { status: string };
	media: string[];
	stockStatus: string;
	isLowStock: boolean;
	isOutOfStock: boolean;
	stockPercentage: number;
	condition?: string;
	vehicleMake?: string;
	vehicleModel?: string;
	vehicleYear?: number;
	vehicleColor?: string;
	vehicleChassisNumber?: string;
	vehicleType?: string;
	vehicleRegistrationNumber?: string;
};

// Types for property routes
export type PropertyDto = { id: string; name: string };

// EditPropertyDetailsModal component props
export type EditPropertyDetailsModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave?: (data: Record<string, unknown>) => void;
	isLoading?: boolean;
	initial?: {
		id?: string;
		propertyCode?: string;
		name?: string;
		price?: string;
		quantity?: string;
		quantityTotal?: number;
		quantityAssigned?: number;
		status?: string | { status?: string };
		numberAssigned?: string;
		category?: string | { category?: string; id?: string };
		categoryId?: string;
		addedOn?: string;
		dateAdded?: string;
		subCategory?: string;
		vehicleModel?: string;
		vehicleMake?: string;
		vehicleYear?: number;
		type?: string;
		vehicleType?: string;
		colour?: string;
		vehicleColor?: string;
		registrationNumber?: string;
		vehicleRegistrationNumber?: string;
		chassisNumber?: string;
		vehicleChassisNumber?: string;
		condition?: string;
		description?: string;
		isPublic?: boolean;
		images?: string[];
		media?: string[];
	};
};
