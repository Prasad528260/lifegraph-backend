// routes/graphRoutes.js
import express from "express";
import { getGraph } from "../controllers/graphController.js";
import { userAuth } from "../middlewares/userAuth.js";

const graphRouter = express.Router();

graphRouter.get("/get", userAuth, getGraph);

export default graphRouter;