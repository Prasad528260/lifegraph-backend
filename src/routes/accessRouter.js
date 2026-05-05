import express from "express";
import { requestAccess } from "../controllers/accessController.js";
import {userAuth} from "../middlewares/userAuth.js";

const accessRouter = express.Router();

// protect — any logged in user can simulate an access request
// in real world this would be institution token
// for this project admin triggers it on behalf of institution
accessRouter.post("/request", userAuth, requestAccess);

export default accessRouter;