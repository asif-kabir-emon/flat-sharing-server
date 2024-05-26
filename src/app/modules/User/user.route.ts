import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "@prisma/client";

const router = express.Router();

router.post(
    "/create-user",
    validateRequest(UserValidations.userRegisterValidationSchema),
    userControllers.registerUser
);

router.get(
    "/me",
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    userControllers.getMyProfile
);

router.get("/profile", auth(USER_ROLE.ADMIN), userControllers.getUserProfile);

router.get("/", auth(USER_ROLE.ADMIN), userControllers.getAllUsers);

router.put(
    "/profile",
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    validateRequest(UserValidations.userProfileUpdateValidationSchema),
    userControllers.updateUserProfile
);

router.put(
    "/role/:userId",
    auth(USER_ROLE.ADMIN),
    validateRequest(UserValidations.userRoleUpdateValidationSchema),
    userControllers.updateUserRole
);

router.put(
    "/status/:userId",
    auth(USER_ROLE.ADMIN),
    validateRequest(UserValidations.userStatusUpdateValidationSchema),
    userControllers.updateUserStatus
);

export const UserRoutes = router;
