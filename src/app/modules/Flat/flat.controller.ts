import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FlatServices } from "./flat.service";
import { pick } from "../../utils/pick";
import { flatSearchableFields } from "./flat.constant";

const addFlat = catchAsync(async (req, res) => {
    const { user } = req;
    const result = await FlatServices.addFlatIntoDB(user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Flat added successfully",
        data: result,
    });
});

const updateFlat = catchAsync(async (req, res) => {
    const { user } = req;
    const { flatId } = req.params;
    const result = await FlatServices.updateFlatInfoIntoDB(
        user,
        flatId,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Flat information updated successfully",
        data: result,
    });
});

const getAllFlats = catchAsync(async (req, res) => {
    const filters = pick(req.query, flatSearchableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await FlatServices.getAllFlatsFromDB(filters, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Flats retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

export const FlatControllers = {
    addFlat,
    updateFlat,
    getAllFlats,
};
