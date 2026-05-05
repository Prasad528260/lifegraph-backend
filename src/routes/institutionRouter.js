import express from "express";
import {
  addInstitution,
  getInstitutions,
  getInstitutionById,
} from "../controllers/institutionController.js";
import { userAuth } from "../middlewares/userAuth.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const institutionRouter = express.Router();

// admin only
institutionRouter.post("/add", userAuth, adminOnly, addInstitution);

// any logged in user
institutionRouter.get("/", userAuth, getInstitutions);
institutionRouter.get("/:id", userAuth, getInstitutionById);

export default institutionRouter;