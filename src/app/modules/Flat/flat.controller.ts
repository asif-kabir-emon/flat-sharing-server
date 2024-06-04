import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FlatServices } from "./flat.service";
import { pick } from "../../utils/pick";
import { flatSearchableFields } from "./flat.constant";

const addFlat = catchAsync(async (req, res) => {
    console.log("req.body", req.body);
    const result = await FlatServices.addFlatIntoDB(req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Flat added successfully",
        data: result,
    });
});

const updateFlat = catchAsync(async (req, res) => {
    const { flatId } = req.params;
    const result = await FlatServices.updateFlatInfoIntoDB(
        req.user.id,
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
        data: result,
    });
});

const removeFlatPhotos = catchAsync(async (req, res) => {
    const { flatId } = req.params;
    const { photos } = req.body;
    const { id } = req.user;
    const result = await FlatServices.removePhotosFromDB(id, flatId, photos);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Photos removed successfully",
        data: result,
    });
});

const getMyFlats = catchAsync(async (req, res) => {
    const { id } = req.user;
    const options = pick(req.query, ["limit", "page"]);
    const result = await FlatServices.getMyFlatsFromDB(id, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Flats retrieved successfully",
        data: result,
    });
});

const deleteSingleFlat = catchAsync(async (req, res) => {
    const { flatId } = req.params;
    const result = await FlatServices.deleteSingleFlatFromDB(
        req.user.id,
        flatId
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Flat deleted successfully",
        data: result,
    });
});

const getFlatById = catchAsync(async (req, res) => {
    const { flatId } = req.params;
    const result = await FlatServices.getFlatByIdFromDB(flatId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Flat retrieved successfully",
        data: result,
    });
});

export const FlatControllers = {
    addFlat,
    updateFlat,
    getAllFlats,
    removeFlatPhotos,
    getMyFlats,
    deleteSingleFlat,
    getFlatById,
};
