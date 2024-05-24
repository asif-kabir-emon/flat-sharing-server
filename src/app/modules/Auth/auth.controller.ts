import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUserIntoDB(req.body);

    const { data, refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === "production" ? true : false,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: data,
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Token refreshed successfully",
        data: result,
    });
});

const sendVerificationEmail = catchAsync(async (req, res) => {
    const result = await AuthServices.sendVerificationEmail(
        req.user.id,
        req.user.email
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Verification email sent successfully",
        data: result,
    });
});

const VerifyEmail = catchAsync(async (req, res) => {
    const result = await AuthServices.verifyEmail(req.user.id, req.body.otp);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Email verified successfully",
        data: result,
    });
});

const changePassword = catchAsync(async (req, res) => {
    const result = await AuthServices.changePassword(req.user.id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Password changed successfully",
        data: result,
    });
});

export const AuthControllers = {
    loginUser,
    refreshToken,
    sendVerificationEmail,
    VerifyEmail,
    changePassword,
};
