import express from "express";
import { UserRoutes } from "../modules/User/user.route";
import { FlatRoutes } from "../modules/Flat/flat.route";
import { BookingRoutes } from "../modules/Booking/booking.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
const router = express.Router();

const moduleRoutes = [
    {
        path: "/auth",
        route: AuthRoutes,
    },
    {
        path: "/user",
        route: UserRoutes,
    },
    {
        path: "/flats",
        route: FlatRoutes,
    },
    {
        path: "/bookings",
        route: BookingRoutes,
    },
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
