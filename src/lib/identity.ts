import { api } from "@/hooks/auth"
import { Roles } from "./roles";

export const getIdentity = async (identity: 'student' | 'teacher', userId: string) => {
    const res = await api.get<{
        data: Roles
    }>(`/api/user/identity?identity=${identity}&identity_id=${userId}`);

    console.log('identity', res)

    return res.data.data
}