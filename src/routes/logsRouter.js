import express from "express";
import {
  getAllLogs,
  getUserLogs,
  getInstitutionLogs,
} from "../controllers/logsController.js";
import {userAuth} from "../middlewares/userAuth.js";
import {adminOnly} from "../middlewares/adminOnly.js";

const logsRouter = express.Router();

// admin sees all logs
logsRouter.get("/", userAuth, getAllLogs);

// user sees their own logs, admin sees anyone's
logsRouter.get("/user/:userId", userAuth, getUserLogs);

// admin sees institution specific logs
logsRouter.get("/institution/:institutionId", userAuth, adminOnly, getInstitutionLogs);

export default logsRouter;