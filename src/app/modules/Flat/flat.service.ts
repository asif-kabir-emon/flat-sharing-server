import { Flat, Prisma } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import prisma from "../../utils/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { TPaginationOptions } from "../../interfaces/pagination";
import { TFlatFilterRequest } from "./flat.interface";
import { paginationHelper } from "../../helpers/paginationHelper";
import { flatSearchableFields, flatSortableFields } from "./flat.constant";

const addFlatIntoDB = async (user: JwtPayload, flatData: Flat) => {
    const flat = await prisma.flat.create({
        data: flatData,
    });

    if (!flat) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Flat not added");
    }

    return flat;
};

const updateFlatInfoIntoDB = async (
    user: JwtPayload,
    flatId: string,
    flatData: Flat
) => {
    await prisma.flat.findFirstOrThrow({
        where: {
            id: flatId,
        },
    });

    const result = await prisma.flat.update({
        where: {
            id: flatId,
        },
        data: flatData,
    });

    return result;
};

const getAllFlatsFromDB = async (
    params: TFlatFilterRequest,
    options: TPaginationOptions
) => {
    const { searchTerm, ...filterData } = params;
    let { limit, page, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    if (sortBy && !flatSortableFields.includes(sortBy)) {
        sortBy = "createdAt";
        sortOrder = "desc";
    }

    const andConditions: Prisma.FlatWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: flatSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
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
        availability: true,
    });

    const whereConditions: Prisma.FlatWhereInput = { AND: andConditions };

    const result = await prisma.flat.findMany({
        where: whereConditions,
        skip: skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const total = await prisma.flat.count({
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

export const FlatServices = {
    addFlatIntoDB,
    updateFlatInfoIntoDB,
    getAllFlatsFromDB,
};
