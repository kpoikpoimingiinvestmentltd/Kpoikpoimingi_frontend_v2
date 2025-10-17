export type ChangePasswordInput = {
	currentPassword: string;
	newPassword: string;
};

export type UserStatus = {
	id: number;
	status: string;
};

export type UserRole = {
	id: number;
	role: string;
};

export type User = {
	id: string;
	fullName: string;
	email?: string;
	username?: string;
	roleId?: number;
	status?: UserStatus;
	role?: UserRole;
	branchLocation?: string;
	createdAt?: string;
	phoneNumber?: string;
	media?: any | null;
};
