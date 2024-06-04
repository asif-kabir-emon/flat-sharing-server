import { JwtPayload } from "jsonwebtoken";
import prisma from "../../utils/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { BookingStatus } from "@prisma/client";

const flatBookingIntoDB = async (user: JwtPayload, data: any) => {
    const isFlatExist = await prisma.flat.findUniqueOrThrow({
        where: {
            id: data.flatId,
            availability: true,
        },
    });

    if (!isFlatExist) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "Flat not found or not available"
        );
    }

    const isUserFlatOwner = await prisma.userFlat.findFirst({
        where: {
            userId: user.id,
            flatId: data.flatId,
        },
    });

    if (isUserFlatOwner) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "You can't book your own flat"
        );
    }

    const result = await prisma.booking.create({
        data: {
            flatId: data.flatId,
            userId: user.id,
            message: data?.message,
            contactNumber: data.contactNumber,
            status: BookingStatus.PENDING,
        },
    });

    if (!result) {
        throw new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Failed to book the flat"
        );
    }

    return result;
};

const getBookingRequestsFromDB = async (user: JwtPayload) => {
    const flatUser = await prisma.userFlat.findMany({
        where: {
            userId: user.id,
        },
    });

    const flatIds = flatUser.map((flat) => flat.flatId);

    if (!flatIds.length) {
        return;
    }

    const result = await prisma.booking.findMany({
        where: {
            flatId: {
                in: flatIds,
            },
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    userProfile: true,
                },
            },
            flat: true,
        },
    });

    return result;
};

const updateBookingStatusIntoDB = async (
    userId: string,
    bookingId: string,
    bookingStatus: BookingStatus
) => {
    const booking = await prisma.booking.findUniqueOrThrow({
        where: {
            id: bookingId,
        },
    });

    const userFlat = await prisma.userFlat.findUniqueOrThrow({
        where: {
            flatId_userId: {
                flatId: booking.flatId,
                userId: userId,
            },
        },
    });

    if (userFlat?.userId !== userId) {
        throw new ApiError(
            httpStatus.FORBIDDEN,
            "You are not authorized to update the booking status"
        );
    }

    if (booking.status === BookingStatus.BOOKED) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "You can't update the status of a booked flat"
        );
    }
    if (booking.status === BookingStatus.REJECTED) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "You can't reject the booking request"
        );
    }

    const result = await prisma.$transaction(async (tsc) => {
        const booking = await tsc.booking.update({
            where: {
                id: bookingId,
            },
            data: {
                status: bookingStatus,
            },
        });

        if (bookingStatus === BookingStatus.BOOKED) {
            await tsc.flat.update({
                where: {
                    id: booking.flatId,
                },
                data: {
                    availability: false,
                },
            });
        }

        return booking;
    });

    return result;
};

export const BookingServices = {
    flatBookingIntoDB,
    getBookingRequestsFromDB,
    updateBookingStatusIntoDB,
};
