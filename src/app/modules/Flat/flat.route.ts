import express from "express";
import { FlatControllers } from "./flat.controller";
import validateRequest from "../../middlewares/validateRequest";
import { FlatValidations } from "./flat.validation";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
    "/",
    auth(),
    validateRequest(FlatValidations.createFlatValidationSchema),
    FlatControllers.addFlat
);

router.put(
    "/:flatId",
    auth(),
    validateRequest(FlatValidations.updateFlatValidationSchema),
    FlatControllers.updateFlat
);

router.get("/", FlatControllers.getAllFlats);

export const FlatRoutes = router;
