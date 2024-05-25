import { USER_ROLE } from "@prisma/client";

export type TCreateUser = {
    name: string;
    email: string;
    password: string;
};

export type TUserFilterRequest = {
    searchTerm?: string;
    name?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
    isVerified?: boolean;
};
