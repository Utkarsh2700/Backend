import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controller.js";
import { get } from "mongoose";

const router = Router();

router.route("/") / get(healthCheck);

export default router;
