import { Server } from "http";
import app from "./app";

const PORT = 4000;
let server: Server;

async function main() {
    try {
        server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
}

main();

process.on("unhandledRejection", () => {
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});

process.on("uncaughtException", () => {
    process.exit(1);
});
