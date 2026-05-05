import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import authRouter from "./routes/authRouter.js";
import capsuleRouter from "./routes/capsuleRouter.js";
import graphRouter from "./routes/graphRouter.js";
import institutionRouter from "./routes/institutionRouter.js";
import trustRouter from "./routes/trustRouter.js";
import accessRouter from "./routes/accessRouter.js";
import logsRouter from "./routes/logsRouter.js";
import statsRoutes from "./routes/statsRouter.js";

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

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.log("Failed to connect to database", err);
});