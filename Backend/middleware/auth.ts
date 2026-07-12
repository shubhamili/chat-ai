import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET!;

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

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        const user = await userModel.findOne({ id: decoded.id });

        if (!user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        req.user = {
            id: user.id,
            username: user.username,
        };

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token",
        });
    }
};