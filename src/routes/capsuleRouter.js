import express from "express";
import { userAuth } from "../middlewares/userAuth.js";
import { getCapsule, updateCapsule } from "../controllers/capsuleController.js";

const capsuleRouter = express.Router();

capsuleRouter.get("/get",userAuth ,getCapsule);
capsuleRouter.put("/update", userAuth, updateCapsule);

export default capsuleRouter;