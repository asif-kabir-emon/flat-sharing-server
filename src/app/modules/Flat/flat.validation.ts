import { map, z } from "zod";

const createFlatValidationSchema = z.object({
    body: z.object({
        squareFeet: z
            .number({
                required_error: "Square feet is required.",
            })
            .int({
                message: "Square feet must be an integer",
            })
            .positive({
                message: "Square feet must be positive",
            }),
        totalBedrooms: z
            .number({
                required_error: "Total bedrooms is required.",
            })
            .int({
                message: "Total bedrooms must be an integer.",
            })
            .positive({
                message: "Total bedrooms must be positive.",
            }),
        totalRooms: z
            .number({
                required_error: "Total rooms is required.",
            })
            .int({
                message: "Total rooms must be an integer.",
            })
            .positive({
                message: "Total rooms must be positive.",
            }),
        utilitiesDescription: z.string({
            required_error: "Utilities description is required.",
        }),
        location: z.string({
            required_error: "Location is required.",
        }),
        mapLocation: z
            .array(z.number())
            .length(2, {
                message: "Map location must have 2 values.",
            })
            .optional(),
        description: z.string({
            required_error: "Description is required.",
        }),
        rent: z
            .number({
                required_error: "Rent is required.",
            })
            .int({
                message: "Rent must be an integer.",
            })
            .positive({
                message: "Rent must be positive.",
            }),
        advanceAmount: z
            .number({
                required_error: "Advance amount is required.",
            })
            .int({
                message: "Advance amount must be an integer.",
            })
            .positive({
                message: "Advance amount must be positive.",
            }),
    }),
});

const updateFlatValidationSchema = z.object({
    body: z.object({
        squareFeet: z
            .number()
            .int({
                message: "Square feet must be an integer.",
            })
            .positive({
                message: "Square feet must be positive.",
            })
            .optional(),
        totalBedrooms: z
            .number()
            .int({
                message: "Total bedrooms must be an integer.",
            })
            .positive({
                message: "Total bedrooms must be positive.",
            })
            .optional(),
        totalRooms: z
            .number()
            .int({
                message: "Total rooms must be an integer.",
            })
            .positive({
                message: "Total rooms must be positive.",
            })
            .optional(),
        utilitiesDescription: z.string().optional(),
        location: z.string().optional(),
        description: z.string().optional(),
        rent: z
            .number()
            .int({
                message: "Rent must be an integer.",
            })
            .positive({
                message: "Rent must be positive.",
            })
            .optional(),
        advanceAmount: z
            .number()
            .int({
                message: "Advance amount must be an integer.",
            })
            .positive({
                message: "Advance amount must be positive.",
            })
            .optional(),
    }),
});

const removeFlatPhotosValidationSchema = z.object({
    body: z.object({
        photos: z.array(z.string(), {
            required_error: "Photos are required.",
        }),
    }),
});

export const FlatValidations = {
    createFlatValidationSchema,
    updateFlatValidationSchema,
    removeFlatPhotosValidationSchema,
};
