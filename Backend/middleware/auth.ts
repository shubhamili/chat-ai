import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET!;

interface MyJwtPayload extends JwtPayload {
    id: string;
    username: string;
}

export interface AuthRequest extends Request {
    user?: {
        id: string;
        username: string;
    };
}

export const auth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === "string") {
            return res.status(401).json({
                message: "Invalid token",
            });
        }

        const payload = decoded as MyJwtPayload;

        const user = await userModel.findById(payload.id);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        req.user = {
            id: user._id.toString(),
            username: user.username,
        };

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
};