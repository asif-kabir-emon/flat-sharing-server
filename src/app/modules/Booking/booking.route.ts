import express from "express";
import { BookingControllers } from "./booking.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BookingValidations } from "./booking.validation";
import { USER_ROLE } from "@prisma/client";

const router = express.Router();

router.post(
    "/booking-application",
    auth(USER_ROLE.USER),
    validateRequest(BookingValidations.flatBookingRequestValidationSchema),
    BookingControllers.flatBooking
);

router.get(
    "/booking-requests",
    auth(USER_ROLE.USER),
    BookingControllers.getBookingRequests
);

router.put(
    "/booking-requests/:bookingId",
    auth(USER_ROLE.USER),
    BookingControllers.updateBookingStatus
);

export const BookingRoutes = router;
