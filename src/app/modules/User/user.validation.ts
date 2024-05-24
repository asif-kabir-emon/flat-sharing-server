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

export const UserValidations = {
    userRegisterValidationSchema,
    userProfileUpdateValidationSchema,
};
