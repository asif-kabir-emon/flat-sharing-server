import { TPaginationOptions } from "../interfaces/pagination";

type IOptionsResults = {
    limit: number;
    page: number;
    skip: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
};

const calculatePagination = (options: TPaginationOptions): IOptionsResults => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "desc";

    return { limit, page, skip, sortBy, sortOrder };
};

export const paginationHelper = {
    calculatePagination,
};
