import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";

const flatBooking = catchAsync(async (req, res) => {
    const { flatId } = req.body;
    const { user } = req;
    const result = await BookingServices.flatBookingIntoDB(user, flatId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Booking requests submitted successfully",
        data: result,
    });
});

const getBookingRequests = catchAsync(async (req, res) => {
    const { user } = req;
    const result = await BookingServices.getBookingRequestsFromDB(user);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Booking requests retrieved successfully",
        data: result,
    });
});

const updateBookingStatus = catchAsync(async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;
    const result = await BookingServices.updateBookingStatusIntoDB(
        bookingId,
        status
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Booking status updated successfully",
        data: result,
    });
});

export const BookingControllers = {
    flatBooking,
    getBookingRequests,
    updateBookingStatus,
};
