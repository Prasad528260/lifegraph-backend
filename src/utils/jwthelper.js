import jwt from "jsonwebtoken";
const isProd = process.env.NODE_ENV === "production";
export const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: isProd,  // production only
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};