import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.get("/", (req, res) => {
  res.send("Backend Running");
});
app.use(express.json());
app.use(cookieParser());

export default app;

