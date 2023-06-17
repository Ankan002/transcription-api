import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { transcribeRouter } from "./router/transcribe-router.js";

export const startServer = () => {
    const app = express();
    const PORT = process.env["PORT"];

    app.use(cors());

    app.use(express.json());
    app.use(
        fileUpload({
            useTempFiles: true,
            limits: {
                fileSize: 12 * 1024 * 1024,
            },
        })
    );

    app.get("/", (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Hello from transcription API!!",
        });
    });

    app.use("/api/transcribe", transcribeRouter);

    app.listen(PORT, () => console.log("App is running!!"));
};
