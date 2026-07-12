import express from "express";
import { chatController } from "../controllers/chat.controller.ts";
import { login, register } from "../controllers/auth.controller.ts";
import { auth } from "../middleware/auth.ts";


export const Router_ = express.Router();

Router_.post("/chat", auth, chatController);


Router_.post("/register", register);
Router_.post("/login", login);