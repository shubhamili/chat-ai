import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET!;

const createToken = (id: string) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username?.trim() || !password?.trim()) {
            return res.status(400).json({
                message: "Username and password are required",
            });
        }

        console.log("Registering user:", username);

        const exists = await userModel.findOne({ username });

        if (exists) {
            return res.status(409).json({
                message: "Username already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            id: crypto.randomUUID(),
            username,
            password: hashedPassword,
        });

        const token = createToken(user.id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                username: user.username,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        if (!username?.trim() || !password?.trim()) {
            return res.status(400).json({
                message: "Username and password are required",
            });
        }

        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = createToken(user.id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal server error",
        });
    }
};