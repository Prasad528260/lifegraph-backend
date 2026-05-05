import express from "express";
import { getTrust, addTrustEvent, fileComplaint } from "../controllers/trustController.js";
import {userAuth} from "../middlewares/userAuth.js";
import superAdminOnly from "../middlewares/superAdminOnly.js";

const trustRouter = express.Router();

// anyone logged in can view trust score
trustRouter.get("/:institutionId", userAuth, getTrust);
trustRouter.post("/complaint", userAuth, fileComplaint);

// only super admin can trigger trust events
trustRouter.post("/event", userAuth, superAdminOnly, addTrustEvent);

export default trustRouter;