import express, { NextFunction, Request, Response } from "express";
import { FlatControllers } from "./flat.controller";
import validateRequest from "../../middlewares/validateRequest";
import { FlatValidations } from "./flat.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "@prisma/client";
import { fileUploader } from "../../helpers/fileUploader";

const router = express.Router();

router.get(
    "/my-flats",
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    FlatControllers.getMyFlats
);

router.get("/get-all-flats", FlatControllers.getAllFlats);

router.get("/:flatId", FlatControllers.getFlatById);

router.post(
    "/add-flat",
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    fileUploader.upload.array("files", 10),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    FlatControllers.addFlat
);

router.put(
    "/update-flat/:flatId",
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    validateRequest(FlatValidations.updateFlatValidationSchema),
    FlatControllers.updateFlat
);

router.delete(
    "/delete-flat/:flatId",
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    FlatControllers.deleteSingleFlat
);

router.delete(
    "/:flatId/photos",
    auth(USER_ROLE.ADMIN, USER_ROLE.USER),
    validateRequest(FlatValidations.removeFlatPhotosValidationSchema),
    FlatControllers.removeFlatPhotos
);

export const FlatRoutes = router;
