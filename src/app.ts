import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

const app: Application = express();

app.use(
    cors({
        origin: ["http://localhost:3000"],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Flat Sharing Application Server!");
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use("*", (req, res) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Requested path not found",
        },
    });
});

export default app;
