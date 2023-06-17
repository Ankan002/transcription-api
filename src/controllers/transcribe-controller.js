import { getReplicateInstance } from "../utils/get-replicate-instance.js";
import fs from "node:fs/promises";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const transcribeAudio = async (req, res) => {
    const audioFile = req.files?.audioFile;

    if (!audioFile) {
        return res.status(400).json({
            success: false,
            error: "No audio file received!!",
        });
    }

    if (audioFile["mimetype"] !== "audio/mpeg") {
        return res.status(400).json({
            success: false,
            error: "Only .mp3 files are allowed!!",
        });
    }

    try {
        const replicate = getReplicateInstance();

        const model =
            "meronym/speaker-transcription:9950ee297f0fdad8736adf74ada54f63cc5b5bdfd5b2187366910ed5baf1a7a1";
        const modelInputData = {
            audio: `data:audio/mpeg;base64,${audioFile["data"].toString(
                "base64"
            )}`,
        };

        const result = await replicate.run(model, {
            input: modelInputData,
        });

        await fs.unlink(audioFile["tempFilePath"]);

        return res.status(200).json({
            success: true,
            data: {
                result,
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);

            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }

        console.log(error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error!!",
        });
    }
};
