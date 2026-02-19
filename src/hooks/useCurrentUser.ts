import { useGetUser } from "@/api/user";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import type { User } from "@/types/user";

export function useCurrentUser() {
	const authId = useSelector((state: RootState) => state.auth.id);
	return useGetUser(authId || undefined) as ReturnType<typeof useGetUser> & { data?: User };
}
