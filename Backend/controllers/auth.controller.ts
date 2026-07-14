import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET!;

interface MyJwtPayload extends JwtPayload {
    id: string;
    username: string
}

const createToken = (payload: MyJwtPayload) => {
    return jwt.sign(payload, JWT_SECRET, {
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
            username,
            password: hashedPassword,
        });

        console.log('user created ==============>', user)

        // const token = createToken({ id: user._id.toString(), username: user.username });

        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000,
        // });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
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

        console.log('user logged in ==============>', user)

        const token = createToken({ id: user._id.toString(), username: user.username });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
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

export const logout = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.json({
        message: "Logout successful",
    });
};

export const me = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;
        // console.log('token', token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;

        // console.log("Decoded token:", decoded);
        const user = await userModel.findById(decoded.id.toString());
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.json({
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
