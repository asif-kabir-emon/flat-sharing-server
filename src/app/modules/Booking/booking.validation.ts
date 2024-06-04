import { z } from "zod";

const flatBookingRequestValidationSchema = z.object({
    body: z.object({
        flatId: z.string({
            required_error: "Flat ID is required.",
        }),
        message: z.string().optional(),
        contactNumber: z.string({
            required_error: "User contact number is required.",
        }),
    }),
});

export const BookingValidations = {
    flatBookingRequestValidationSchema,
};
