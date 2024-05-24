import { z } from "zod";

const flatBookingRequestValidationSchema = z.object({
    body: z.object({
        flatId: z.string({
            required_error: "Flat ID is required.",
        }),
    }),
});

export const BookingValidations = {
    flatBookingRequestValidationSchema,
};
