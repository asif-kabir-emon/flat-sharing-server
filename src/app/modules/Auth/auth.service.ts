import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import config from "../../config";
import { jwtHelper } from "../../helpers/jwtHelper";
import sendEmail from "../../utils/sendEmail";
import generateOTP from "../../helpers/otpGenerator";

const loginUserIntoDB = async (payload: any) => {
    // check if user exist with this email
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email,
            isActive: true,
            isDeleted: false,
        },
    });

    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // check if password is correct
    const isPasswordMatch = await bcrypt.compare(
        payload.password,
        user.password
    );

    if (!isPasswordMatch) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid password");
    }

    // generate access token
    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtHelper.generateToken(
        jwtPayload,
        config.jwt.access_secret,
        config.jwt.access_token_expires_in
    );

    const refreshToken = jwtHelper.generateToken(
        jwtPayload,
        config.jwt.refresh_secret,
        config.jwt.refresh_token_expires_in
    );

    return {
        data: {
            token: accessToken,
            isEmailVerified: user.isVerified,
            needChangePassword: user.needChangePassword,
        },
        refreshToken: refreshToken,
    };
};

const refreshToken = async (token: string) => {
    const decodedData = jwtHelper.verifyToken(
        token,
        config.jwt.refresh_secret as string
    );

    if (!decodedData) {
        throw new Error("Invalid token!!! You are not authorized!");
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: decodedData.id,
            email: decodedData.email,
            role: decodedData.role,
        },
    });

    const jwtData = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
    };

    const accessToken = jwtHelper.generateToken(
        jwtData,
        config.jwt.access_secret as string,
        config.jwt.access_token_expires_in as string
    );

    return {
        accessToken,
        isEmailVerified: userData.isVerified,
        needChangePassword: userData.needChangePassword,
    };
};

const sendVerificationEmail = async (userId: string, email: string) => {
    await prisma.oTP.deleteMany({
        where: {
            userId: userId,
        },
    });

    const otp = generateOTP();

    const otpPayload = {
        userId: userId,
        otp: String(otp),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };

    const createdOtp = await prisma.oTP.create({
        data: otpPayload,
    });

    await sendEmail({
        to: email,
        subject: "Email Verification",
        text: `OTP: ${createdOtp.otp}`,
        html: `
            <div>
                <h3>OTP: ${createdOtp.otp}</h3>
                <p>Use this OTP to verify your email.</p>
                <p>OTP will expire in 5 minutes. Do not share this OTP with anyone.</p>
            </div>
        `,
    });

    return;
};

const verifyEmail = async (userId: string, otp: string) => {
    const otpData = await prisma.oTP.findFirst({
        where: {
            userId: userId,
            otp: otp,
            expiresAt: {
                gte: new Date(),
            },
        },
    });

    if (!otpData) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
    }

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            isVerified: true,
        },
    });

    return;
};

export const AuthServices = {
    loginUserIntoDB,
    refreshToken,
    sendVerificationEmail,
    verifyEmail,
};
