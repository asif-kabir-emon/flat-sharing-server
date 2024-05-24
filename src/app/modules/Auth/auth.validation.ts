import { z } from "zod";

const userLoginValidationSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: "Email is required.",
            })
            .email({
                message: "Invalid email.",
            }),
        password: z.string({
            required_error: "Password is required.",
        }),
    }),
});

const userEmailVerificationValidationSchema = z.object({
    body: z.object({
        otp: z
            .string({
                required_error: "OTP is required.",
            })
            .length(6, {
                message: "OTP must be 6 characters long.",
            }),
    }),
});

const userChangePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({
            required_error: "Old password is required.",
        }),
        newPassword: z
            .string({
                required_error: "New password is required.",
            })
            .min(6, {
                message: "Password must be at least 6 characters long.",
            }),
    }),
});

export const AuthValidations = {
    userLoginValidationSchema,
    userEmailVerificationValidationSchema,
    userChangePasswordValidationSchema,
};
