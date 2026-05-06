import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import authRouter from "./src/routes/authRouter.js";
import capsuleRouter from "./src/routes/capsuleRouter.js";
import graphRouter from "./src/routes/graphRouter.js";
import institutionRouter from "./src/routes/institutionRouter.js";
import trustRouter from "./src/routes/trustRouter.js";
import accessRouter from "./src/routes/accessRouter.js";
import logsRouter from "./src/routes/logsRouter.js";
import statsRoutes from "./src/routes/statsRouter.js";

dotenv.config();
const PORT = process.env.PORT || 5000;


app.use("/auth", authRouter);
app.use("/capsule", capsuleRouter);
app.use("/graph", graphRouter);
app.use("/institutions", institutionRouter);
app.use("/trust", trustRouter);
app.use("/access", accessRouter);
app.use("/logs", logsRouter);
app.use("/stats", statsRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to LifeGraph");
});

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.log("Failed to connect to database", err);
});