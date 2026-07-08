import express from "express";
import { chatController } from "../controllers/chat.controller.ts";


export const chatRouter = express.Router();

chatRouter.post("/post", chatController);