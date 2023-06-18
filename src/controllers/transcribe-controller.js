import { getReplicateInstance } from "../utils/get-replicate-instance.js";
import fs from "node:fs/promises";
import nodeFs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const replaceFile = (audioFile) => {
    const uuid = crypto.randomUUID();

    const replacePromise = new Promise((resolve, reject) => {
        if (!nodeFs.existsSync(path.join(process.cwd(), "/tmp"))) {
            console.log("here!!");
            nodeFs.mkdirSync(path.join(process.cwd(), "/tmp"));
        }

        audioFile.mv(path.join(process.cwd(), `/tmp/${uuid}`), (err) => {
            if (err) {
                reject(err);
            }

            resolve(uuid);
        });
    });

    return replacePromise;
};

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
        const newFileName = await replaceFile(audioFile);

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

        let jsonResult;

        if(result){
            const response = await fetch(`${result}`, {
                method: "GET",
            });

            jsonResult = await response.json();
        }

        await fs.unlink(path.join(process.cwd(), `/tmp/${newFileName}`));

        return res.status(200).json({
            success: true,
            data: {
                result: jsonResult,
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
