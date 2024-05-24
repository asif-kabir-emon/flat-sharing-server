import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import { fieldsToUpdate } from "./user.constant";

const registerUser = catchAsync(async (req, res) => {
    const result = await UserServices.registerUserIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});

const getUserProfile = catchAsync(async (req, res) => {
    const result = await UserServices.getUserProfileFromDB(req.user.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile retrieved successfully",
        data: result,
    });
});

const updateUserProfile = catchAsync(async (req, res) => {
    const payload: any = {};

    fieldsToUpdate.forEach((key) => {
        if (req.body.hasOwnProperty(key)) {
            payload[key] = req.body[key];
        }
    });

    const result = await UserServices.updateProfileIntoDB(req.user.id, payload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile updated successfully",
        data: result,
    });
});

const getMyProfile = catchAsync(async (req, res) => {
    const result = await UserServices.getMyProfileFromDB(req.user.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile retrieved successfully",
        data: result,
    });
});

export const userControllers = {
    registerUser,
    getUserProfile,
    updateUserProfile,
    getMyProfile,
};
