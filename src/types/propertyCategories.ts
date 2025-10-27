// Types for property categories
export type CategoryDto = { id: string; name: string };

export type Category = {
	id: string;
	title?: string;
	name?: string;
	subs?: string[];
	count?: number;
	[k: string]: any;
};

export type CategoriesState = {
	list: Category[];
};

export type Paginated<T> = {
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
	data: T[];
};
