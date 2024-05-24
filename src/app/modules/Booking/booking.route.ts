import express from "express";
import { BookingControllers } from "./booking.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { BookingValidations } from "./booking.validation";

const router = express.Router();

router.post(
    "/booking-applications",
    auth(),
    validateRequest(BookingValidations.flatBookingRequestValidationSchema),
    BookingControllers.flatBooking
);

router.get("/booking-requests", auth(), BookingControllers.getBookingRequests);

router.put(
    "/booking-requests/:bookingId",
    auth(),
    BookingControllers.updateBookingStatus
);

export const BookingRoutes = router;
