import { JwtPayload } from "jsonwebtoken";
import prisma from "../../utils/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { BookingStatus } from "@prisma/client";

const flatBookingIntoDB = async (user: JwtPayload, flatId: string) => {
    const isFlatExist = await prisma.flat.findUniqueOrThrow({
        where: {
            id: flatId,
            availability: true,
        },
    });

    if (!isFlatExist) {
        throw new ApiError(
            httpStatus.NOT_FOUND,
            "Flat not found or not available"
        );
    }

    const result = await prisma.booking.create({
        data: {
            flatId: flatId,
            userId: user.id,
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
    const result = await prisma.booking.findMany({
        where: {
            userId: user.id,
        },
    });

    return result;
};

const updateBookingStatusIntoDB = async (
    bookingId: string,
    bookingStatus: BookingStatus
) => {
    await prisma.booking.findUniqueOrThrow({
        where: {
            id: bookingId,
        },
    });

    const result = await prisma.$transaction(async (transactionClient) => {
        const booking = await transactionClient.booking.update({
            where: {
                id: bookingId,
            },
            data: {
                status: bookingStatus,
            },
        });

        if (bookingStatus === BookingStatus.BOOKED) {
            await transactionClient.flat.update({
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
