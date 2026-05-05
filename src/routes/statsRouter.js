import express from "express";
import { getStats } from "../controllers/statsController.js";
import superAdminOnly from "../middlewares/superAdminOnly.js";
import { userAuth } from "../middlewares/userAuth.js";

const router = express.Router();

router.get("/", userAuth, superAdminOnly, getStats);

export default router;