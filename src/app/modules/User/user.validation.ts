import { USER_ROLE } from "@prisma/client";
import { z } from "zod";

const userRegisterValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: "Name is required.",
            })
            .min(3, {
                message: "Name is too short.",
            })
            .max(255),
        email: z
            .string({
                required_error: "Email is required.",
            })
            .email({
                message: "Invalid email.",
            }),
        password: z
            .string({
                required_error: "Password is required.",
            })
            .min(6, {
                message: "Password is too short.",
            }),
    }),
});

const userProfileUpdateValidationSchema = z.object({
    body: z.object({
        bio: z.string().max(255).optional(),
        profession: z.string().optional(),
        address: z.string().optional(),
    }),
});

const userRoleUpdateValidationSchema = z.object({
    body: z.object({
        role: z
            .enum([USER_ROLE.USER, USER_ROLE.ADMIN], {
                required_error: "Role is required.",
            })
            .transform((val) => val.toUpperCase()),
    }),
});

const userStatusUpdateValidationSchema = z.object({
    body: z.object({
        isActive: z.boolean({
            required_error: "isActive is required.",
        }),
    }),
});

const changeEmailValidationSchema = z.object({
    body: z.object({
        newEmail: z
            .string({
                required_error: "Email is required.",
            })
            .email({
                message: "Invalid email.",
            }),
        otp: z
            .string({
                required_error: "OTP is required.",
            })
            .min(6, {
                message: "OTP is too short.",
            })
            .max(6, {
                message: "OTP is too long.",
            }),
    }),
});

export const UserValidations = {
    userRegisterValidationSchema,
    userProfileUpdateValidationSchema,
    userRoleUpdateValidationSchema,
    userStatusUpdateValidationSchema,
    changeEmailValidationSchema,
};
