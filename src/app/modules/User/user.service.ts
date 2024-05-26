import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import config from "../../config";
import { TCreateUser, TUserFilterRequest } from "./user.interface";
import { Prisma, USER_ROLE } from "@prisma/client";
import { TPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";
import { userSortableFields } from "./user.constant";

const registerUserIntoDB = async (payload: TCreateUser) => {
    // check if user already exist with this email
    const isUserExist = await prisma.user.findMany({
        where: {
            email: payload.email,
        },
    });

    if (isUserExist.length) {
        throw new ApiError(
            httpStatus.CONFLICT,
            "User already exist with this email"
        );
    }

    // hashed password
    const hashedPassword = await bcrypt.hash(
        payload.password,
        config.salt_rounds
    );

    const userPayload = {
        email: payload.email,
        password: hashedPassword,
        needChangePassword: false,
        role: USER_ROLE.USER,
    };

    const result = await prisma.$transaction(async (transactionClient) => {
        // create user
        const createdUser = await transactionClient.user.create({
            data: userPayload,
        });

        const profilePayload = {
            userId: createdUser.id,
            name: payload.name,
        };

        // create user profile
        const createdProfile = await transactionClient.userProfile.create({
            data: profilePayload,
        });

        return {
            id: createdUser.id,
            name: createdProfile.name,
            email: createdUser.email,
            createdAt: createdUser.createdAt,
            updatedAt: createdUser.updatedAt,
        };
    });

    return result;
};

const getUserProfileFromDB = async (userId: string) => {
    const result = await prisma.userProfile.findUniqueOrThrow({
        where: {
            userId: userId,
        },
    });

    return result;
};

const updateProfileIntoDB = async (
    userId: string,
    payload: {
        bio?: string;
        profession?: string;
        address?: string;
    }
) => {
    await prisma.userProfile.findUniqueOrThrow({
        where: {
            userId: userId,
        },
    });

    const result = await prisma.userProfile.update({
        where: {
            userId: userId,
        },
        data: payload,
    });

    return result;
};

const getMyProfileFromDB = async (userId: string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
            isActive: true,
        },
        select: {
            email: true,
            role: true,
            isActive: true,
            isVerified: true,
        },
    });

    const result = await prisma.userProfile.findUniqueOrThrow({
        where: {
            userId: userId,
        },
    });

    return {
        ...result,
        ...user,
    };
};

const getAllUsersFromDB = async (
    params: TUserFilterRequest,
    options: TPaginationOptions
) => {
    const { searchTerm, name, ...filterData } = params;
    let { limit, page, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    if (sortBy && !userSortableFields.includes(sortBy)) {
        sortBy = "createdAt";
        sortOrder = "desc";
    }

    const andConditions: Prisma.UserWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    email: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    userProfile: {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        });
    }
    if (Object.keys(filterData).length) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: (filterData as any)[key],
                },
            })),
        });
    }

    andConditions.push({
        isDeleted: false,
    });

    if (name) {
        andConditions.push({
            userProfile: {
                name: {
                    contains: name,
                    mode: "insensitive",
                },
            },
        });
    }

    const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

    const result = await prisma.user.findMany({
        where: whereConditions,
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            userProfile: true,
        },
    });

    const total = await prisma.user.count({
        where: whereConditions,
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};

const updateUserRoleIntoDB = async (userId: string, role: USER_ROLE) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
            isDeleted: false,
        },
    });

    if (user.role === role) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Role is already same.");
    }

    const result = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            role,
        },
    });

    if (!result || result.role !== role) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Role failed to update.");
    }

    return result;
};

const updateUserStatusIntoDB = async (userId: string, isActive: boolean) => {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
            isDeleted: false,
        },
    });

    if (user.isActive === isActive) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Status is already same.");
    }

    const result = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            isActive,
        },
    });

    if (!result || result.isActive !== isActive) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Status failed to update.");
    }

    return result;
};

export const UserServices = {
    registerUserIntoDB,
    getUserProfileFromDB,
    getMyProfileFromDB,
    getAllUsersFromDB,
    updateProfileIntoDB,
    updateUserRoleIntoDB,
    updateUserStatusIntoDB,
};
