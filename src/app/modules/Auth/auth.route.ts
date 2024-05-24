import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "@prisma/client";

const router = express.Router();

router.post(
    "/login",
    validateRequest(AuthValidations.userLoginValidationSchema),
    AuthControllers.loginUser
);

router.post("/refresh-token", AuthControllers.refreshToken);

router.post(
    "/send-verification-email",
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    AuthControllers.sendVerificationEmail
);

router.post(
    "/verify-email",
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    validateRequest(AuthValidations.userEmailVerificationValidationSchema),
    AuthControllers.VerifyEmail
);

export const AuthRoutes = router;
