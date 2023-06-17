import { Router } from "express";
import { transcribeAudio } from "../controllers/transcribe-controller.js";

export const transcribeRouter = Router();

transcribeRouter.route("/").post(transcribeAudio);
