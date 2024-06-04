import { fileUploader } from "./../../helpers/fileUploader";
import { Flat, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import { TPaginationOptions } from "../../interfaces/pagination";
import { TFlatFilterRequest } from "./flat.interface";
import { paginationHelper } from "../../helpers/paginationHelper";
import { flatSearchTermFields, flatSortableFields } from "./flat.constant";
import { Request } from "express";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const addFlatIntoDB = async (req: Request) => {
    const userId: string = req.user.id;
    const flatData: Flat = req.body;
    const files = req.files as Express.Multer.File[];

    const result = await prisma.$transaction(async (tsc) => {
        console.log("flatData", flatData);
        const createdFlat = await tsc.flat.create({
            data: flatData,
        });
        console.log("createdFlat", createdFlat);

        const createdUserFlat = await tsc.userFlat.create({
            data: {
                userId: userId,
                flatId: createdFlat.id,
            },
        });

        return createdFlat;
    });

    console.log("result", result);

    if (files?.length) {
        const flatPhotos: string[] = [...result.photos];

        for (const file of files) {
            const uploadCloudinary = (await fileUploader.uploadToCloudinary(
                file,
                `${result.id}_photo_${flatPhotos.length + 1}`
            )) as {
                secure_url: string;
            };
            flatPhotos.push(uploadCloudinary.secure_url);
        }

        const updatedFlat = await prisma.flat.update({
            where: {
                id: result.id,
            },
            data: {
                photos: flatPhotos,
            },
        });

        return updatedFlat;
    }

    return result;
};

const updateFlatInfoIntoDB = async (
    userId: string,
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
    const {
        searchTerm,
        minRent,
        maxRent,
        minBedrooms,
        maxBedrooms,
        ...filterData
    } = params;
    let { limit, page, skip, sortBy, sortOrder } =
        paginationHelper.calculatePagination(options);

    if (sortBy && !flatSortableFields.includes(sortBy)) {
        sortBy = "createdAt";
        sortOrder = "desc";
    }

    const andConditions: Prisma.FlatWhereInput[] = [];

    if (searchTerm) {
        andConditions.push({
            OR: flatSearchTermFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }

    if (minRent && maxRent) {
        andConditions.push({
            rent: {
                gte: Number(minRent),
                lte: Number(maxRent),
            },
        });
    } else if (minRent) {
        andConditions.push({
            rent: {
                gte: Number(minRent),
            },
        });
    } else if (maxRent) {
        andConditions.push({
            rent: {
                lte: Number(maxRent),
            },
        });
    }

    if (minBedrooms && maxBedrooms) {
        andConditions.push({
            totalBedrooms: {
                gte: Number(minBedrooms),
                lte: Number(maxBedrooms),
            },
        });
    } else if (minBedrooms) {
        andConditions.push({
            totalBedrooms: {
                gte: Number(minBedrooms),
            },
        });
    } else if (maxBedrooms) {
        andConditions.push({
            totalBedrooms: {
                lte: Number(maxBedrooms),
            },
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
        include: {
            userFlats: true,
        },
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

const getMyFlatsFromDB = async (
    userId: string,
    options: TPaginationOptions
) => {
    let { limit, page, skip } = paginationHelper.calculatePagination(options);

    const userFlats = await prisma.userFlat.findMany({
        where: {
            userId: userId,
        },
        include: {
            flat: true,
        },
        skip: skip,
        take: limit,
    });

    const total = await prisma.userFlat.count({
        where: {
            userId: userId,
        },
    });

    return {
        meta: {
            total,
            page,
            limit,
        },
        data: userFlats.map((userFlat) => userFlat.flat),
    };
};

const removePhotosFromDB = async (
    userId: string,
    flatId: string,
    photos: string[]
) => {
    const userFlat = await prisma.userFlat.findFirst({
        where: {
            userId: userId,
            flatId: flatId,
        },
    });

    if (!userFlat) {
        throw new Error("You are not authorized to perform this action");
    }

    const flat = await prisma.flat.findFirstOrThrow({
        where: {
            id: flatId,
        },
    });

    if (!photos.length) {
        return flat;
    }

    const removedPhotos: string[] = [];

    for (const photo of photos) {
        const a = await fileUploader.removeFileFromCloudinary(photo);
        removedPhotos.push(photo);
    }

    const updatedPhotos = flat.photos.filter(
        (photo) => !removedPhotos.includes(photo)
    );
    const updatedFlat = await prisma.flat.update({
        where: {
            id: flatId,
        },
        data: {
            photos: updatedPhotos,
        },
    });

    return updatedFlat;
};

const deleteSingleFlatFromDB = async (userId: string, flatId: string) => {
    const userFlat = await prisma.userFlat.findFirstOrThrow({
        where: {
            userId: userId,
            flatId: flatId,
        },
    });

    if (!userFlat) {
        throw new Error("You are not authorized to perform this action");
    }

    const result = await prisma.$transaction(async (tsc) => {
        const deleteUserFlat = await tsc.userFlat.delete({
            where: {
                flatId_userId: {
                    flatId: flatId,
                    userId: userId,
                },
            },
        });

        if (!deleteUserFlat) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                "Failed to delete user flat"
            );
        }

        const deleteFlat = await tsc.flat.delete({
            where: {
                id: flatId,
                availability: true,
            },
        });
        console.log("deleteFlat", deleteFlat);

        if (!deleteFlat) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete flat");
        }

        return;
    });

    return result;
};

const getFlatByIdFromDB = async (flatId: string) => {
    const result = await prisma.flat.findFirstOrThrow({
        where: {
            id: flatId,
        },
    });

    return result;
};

export const FlatServices = {
    addFlatIntoDB,
    getMyFlatsFromDB,
    getAllFlatsFromDB,
    updateFlatInfoIntoDB,
    removePhotosFromDB,
    deleteSingleFlatFromDB,
    getFlatByIdFromDB,
};
