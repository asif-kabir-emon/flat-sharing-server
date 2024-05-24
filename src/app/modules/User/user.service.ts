import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import config from "../../config";
import { TCreateUser } from "./user.interface";
import { USER_ROLE } from "@prisma/client";

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
    const result = await prisma.userProfile.findUniqueOrThrow({
        where: {
            userId: userId,
        },
    });

    return result;
};

export const UserServices = {
    registerUserIntoDB,
    getUserProfileFromDB,
    updateProfileIntoDB,
    getMyProfileFromDB,
};
