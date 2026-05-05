import { verifyToken } from "../utils/jwthelper.js";
import User from "../models/User.js";

export const userAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    const { userId } = decoded;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(401).json({ message: "Unauthorized - User not found" });
    }
    req.user = user;
    next();
};